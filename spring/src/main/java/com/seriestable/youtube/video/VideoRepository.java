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
public interface VideoRepository extends CrudRepository<VideoEntity, Long> {

    @Query("select video from VideoEntity video where video.channel.id = :channelId and video.unavailable=0")
    List<VideoEntity> findVideosByChannelId(@Param("channelId") Long channelId);

    @Query("select count(video) from VideoEntity video where video.channel.id = :channelId and video.unavailable=0")
    Long countVideosByChannelId(@Param("channelId") Long channelId);

    @Query("select video from VideoEntity video where video.channel.id = :channelId")
    List<VideoEntity> findAllVideosByChannelId(@Param("channelId") Long channelId);

    @Query("select video from VideoEntity video where video.channel = :channel AND video.unavailable=0 AND video.id <> :videoId AND video.duration is not null order by Abs(video.duration - :videoDuration) ASC")
    List<VideoEntity> findAllVideosByChannelAndOrderBySimilarLength(@Param("channel") ChannelEntity channel, @Param("videoDuration") Long videoDuration, @Param("videoId") Long videoId, Pageable pageable);

    @Query(value = "SELECT * FROM videos video " +
            "LEFT JOIN videos_to_user watchedVideo ON video.id = watchedVideo.videoId and watchedVideo.userId = :userId " +
            "WHERE video.unavailable ='0' AND watchedVideo.finishedAt IS NULL AND watchedVideo.stopRecommending IS NULL " +
            "AND video.channelId = :channelId " +
            "AND video.id != :videoId " +
            "ORDER BY Abs(video.duration - :videoDuration) ASC " +
            "LIMIT 60"
            , nativeQuery = true)
    List<VideoEntity> findAllNotWatchedVideosByChannelAndOrderBySimilarLength(@Param("channelId") Long channelId, @Param("userId") Long userId, @Param("videoDuration") Long videoDuration, @Param("videoId") Long videoId);

    @Query(value = "SELECT * FROM videos video " +
            "LEFT JOIN videos_to_user watchedVideo ON video.id = watchedVideo.videoId and watchedVideo.userId = :userId " +
            "WHERE video.unavailable ='0' AND watchedVideo.finishedAt IS NULL AND watchedVideo.stopRecommending IS NULL " +
            "AND video.channelId IN :channelIds " +
            "AND video.id != :videoId " +
            "ORDER BY video.publishedAt ASC " +
            "LIMIT 30"
            , nativeQuery = true)
    List<VideoEntity> findAllNotWatchedVideosByChannelsAndOrderByPublishedAt(@Param("channelIds") List<Long> channelIds, @Param("userId") Long userId, @Param("videoId") Long videoId);

    @Query(value = "SELECT * FROM videos video " +
            "    LEFT JOIN videos_to_tag videoToTagged ON videoToTagged.videoId = video.id " +
            "                  RIGHT JOIN (SELECT * FROM videos_to_tag videoToTag " +
            "WHERE videoToTag.videoId =:videoId AND videoToTag.userId = :userId) as videoTag " +
            "ON videoToTagged.tagId = videoTag.tagId " +
            "LEFT JOIN videos_to_user watchedVideo ON video.id = watchedVideo.videoId and watchedVideo.userId = :userId " +
            "WHERE video.unavailable ='0' AND watchedVideo.finishedAt IS NULL AND watchedVideo.stopRecommending IS NULL " +
            "AND video.id != :videoId " +
            "GROUP BY video.id " +
            "ORDER BY Abs(video.duration - :videoDuration) ASC " +
            "LIMIT 60"
            , nativeQuery = true)
    List<VideoEntity> findAllNotWatchedVideosByTagAndOrderBySimilarLength(@Param("userId") Long userId, @Param("videoDuration") Long videoDuration, @Param("videoId") Long videoId);

    @Query("select video from VideoEntity video where video.duration IS NULL and video.unavailable=0")
    List<VideoEntity> getVideosWithoutDuration(Pageable pageable);

    @Query("select video from VideoEntity video where video.viewCount IS NULL and video.unavailable=0")
    List<VideoEntity> getVideosWithoutStatistics(Pageable pageable);

    @Query("select video from VideoEntity video where video.description IS NULL and video.unavailable=0")
    List<VideoEntity> getVideosWithoutDescription(Pageable pageable);

    @Query("select count(video) from VideoEntity video where video.duration IS NULL and video.unavailable=0")
    Long countVideosWithoutDuration();

    @Query("select count(video) from VideoEntity video where video.viewCount IS NULL and video.unavailable=0")
    Long countVideosWithoutStatistics();

    @Query("select count(video) from VideoEntity video where video.description IS NULL and video.unavailable=0")
    Long countVideosWithoutDescription();

    VideoEntity findByYoutubeId(@Param("youtubeId") String youtubeId);

    @Query(value = "SELECT * FROM videos video " +
            "LEFT JOIN videos_to_user watchedVideo ON video.id = watchedVideo.videoId and watchedVideo.userId = :userId " +
            "LEFT JOIN channels channel ON video.channelId = channel.id " +
            "WHERE video.unavailable ='0'" +
            "AND channel.id IN (select distinct ctc.channelId from channels_to_category ctc where ctc.userId = :userId) " +
            "ORDER BY video.publishedAt DESC " +
            "LIMIT 180"
            , nativeQuery = true)
    Set<VideoEntity> findNewestVideosFromSavedChannels(@Param("userId") Long userId);

    @Query("select video from VideoEntity video where video.channel IN (select channel from RecommendedChannelEntity) and video.unavailable=0 ORDER BY video.publishedAt DESC")
    List<VideoEntity> findNewestVideosFromRecommendedChannels(Pageable pageable);

    @Query(value = "SELECT * FROM videos video " +
            "LEFT JOIN videos_to_user watchedVideo ON video.id = watchedVideo.videoId and watchedVideo.userId = :userId " +
            "WHERE video.unavailable ='0' AND watchedVideo.finishedAt IS NULL AND watchedVideo.stopRecommending IS NULL " +
            "AND video.id != :videoId " +
            "AND video.channelId IN (select channelId from recommended_channels)  " +
            "ORDER BY Abs(video.duration - :videoDuration) ASC " +
            "LIMIT 60"
            , nativeQuery = true)
    List<VideoEntity> findNewestNotWatchedVideosFromRecommendedChannels(@Param("userId") Long userId, @Param("videoDuration") Long videoDuration, @Param("videoId") Long videoId);
}