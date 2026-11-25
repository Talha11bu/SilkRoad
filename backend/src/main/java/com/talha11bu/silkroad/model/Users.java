package com.talha11bu.silkroad.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * JPA entity representing an anonymous participant in a session.
 *
 * <p>Tracks active participation for session user count and cleanup without
 * storing any user-identifying names.</p>
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "An anonymous participant in a session")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated primary key", example = "1")
    private int id;

    @Column(nullable = false)
    @Schema(description = "Server-generated anonymous participant ID")
    private String participantId;

    @Column(nullable = false)
    @Schema(description = "Whether this participant created the session")
    private boolean host;

    @Schema(description = "JWT token assigned to this participant")
    private String token;

    @Schema(description = "WebSocket session topic")
    private String webSocketId;

    @ToString.Exclude
    @JsonIgnoreProperties("users")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SessionID", nullable = false)
    @Schema(hidden = true)
    private Session session;

    public Users(String participantId, boolean host, String token, String webSocketId, Session session) {
        this.participantId = participantId;
        this.host = host;
        this.token = token;
        this.webSocketId = webSocketId;
        this.session = session;
    }
}
