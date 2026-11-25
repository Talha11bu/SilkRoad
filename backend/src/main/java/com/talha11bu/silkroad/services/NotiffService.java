package com.talha11bu.silkroad.services;

import com.talha11bu.silkroad.model.SessionNotiff;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Service responsible for broadcasting real-time WebSocket notifications over STOMP.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotiffService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifySessionMembers(String sessionId, SessionNotiff notification) {
        String destination = "/topic/session/" + sessionId;
        messagingTemplate.convertAndSend(destination, notification);
        log.debug("Broadcasted to {}: {}", destination, notification.getType());
    }

    public void sessionClosedNotiff(String sessionId) {
        String payload = String.format(
                "Session %s has been successfully ended. All associated files have been deleted.", sessionId);
        String destination = "/topic/session/" + sessionId;
        messagingTemplate.convertAndSend(destination, payload);
    }
}
