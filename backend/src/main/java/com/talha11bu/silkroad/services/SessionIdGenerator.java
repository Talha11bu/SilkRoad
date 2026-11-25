package com.talha11bu.silkroad.services;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

/**
 * Generates short, URL-safe session identifiers.
 */
@Service
public class SessionIdGenerator {

    private static final String SEED = "QWERTYUIOPASDFGHJKLZXCVBNM_-.~abcdefghijklmnopqrstuvwxyz0987654321";
    private static final int ID_LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();

    public String generatedId() {
        StringBuilder token = new StringBuilder(ID_LENGTH);
        for (int i = 0; i < ID_LENGTH; i++) {
            token.append(SEED.charAt(RANDOM.nextInt(SEED.length())));
        }
        return token.toString();
    }
}
