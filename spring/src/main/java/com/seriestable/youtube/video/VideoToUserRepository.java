package com.seriestable.youtube.video;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.video.data.VideoEntity;
import com.seriestable.youtube.video.data.VideoToUserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface VideoToUserRepository extends CrudRepository<VideoToUserEntity, Long> {
    @Query("select watchedVideo from VideoToUserEntity watchedVideo where  watchedVideo.user = :user AND watchedVideo.video.channel = :channel")
    Set<VideoToUserEntity> findWatchedVideos(@Param("channel") ChannelEntity channel, @Param("user") UserEntity userEntity);

    @Query("select watchedVideo from VideoToUserEntity watchedVideo where watchedVideo.user = :user AND watchedVideo.finishedAt IS NULL AND watchedVideo.timeWatched > 0 ")
    Set<VideoToUserEntity> findContinueWatchingVideos(@Param("user") UserEntity userEntity);

    @Query("select watchedVideo from VideoToUserEntity watchedVideo where watchedVideo.user = :user AND watchedVideo.note IS NOT NULL AND watchedVideo.note <> ''")
    Set<VideoToUserEntity> findNotesVideos(@Param("user") UserEntity userEntity);

    Set<VideoToUserEntity> findByUserAndVideoIn(UserEntity userEntity, Collection<VideoEntity> videoEntities);

    VideoToUserEntity findByVideoAndUser(@Param("video") VideoEntity videoEntity, @Param("user") UserEntity userEntity);

    @Query("select watchedVideo from VideoToUserEntity watchedVideo where watchedVideo.user = :user AND watchedVideo.video IN :videos")
    List<VideoToUserEntity> findByVideoInAndUser(@Param("videos") Collection<VideoEntity> videoIds, @Param("user") UserEntity userEntity);
}