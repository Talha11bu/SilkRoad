package com.talha11bu.silkroad;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.talha11bu.silkroad.services.JwtTokenService;

import io.jsonwebtoken.Claims;

@SpringBootTest
class JwtTokenServiceTest {

    @Autowired
    private JwtTokenService jwtTokenService;

    @Test
    void shouldGenerateAndValidateAnonymousToken() {
        String sessionId = "test-session";
        String participantId = "anon-uuid-123";

        String hostToken = jwtTokenService.generateToken(sessionId, participantId, true);
        assertNotNull(hostToken);

        Claims hostClaims = jwtTokenService.validateAndParseToken(hostToken);
        assertEquals(participantId, hostClaims.getSubject());
        assertEquals(sessionId, jwtTokenService.extractSessionId(hostClaims));
        assertTrue(jwtTokenService.isHost(hostClaims));

        String guestToken = jwtTokenService.generateToken(sessionId, "anon-uuid-456", false);
        Claims guestClaims = jwtTokenService.validateAndParseToken(guestToken);
        assertFalse(jwtTokenService.isHost(guestClaims));
    }

    @Test
    void shouldThrowExceptionOnInvalidToken() {
        assertThrows(Exception.class, () -> jwtTokenService.validateAndParseToken("invalid.token.here"));
    }
}
