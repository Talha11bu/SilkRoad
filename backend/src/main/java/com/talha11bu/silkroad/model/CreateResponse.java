package com.talha11bu.silkroad.model;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Duration;

/**
 * Response payload returned after a session creation attempt.
 *
 * @param success  {@code true} if the session was created successfully.
 * @param token    the signed JWT token authenticating the creator.
 * @param session  the {@link Session} entity including user count and empty file list.
 * @param timeLeft the configured session duration.
 * @param host     {@code true} indicating the caller is the session host.
 */
@Schema(description = "Response returned after successfully creating a session")
public record CreateResponse(
        @Schema(description = "Whether the session was created successfully", example = "true")
        boolean success,

        @Schema(description = "JWT token for the session creator", example = "eyJhbGciOiJIUzI1NiJ9...")
        String token,

        @Schema(description = "The session object with user count and files")
        Session session,

        @Schema(description = "Duration the session will remain active", example = "PT1H")
        Duration timeLeft,

        @Schema(description = "Whether the authenticated user is the session host", example = "true")
        boolean host
) {}
