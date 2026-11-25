package com.talha11bu.silkroad.model;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Duration;

/**
 * Response payload returned after a join or rejoin attempt.
 *
 * @param success  {@code true} if the join was successful.
 * @param token    the signed JWT token authenticating the user within this session.
 * @param session  the {@link Session} entity including user count and uploaded files.
 * @param timeLeft the remaining time before the session expires, as an ISO-8601 {@link java.time.Duration}.
 * @param host     {@code true} if the authenticated participant is the session host.
 */
@Schema(description = "Response returned after successfully joining or rejoining a session")
public record JoinResponse(
        @Schema(description = "Whether the join was successful", example = "true")
        boolean success,

        @Schema(description = "JWT token for the authenticated user", example = "eyJhbGciOiJIUzI1NiJ9...")
        String token,

        @Schema(description = "The session object with user count and files")
        Session session,

        @Schema(description = "Time remaining before the session expires", example = "PT45M12S")
        Duration timeLeft,

        @Schema(description = "Whether the authenticated user is the session host", example = "false")
        boolean host
) {}
