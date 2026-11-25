package com.talha11bu.silkroad.controller;

import com.talha11bu.silkroad.model.*;
import com.talha11bu.silkroad.services.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * REST controller exposing all session and file management endpoints under {@code /sessions}.
 */
@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

        private final SessionService sessionService;

        private static Optional<String> extractBearerToken(String authHeader) {
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        return Optional.empty();
                }
                String token = authHeader.substring("Bearer ".length()).trim();
                return token.isEmpty() ? Optional.empty() : Optional.of(token);
        }

        private static ResponseEntity<String> unauthorized() {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        @Tag(name = "Session Management")
        @Operation(summary = "Create a new session")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Session created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content)
        })
        @PostMapping("/create")
        public ResponseEntity<CreateResponse> createSession(@RequestBody CreateRequest createRequest) {
                CreateResponse response = sessionService.createSession(createRequest);
                return response.success()
                                ? ResponseEntity.status(HttpStatus.CREATED).body(response)
                                : ResponseEntity.badRequest().build();
        }

        @Tag(name = "Session Management")
        @Operation(summary = "Join an existing session")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Successfully joined the session"),
                        @ApiResponse(responseCode = "404", description = "Session not found or wrong password", content = @Content)
        })
        @PostMapping("/join")
        public ResponseEntity<JoinResponse> joinSession(@RequestBody JoinRequest joinRequest) {
                JoinResponse response = sessionService.joinSession(joinRequest);
                return response.success()
                                ? ResponseEntity.ok(response)
                                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        @Tag(name = "Session Management")
        @Operation(summary = "Rejoin a session using JWT token", security = @SecurityRequirement(name = "bearerAuth"))
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Successfully rejoined the session"),
                        @ApiResponse(responseCode = "401", description = "Missing or invalid Authorization header", content = @Content),
                        @ApiResponse(responseCode = "404", description = "Session expired or not found", content = @Content)
        })
        @PostMapping("/rejoin")
        public ResponseEntity<?> rejoinSession(
                        @Parameter(description = "Bearer JWT token", required = true) @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
                Optional<String> token = extractBearerToken(authHeader);
                if (token.isEmpty()) {
                        return unauthorized();
                }

                JoinResponse response = sessionService.rejoinSession(token.get());
                return response.success()
                                ? ResponseEntity.ok(response)
                                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        @Tag(name = "File Operations")
        @Operation(summary = "Get a pre-signed upload URL for a file", security = @SecurityRequirement(name = "bearerAuth"))
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Pre-signed URL generated successfully"),
                        @ApiResponse(responseCode = "401", description = "Missing or invalid Authorization header", content = @Content),
                        @ApiResponse(responseCode = "403", description = "User not authorized for this session", content = @Content),
                        @ApiResponse(responseCode = "404", description = "Session not found", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Failed to generate upload link", content = @Content)
        })
        @GetMapping("/{sessionId}/upload-url")
        public ResponseEntity<?> getUploadUrl(
                        @PathVariable String sessionId,
                        @RequestParam String fileName,
                        @RequestParam String contentType,
                        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
                Optional<String> token = extractBearerToken(authHeader);
                if (token.isEmpty()) {
                        return unauthorized();
                }

                try {
                        Map<String, String> uploadInfo = sessionService.getPreSignedUploadUrl(
                                        sessionId, fileName, contentType, token.get());
                        return ResponseEntity.ok(uploadInfo);
                } catch (SecurityException e) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
                } catch (NoSuchElementException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("Failed to generate upload link");
                }
        }

        @Tag(name = "File Operations")
        @Operation(summary = "Confirm file upload to a session", security = @SecurityRequirement(name = "bearerAuth"))
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "File upload confirmed successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UploadResponse.class))),
                        @ApiResponse(responseCode = "401", description = "Missing or invalid Authorization header", content = @Content),
                        @ApiResponse(responseCode = "403", description = "User not authorized for this session", content = @Content),
                        @ApiResponse(responseCode = "404", description = "Session not found", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @PostMapping(value = "/{sessionId}/upload-complete", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> uploadComplete(
                        @PathVariable String sessionId,
                        @RequestBody UploadCompleteRequest request,
                        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
                Optional<String> token = extractBearerToken(authHeader);
                if (token.isEmpty()) {
                        return unauthorized();
                }

                try {
                        UploadResponse fileInfo = sessionService.confirmFileUpload(
                                        sessionId, request.fileName(), request.fileKey(), request.fileSize(), token.get());
                        return ResponseEntity.ok(fileInfo);
                } catch (SecurityException e) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
                } catch (NoSuchElementException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
                } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
                }
        }

        @Tag(name = "File Operations")
        @Operation(summary = "Download a single file")
        @GetMapping("/{sessionId}/file")
        public ResponseEntity<Resource> downloadFile(
                        @PathVariable String sessionId,
                        @RequestParam String password,
                        @RequestParam String filename) {
                try {
                        Resource fileResource = sessionService.downloadFile(sessionId, password, filename);
                        return ResponseEntity.ok()
                                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                                        "attachment; filename=\"" + filename + "\"")
                                        .body(fileResource);
                } catch (SecurityException e) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                } catch (NoSuchElementException e) {
                        return ResponseEntity.notFound().build();
                } catch (Exception e) {
                        return ResponseEntity.internalServerError().build();
                }
        }

        @Tag(name = "File Operations")
        @Operation(summary = "Get a pre-signed download URL for a file", security = @SecurityRequirement(name = "bearerAuth"))
        @GetMapping("/{sessionId}/files/{fileName}/download-url")
        public ResponseEntity<?> getFileDownloadUrl(
                        @PathVariable String sessionId,
                        @PathVariable String fileName,
                        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
                Optional<String> token = extractBearerToken(authHeader);
                if (token.isEmpty()) {
                        return unauthorized();
                }

                try {
                        String downloadUrl = sessionService.getPreSignedUrlForFile(sessionId, fileName, token.get());
                        if (downloadUrl == null) {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body("Failed to generate download link");
                        }
                        return ResponseEntity.ok(Map.of("url", downloadUrl));
                } catch (SecurityException e) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
                } catch (NoSuchElementException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
                }
        }

        @Tag(name = "File Operations")
        @Operation(summary = "Download all session files as a ZIP")
        @GetMapping("/{sessionId}/files/zip")
        public ResponseEntity<Resource> downloadAllFilesAsZip(
                        @PathVariable String sessionId,
                        @RequestParam String password) {
                try {
                        Resource zipResource = sessionService.downloadAllFilesAsZip(sessionId, password);
                        String zipFileName = String.format("session-%s-files.zip", sessionId);

                        return ResponseEntity.ok()
                                        .contentType(MediaType.parseMediaType("application/zip"))
                                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                                        "attachment; filename=\"" + zipFileName + "\"")
                                        .body(zipResource);
                } catch (SecurityException e) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                } catch (NoSuchElementException e) {
                        return ResponseEntity.noContent().build();
                } catch (Exception e) {
                        return ResponseEntity.internalServerError().build();
                }
        }

        @Tag(name = "Session Management")
        @Operation(summary = "Leave a session", security = @SecurityRequirement(name = "bearerAuth"))
        @DeleteMapping("/{sessionId}/leave")
        public ResponseEntity<?> leaveSession(
                        @PathVariable String sessionId,
                        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
                Optional<String> token = extractBearerToken(authHeader);
                if (token.isEmpty()) {
                        return unauthorized();
                }

                try {
                        sessionService.removeParticipant(sessionId, token.get());
                        return ResponseEntity.ok().build();
                } catch (SecurityException e) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                } catch (Exception e) {
                        return ResponseEntity.internalServerError().body("Failed to remove");
                }
        }

        @Tag(name = "File Operations")
        @Operation(summary = "Delete a file from a session")
        @DeleteMapping("/{sessionId}/file")
        public ResponseEntity<String> deleteFile(
                        @PathVariable String sessionId,
                        @RequestParam("fileName") String fileName) {
                try {
                        sessionService.deleteFile(sessionId, fileName);
                        return ResponseEntity.ok().build();
                } catch (NoSuchElementException e) {
                        return ResponseEntity.notFound().build();
                } catch (Exception e) {
                        return ResponseEntity.internalServerError().build();
                }
        }

        @Tag(name = "Session Management")
        @Operation(summary = "End a session", security = @SecurityRequirement(name = "bearerAuth"))
        @DeleteMapping("/{sessionId}")
        public ResponseEntity<String> endSession(
                        @PathVariable String sessionId,
                        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
                Optional<String> token = extractBearerToken(authHeader);
                if (token.isEmpty()) {
                        return unauthorized();
                }

                try {
                        sessionService.endSession(sessionId, token.get());
                        return ResponseEntity.ok().build();
                } catch (SecurityException e) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                } catch (Exception e) {
                        return ResponseEntity.internalServerError().build();
                }
        }
}
