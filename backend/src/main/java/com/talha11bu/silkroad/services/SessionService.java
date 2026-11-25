package com.talha11bu.silkroad.services;

import com.talha11bu.silkroad.model.*;
import com.talha11bu.silkroad.repo.*;

import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Core service orchestrating all anonymous session lifecycle operations.
 */
@Service
public class SessionService {

    @Autowired
    private SessionRepo sessionRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private FilesRepo filesRepo;
    @Autowired
    private SessionIdGenerator idGenerator;
    @Autowired
    private JwtTokenService jwtTokenService;
    @Autowired
    private NotiffService notiffService;
    @Autowired
    private R2Service r2Service;

    @Transactional
    public CreateResponse createSession(CreateRequest request) {
        try {
            String newSessionId = idGenerator.generatedId();
            var expiration = Instant.now().plus(request.duration());

            Session newSession = new Session(newSessionId, request.password(), expiration);
            Session savedSession = sessionRepo.save(newSession);

            String token = registerUser(savedSession, true);

            return new CreateResponse(true, token, savedSession, request.duration(), true);
        } catch (Exception e) {
            System.out.println(e.getMessage());
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

            String token = registerUser(session, false);
            int userCount = session.getUserCount();

            SessionNotiff joinNotification = new SessionNotiff(
                    SessionNotiff.NotifyType.USER_JOINED,
                    session.getSessionId(),
                    String.valueOf(userCount));

            notiffService.notifySessionMembers(session.getSessionId(), joinNotification);

            return new JoinResponse(true, token, session, timeLeft, false);

        } catch (Exception e) {
            return new JoinResponse(false, null, null, null, false);
        }
    }

    private String registerUser(Session session, boolean isHost) {
        String participantId = UUID.randomUUID().toString();
        String token = jwtTokenService.generateToken(session.getSessionId(), participantId, isHost);
        Users user = new Users(participantId, isHost, token, "/topic/session/" + session.getSessionId(), session);
        userRepo.save(user);
        session.getUsers().add(user);
        return token;
    }

    @Transactional(readOnly = true)
    public JoinResponse rejoinSession(String token) {
        Claims claims = jwtTokenService.validateAndParseToken(token);
        String sessionId = jwtTokenService.extractSessionId(claims);
        boolean isHost = jwtTokenService.isHost(claims);

        try {
            Session session = sessionRepo.findById(sessionId).orElseThrow();
            session.getUserCount();
            session.getFiles().size();
            Duration timeLeft = Duration.between(Instant.now(), session.getExpiresAt());

            return new JoinResponse(true, token, session, timeLeft, isHost);
        } catch (Exception e) {
            return new JoinResponse(false, null, null, null, false);
        }
    }

    private Claims assertSessionAccess(String token, String sessionId, String errorMessage) {
        Claims claims = jwtTokenService.validateAndParseToken(token);
        String tokenSessionId = jwtTokenService.extractSessionId(claims);
        if (tokenSessionId == null || !tokenSessionId.equals(sessionId)) {
            throw new SecurityException(errorMessage);
        }
        return claims;
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

        Session session = sessionRepo.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found."));

        Files newFileEntity = new Files(fileName, fileKey, session);
        filesRepo.save(newFileEntity);

        SessionNotiff fileNotification = new SessionNotiff(SessionNotiff.NotifyType.FILE_UPLOADED, sessionId, fileName);
        notiffService.notifySessionMembers(sessionId, fileNotification);

        return new UploadResponse(fileName, "", fileSize);
    }

    public Resource downloadFile(String sessionId, String password, String filename) {
        Files file = filesRepo.findByFileNameAndSessionSessionId(filename, sessionId).orElseThrow(
                () -> new NoSuchElementException("File " + filename + " not found in session " + sessionId));

        Session session = file.getSession();
        if (!session.getPassword().equals(password))
            throw new SecurityException("Invalid Password");

        if (session.isExpired())
            throw new SecurityException("Cannot download File Session Expired");

        try {
            return r2Service.downloadFile(file.getR2Key());
        } catch (Exception e) {
            throw new RuntimeException("Something went Bad");
        }
    }

    public String getPreSignedUrlForFile(String sessionId, String fileName, String token) {
        assertSessionAccess(token, sessionId, "You do not have access to this session's files.");
        try {
            Files file = filesRepo.findByFileNameAndSessionSessionId(fileName, sessionId).orElseThrow();

            return r2Service.generatePreSignedDownloadUrl(file.getR2Key(), file.getFileName());
        } catch (Exception e) {
            return null;
        }
    }

    public Resource downloadAllFilesAsZip(String sessionId, String password) {
        Session session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        if (!session.getPassword().equals(password))
            throw new SecurityException("Invalid Password");

        if (session.isExpired())
            throw new SecurityException("Cannot download Files Session Expired");

        List<String> r2Keys = session.getFiles().stream().map(Files::getR2Key).toList();

        if (r2Keys.isEmpty()) {
            throw new NoSuchElementException("No files available to download");
        }
        try {
            return r2Service.donwloadFilesAsZip(r2Keys);
        } catch (IOException e) {
            throw new RuntimeException("Error creating ZIP File from R2", e);
        }
    }

    @Transactional
    public void endSession(String sessionId, String token) {
        Claims claims = assertSessionAccess(token, sessionId, "User not authorized to end this session");
        if (!jwtTokenService.isHost(claims)) {
            throw new SecurityException("Only the session host can end the session");
        }

        Session session = sessionRepo.findById(sessionId).orElseThrow();
        List<String> keysToDelete = session.getFiles().stream().map(Files::getR2Key).toList();

        if (!keysToDelete.isEmpty()) {
            try {
                r2Service.deleteFiles(keysToDelete);
                System.out.println("R2 files for session " + sessionId + " deleted.");
            } catch (Exception e) {
                throw new RuntimeException(
                        "Failed to delete R2 files for session " + sessionId + ". Aborting DB deletion.", e);
            }
        }
        sessionRepo.delete(session);
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

        SessionNotiff leaveNotiff = new SessionNotiff(
                SessionNotiff.NotifyType.USER_LEFT,
                sessionId,
                String.valueOf(remainingCount));

        notiffService.notifySessionMembers(sessionId, leaveNotiff);
    }

    public void deleteFile(String sessionId, String fileName) {
        Files file = filesRepo.findByFileNameAndSessionSessionId(fileName, sessionId)
                .orElseThrow(() -> new NoSuchElementException("File " + fileName + " does not exist"));

        String r2Key = file.getR2Key();

        try {
            r2Service.deleteFile(r2Key);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to delete file " + fileName);
        }
        filesRepo.delete(file);
        SessionNotiff deletionNotiff = new SessionNotiff(SessionNotiff.NotifyType.FILE_DELETED, sessionId,
                file.getFileName());
        notiffService.notifySessionMembers(sessionId, deletionNotiff);
    }

    @Scheduled(cron = "* 5 * * * *")
    @Transactional
    public void cleanupExpiredSessions() {

        if (sessionRepo.findAll().isEmpty()) {
            return;
        }

        var now = Instant.now();

        List<Session> expiredByTime = sessionRepo.findByExpiresAtBefore(now);

        Instant graceTime = now.minus(2, ChronoUnit.MINUTES).atZone(ZoneOffset.systemDefault())
                .withZoneSameInstant(ZoneId.of("UTC")).toInstant();
        List<Session> expiredByEmpty = sessionRepo.findAbandonedSessions(graceTime);

        Set<Session> sessionsToDelete = new HashSet<>(expiredByTime);
        sessionsToDelete.addAll(expiredByEmpty);

        if (sessionsToDelete.isEmpty()) {
            return;
        }

        Collection<String> keysToDelete = sessionsToDelete.stream().flatMap(session -> session.getFiles().stream())
                .map(Files::getR2Key).toList();

        try {
            if (!keysToDelete.isEmpty())
                r2Service.deleteFiles(keysToDelete);

            sessionRepo.deleteAll(sessionsToDelete);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to complete session cleanup transaction. R2 or DB deletion failed: "
                    + e.getMessage());
            throw new RuntimeException("Session cleanup failed. Transaction rolled back.", e);
        }
    }
}
