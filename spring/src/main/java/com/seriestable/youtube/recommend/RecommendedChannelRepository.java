package com.seriestable.youtube.recommend;

import com.seriestable.youtube.recommend.data.RecommendedChannelEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendedChannelRepository extends CrudRepository<RecommendedChannelEntity, Long> {
}