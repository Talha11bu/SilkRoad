package com.talha11bu.silkroad.repo;

import com.talha11bu.silkroad.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Users} entities.
 */
@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {

    long countBySessionSessionId(String sessionId);

    Optional<Users> findByParticipantIdAndSessionSessionId(String participantId, String sessionId);
}
