package com.talha11bu.silkroad.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.ToString;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA entity representing an ephemeral file-sharing session.
 *
 * <p>A session is identified by a short ID (e.g., {@code SKR-7X9K2M}), protected
 * by a password, and automatically expires after a configurable duration.
 * Exposes {@code userCount} instead of individual user identities.</p>
 */
@Entity
@Schema(description = "A temporary file-sharing session with password protection and auto-expiration")
public class Session {

    @Id
    @Schema(description = "Unique session identifier", example = "SKR-7X9K2M")
    private String sessionId;

    @Schema(description = "Password protecting the session", example = "mySecret123")
    private String password;

    @Column(nullable = false, updatable = false)
    @Schema(description = "Timestamp when the session was created", example = "2025-06-15T13:30:00Z")
    private Instant createdAt;

    @Column(nullable = false)
    @Schema(description = "Timestamp when the session expires", example = "2025-06-15T14:30:00Z")
    private Instant expiresAt;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Users> users = new ArrayList<>();

    @ToString.Exclude
    @JsonIgnoreProperties("session")
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Schema(description = "List of files uploaded to the session")
    private List<Files> files = new ArrayList<>();

    public Session() {}

    public Session(String sessionId, String password, Instant expiresAt) {
        this.sessionId = sessionId;
        this.password = password;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    public String getSessionId() {
        return sessionId;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public String getPassword() {
        return password;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    @JsonIgnore
    public List<Users> getUsers() {
        return users;
    }

    @JsonProperty("userCount")
    @Schema(description = "Number of connected participants in the session", example = "2")
    public int getUserCount() {
        return users != null ? users.size() : 0;
    }

    public List<Files> getFiles() {
        return files;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(this.expiresAt);
    }
}
