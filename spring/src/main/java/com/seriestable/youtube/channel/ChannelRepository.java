package com.seriestable.youtube.channel;

import com.seriestable.youtube.channel.data.ChannelEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelRepository extends CrudRepository<ChannelEntity, Long> {
    ChannelEntity findChannelEntityByYoutubeId(@Param("youtubeId") String youtubeId);

    List<ChannelEntity> findByImageIsNull();
}