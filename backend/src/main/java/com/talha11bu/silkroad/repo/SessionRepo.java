package com.talha11bu.silkroad.repo;

import com.talha11bu.silkroad.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Spring Data JPA repository for {@link Session} entities.
 */
@Repository
public interface SessionRepo extends JpaRepository<Session, String> {

    List<Session> findByExpiresAtBefore(Instant expiresAt);

    @Query("SELECT s FROM Session s WHERE s.users IS EMPTY AND s.createdAt < :graceTime")
    List<Session> findAbandonedSessions(@Param("graceTime") Instant graceTime);
}
