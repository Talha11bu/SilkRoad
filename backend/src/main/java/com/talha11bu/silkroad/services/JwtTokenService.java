package com.talha11bu.silkroad.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Service for generating and validating anonymous session JSON Web Tokens (JWT).
 *
 * <p>Tokens encode an anonymous participant UUID as the subject, the active
 * session ID, and whether the participant is the host.</p>
 */
@Service
public class JwtTokenService {

	public static final String SESSION_ID_CLAIM = "sessionId";
	public static final String HOST_CLAIM = "host";

	@Value("${jwt.secret-key}")
	private String secretKey;

	@Value("${jwt.expiration-ms:8640000}")
	private long expirationMs;

	private Key getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	/**
	 * Generates a signed JWT token for an anonymous session participant.
	 *
	 * @param sessionId     The ID of the session the participant joined or created.
	 * @param participantId Server-generated anonymous participant UUID.
	 * @param isHost        {@code true} if this participant created the session.
	 * @return A signed JWT string.
	 */
	public String generateToken(String sessionId, String participantId, boolean isHost) {
		return Jwts.builder()
				.setSubject(participantId)
				.claim(SESSION_ID_CLAIM, sessionId)
				.claim(HOST_CLAIM, isHost)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	public Claims validateAndParseToken(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token)
				.getBody();
	}

	public String extractSessionId(Claims claims) {
		return claims.get(SESSION_ID_CLAIM, String.class);
	}

	public boolean isHost(Claims claims) {
		Boolean host = claims.get(HOST_CLAIM, Boolean.class);
		return Boolean.TRUE.equals(host);
	}
}
