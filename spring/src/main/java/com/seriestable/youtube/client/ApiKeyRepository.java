package com.seriestable.youtube.client;

import com.seriestable.youtube.client.data.YoutubeApiKeyEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ApiKeyRepository extends CrudRepository<YoutubeApiKeyEntity, Long> {

    public List<YoutubeApiKeyEntity> findApiKeyEntitiesByExceededAtBeforeOrExceededAtIsNullOrderByPriorityAsc(@Param("exceededAt") Instant exceededAt);

    public YoutubeApiKeyEntity findByApiKey(@Param("apiKey") String apiKey);
}