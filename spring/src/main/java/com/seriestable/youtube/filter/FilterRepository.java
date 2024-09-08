package com.seriestable.youtube.filter;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.filter.data.FilterEntity;
import com.seriestable.youtube.filter.data.VideoListType;
import com.seriestable.youtube.tag.data.TagEntity;
import com.seriestable.youtube.video.data.VideoToUserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface FilterRepository extends CrudRepository<FilterEntity, Long> {


    @Query("select filter from FilterEntity filter where filter.user = :user AND filter.videoListType = :videoListType")
    FilterEntity findFilter(@Param("user") UserEntity user, @Param("videoListType") VideoListType videoListType);



    @Query("select watchedVideo from VideoToUserEntity watchedVideo where  watchedVideo.user = :user AND watchedVideo.video.channel = :channel")
    Set<VideoToUserEntity> findWatchedVideos(@Param("channel") ChannelEntity channel, @Param("user") UserEntity userEntity);

    @Query("select filter from FilterEntity filter where filter.user = :user AND filter.videoListType = :videoListType AND filter.category = :category")
    FilterEntity findFilterByCategory(@Param("user") UserEntity user,
                                      @Param("videoListType") VideoListType videoListType,
                                      @Param("category") CategoryEntity categoryEntity);

    @Query("select filter from FilterEntity filter where filter.user = :user AND filter.videoListType = :videoListType AND filter.tag = :tag")
    FilterEntity findFilterByTag(@Param("user") UserEntity user,
                                      @Param("videoListType") VideoListType videoListType,
                                      @Param("tag") TagEntity tagEntity);
}