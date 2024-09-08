package com.seriestable.youtube.video;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.tag.data.TagEntity;
import com.seriestable.youtube.video.data.VideoEntity;
import com.seriestable.youtube.video.data.VideoToTagEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface VideoToTagRepository extends CrudRepository<VideoToTagEntity, Long> {

    List<VideoToTagEntity> findByUserAndTag(@Param("user") UserEntity userEntity, @Param("tag") TagEntity tagEntity);

    VideoToTagEntity findByUserAndVideoAndTag(@Param("user") UserEntity userEntity, @Param("video") VideoEntity videoEntity, @Param("tag") TagEntity tagEntity);

    List<VideoToTagEntity> findTaggedVideosByUserAndVideoIn(UserEntity userEntity, Collection<VideoEntity> collect);
}