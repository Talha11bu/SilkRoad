package com.talha11bu.silkroad.services;

import com.talha11bu.silkroad.model.*;
import com.talha11bu.silkroad.repo.FilesRepo;
import com.talha11bu.silkroad.repo.SessionRepo;
import com.talha11bu.silkroad.repo.UserRepo;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Core service orchestrating anonymous session lifecycle and file operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepo sessionRepo;
    private final UserRepo userRepo;
    private final FilesRepo filesRepo;
    private final SessionIdGenerator idGenerator;
    private final JwtTokenService jwtTokenService;
    private final NotiffService notiffService;
    private final R2Service r2Service;

    @Transactional
    public CreateResponse createSession(CreateRequest request) {
        try {
            String newSessionId = idGenerator.generatedId();
            Instant expiration = Instant.now().plus(request.duration());

            Session savedSession = sessionRepo.save(new Session(newSessionId, request.password(), expiration));
            String token = registerParticipant(savedSession, true);

            return new CreateResponse(true, token, savedSession, request.duration(), true);
        } catch (Exception e) {
            log.error("Failed to create session", e);
            return new CreateResponse(false, null, null, null, false);
        }
    }

    @Transactional
    public JoinResponse joinSession(JoinRequest request) {
        try {
            Session session = sessionRepo.findById(request.sessionId()).orElseThrow();

            if (!request.password().equals(session.getPassword()) || session.isExpired()) {
                return new JoinResponse(false, null, null, null, false);
            }

            Duration timeLeft = Duration.between(Instant.now(), session.getExpiresAt());
            if (timeLeft.isNegative()) {
                return new JoinResponse(false, null, null, null, false);
            }

            String token = registerParticipant(session, false);
            notiffService.notifySessionMembers(session.getSessionId(), new SessionNotiff(
                    SessionNotiff.NotifyType.USER_JOINED,
                    session.getSessionId(),
                    String.valueOf(session.getUserCount())));

            return new JoinResponse(true, token, session, timeLeft, false);
        } catch (Exception e) {
            return new JoinResponse(false, null, null, null, false);
        }
    }

    @Transactional(readOnly = true)
    public JoinResponse rejoinSession(String token) {
        try {
            Claims claims = jwtTokenService.validateAndParseToken(token);
            String sessionId = jwtTokenService.extractSessionId(claims);
            boolean isHost = jwtTokenService.isHost(claims);

            Session session = sessionRepo.findById(sessionId).orElseThrow();
            if (session.isExpired()) {
                return new JoinResponse(false, null, null, null, false);
            }

            // Touch lazy collections within the read-only transaction before serialization
            session.getUserCount();
            session.getFiles().size();
            Duration timeLeft = Duration.between(Instant.now(), session.getExpiresAt());

            return new JoinResponse(true, token, session, timeLeft, isHost);
        } catch (Exception e) {
            return new JoinResponse(false, null, null, null, false);
        }
    }

    public Map<String, String> getPreSignedUploadUrl(String sessionId, String fileName, String contentType,
            String token) {
        assertSessionAccess(token, sessionId, "You do not have access to this session.");
        sessionRepo.findById(sessionId).orElseThrow(() -> new NoSuchElementException("Session not found."));
        return r2Service.generatePreSignedUploadUrl(sessionId, fileName, contentType);
    }

    @Transactional
    public UploadResponse confirmFileUpload(String sessionId, String fileName, String fileKey, long fileSize,
            String token) {
        assertSessionAccess(token, sessionId, "You do not have access to this session.");

        Session session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found."));

        filesRepo.save(new Files(fileName, fileKey, session));
        notiffService.notifySessionMembers(sessionId,
                new SessionNotiff(SessionNotiff.NotifyType.FILE_UPLOADED, sessionId, fileName));

        return new UploadResponse(fileName, "", fileSize);
    }

    public Resource downloadFile(String sessionId, String password, String filename) {
        Files file = filesRepo.findByFileNameAndSessionSessionId(filename, sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "File " + filename + " not found in session " + sessionId));

        validateDownloadAccess(file.getSession(), password, "Cannot download File Session Expired");

        try {
            return r2Service.downloadFile(file.getR2Key());
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file " + filename, e);
        }
    }

    public String getPreSignedUrlForFile(String sessionId, String fileName, String token) {
        assertSessionAccess(token, sessionId, "You do not have access to this session's files.");
        return filesRepo.findByFileNameAndSessionSessionId(fileName, sessionId)
                .map(file -> r2Service.generatePreSignedDownloadUrl(file.getR2Key(), file.getFileName()))
                .orElse(null);
    }

    public Resource downloadAllFilesAsZip(String sessionId, String password) {
        Session session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        validateDownloadAccess(session, password, "Cannot download Files Session Expired");

        List<String> r2Keys = session.getFiles().stream().map(Files::getR2Key).toList();
        if (r2Keys.isEmpty()) {
            throw new NoSuchElementException("No files available to download");
        }

        try {
            return r2Service.downloadFilesAsZip(r2Keys);
        } catch (IOException e) {
            throw new RuntimeException("Error creating ZIP file from storage", e);
        }
    }

    @Transactional
    public void endSession(String sessionId, String token) {
        Claims claims = assertSessionAccess(token, sessionId, "User not authorized to end this session");
        if (!jwtTokenService.isHost(claims)) {
            throw new SecurityException("Only the session host can end the session");
        }

        Session session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        deleteSessionAndFiles(session);
        notiffService.sessionClosedNotiff(sessionId);
    }

    @Transactional
    public void removeParticipant(String sessionId, String token) {
        Claims claims = assertSessionAccess(token, sessionId, "User not authorized for this session");
        String participantId = claims.getSubject();

        Users userToRemove = userRepo.findByParticipantIdAndSessionSessionId(participantId, sessionId)
                .orElseThrow(() -> new NoSuchElementException("Participant not found"));

        userRepo.delete(userToRemove);
        long remainingCount = Math.max(0, userRepo.countBySessionSessionId(sessionId));

        if (remainingCount == 0) {
            Session session = sessionRepo.findById(sessionId).orElse(null);
            if (session != null) {
                deleteSessionAndFiles(session);
            }
            return;
        }

        notiffService.notifySessionMembers(sessionId, new SessionNotiff(
                SessionNotiff.NotifyType.USER_LEFT,
                sessionId,
                String.valueOf(remainingCount)));
    }

    private void deleteSessionAndFiles(Session session) {
        String sessionId = session.getSessionId();
        List<String> keysToDelete = session.getFiles().stream().map(Files::getR2Key).toList();
        if (!keysToDelete.isEmpty()) {
            try {
                r2Service.deleteFiles(keysToDelete);
                log.info("Deleted {} object(s) for session {}", keysToDelete.size(), sessionId);
            } catch (Exception e) {
                throw new RuntimeException(
                        "Failed to delete storage files for session " + sessionId + ". Aborting DB deletion.", e);
            }
        }
        sessionRepo.delete(session);
        log.info("Session {} cleaned up", sessionId);
    }

    public void deleteFile(String sessionId, String fileName) {
        Files file = filesRepo.findByFileNameAndSessionSessionId(fileName, sessionId)
                .orElseThrow(() -> new NoSuchElementException("File " + fileName + " does not exist"));

        r2Service.deleteFile(file.getR2Key());
        filesRepo.delete(file);

        notiffService.notifySessionMembers(sessionId, new SessionNotiff(
                SessionNotiff.NotifyType.FILE_DELETED,
                sessionId,
                file.getFileName()));
    }

    /**
     * Scheduled cleanup job running every 5 minutes to purge expired and abandoned sessions.
     */
    @Scheduled(fixedRate = 300_000)
    @Transactional
    public void cleanupExpiredSessions() {
        Instant now = Instant.now();
        Instant graceTime = now.minus(2, ChronoUnit.MINUTES);

        Set<Session> sessionsToDelete = new HashSet<>(sessionRepo.findByExpiresAtBefore(now));
        sessionsToDelete.addAll(sessionRepo.findAbandonedSessions(graceTime));

        if (sessionsToDelete.isEmpty()) {
            return;
        }

        List<String> keysToDelete = sessionsToDelete.stream()
                .flatMap(session -> session.getFiles().stream())
                .map(Files::getR2Key)
                .toList();

        try {
            if (!keysToDelete.isEmpty()) {
                r2Service.deleteFiles(keysToDelete);
            }
            sessionRepo.deleteAll(sessionsToDelete);
            log.info("Cleaned up {} expired/abandoned session(s)", sessionsToDelete.size());
        } catch (Exception e) {
            log.error("Failed to complete session cleanup transaction", e);
            throw new RuntimeException("Session cleanup failed. Transaction rolled back.", e);
        }
    }

    private String registerParticipant(Session session, boolean isHost) {
        String participantId = UUID.randomUUID().toString();
        String token = jwtTokenService.generateToken(session.getSessionId(), participantId, isHost);
        Users user = new Users(participantId, isHost, token, "/topic/session/" + session.getSessionId(), session);
        userRepo.save(user);
        session.getUsers().add(user);
        return token;
    }

    private Claims assertSessionAccess(String token, String sessionId, String errorMessage) {
        Claims claims = jwtTokenService.validateAndParseToken(token);
        String tokenSessionId = jwtTokenService.extractSessionId(claims);
        if (tokenSessionId == null || !tokenSessionId.equals(sessionId)) {
            throw new SecurityException(errorMessage);
        }
        return claims;
    }

    private void validateDownloadAccess(Session session, String password, String expiredMessage) {
        if (!session.getPassword().equals(password)) {
            throw new SecurityException("Invalid Password");
        }
        if (session.isExpired()) {
            throw new SecurityException(expiredMessage);
        }
    }
}
