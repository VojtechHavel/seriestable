package com.seriestable.youtube.channel;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.CategoryRepository;
import com.seriestable.youtube.category.ChannelToCategoryRepository;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.category.data.ChannelToCategoryEntity;
import com.seriestable.youtube.channel.data.*;
import com.seriestable.youtube.client.ChannelVideosResponse;
import com.seriestable.youtube.client.YoutubeChannelService;
import com.seriestable.youtube.client.YoutubeVideoService;
import com.seriestable.youtube.filter.FilterService;
import com.seriestable.youtube.filter.data.Filter;
import com.seriestable.youtube.filter.data.VideoListType;
import com.seriestable.youtube.recommend.RecommendedChannelRepository;
import com.seriestable.youtube.recommend.data.RecommendedChannelEntity;
import com.seriestable.youtube.video.VideoRepository;
import com.seriestable.youtube.video.VideoService;
import com.seriestable.youtube.video.VideoToTagRepository;
import com.seriestable.youtube.video.VideoToUserRepository;
import com.seriestable.youtube.video.data.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Vojtech Havel
 * @since June, 2018
 */

@Service
public class ChannelService {

    private static final Logger logger = LoggerFactory.getLogger(ChannelService.class);

    /**
     * If channel was updated after current time - this time, it should not be updated again
     */
    private final int UPDATE_CHANNEL_DELAY_IN_MINUTES = 120;

    /**
     * Just tu be sure we get all the videos, we load videos that should have been loaded in previous update.
     */
    private final int OVERLAP_BETWEEN_UPDATES_IN_SECONDS = 5;


    @Autowired
    VideoMapper videoMapper;

    @Autowired
    ChannelMapper channelMapper;

    @Autowired
    YoutubeChannelService youtubeChannelService;

    @Autowired
    YoutubeVideoService youtubeVideoService;

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ChannelToUserRepository channelToUserRepository;

    @Autowired
    ChannelToCategoryRepository channelToCategoryRepository;

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    VideoToUserRepository videoToUserRepository;

    @Autowired
    VideoToTagRepository taggedVideosRepository;

    @Autowired
    VideoService videoService;

    @Autowired
    FilterService filterService;

    @Autowired
    JmsTemplate jmsTemplate;

    // PUBLIC

    public ChannelVideosLoad getChannelVideosLoadStatus(String channelYoutubeId, UserEntity user) throws ApiException {
        ChannelEntity channelEntity = channelRepository.findChannelEntityByYoutubeId(channelYoutubeId);
        if (channelEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Channel not found");
        }

        ChannelVideosLoad channelVideosLoad = new ChannelVideosLoad();
        channelVideosLoad.setVideoCount(videoRepository.countVideosByChannelId(channelEntity.getId()));
        channelVideosLoad.setLoadFinished(channelEntity.getUpdateFinish() != null);
        return channelVideosLoad;
    }

    public VideoListPageResponse getChannel(String channelYoutubeId, UserEntity userEntity) throws ApiException {
        ChannelEntity channelEntity = channelRepository.findChannelEntityByYoutubeId(channelYoutubeId);

        if (channelEntity == null) {
            channelEntity = youtubeChannelService.getChannelInformation(channelYoutubeId);
            channelRepository.save(channelEntity);
        }

        if (channelEntity.getUpdateStart() == null || channelEntity.getUpdateStart().isBefore(Instant.now().minus(UPDATE_CHANNEL_DELAY_IN_MINUTES, ChronoUnit.MINUTES))) {
            updateChannel(channelEntity);
        }

        List<VideoEntity> videoEntities = videoRepository.findVideosByChannelId(channelEntity.getId());
        Set<VideoToUserEntity> videosToUser = new HashSet<>();
        if (userEntity != null) {
            videosToUser = videoToUserRepository.findWatchedVideos(channelEntity, userEntity);
        }

        List<VideoToTagEntity> taggedVideoEntities = new ArrayList<>();
        if (userEntity != null) {
            taggedVideoEntities = taggedVideosRepository.findTaggedVideosByUserAndVideoIn(userEntity, videoEntities);
        }
        List<Video> videos = videoMapper.map(videoEntities, videosToUser, taggedVideoEntities);
        Channel channel = channelMapper.map(channelEntity);

        channel.getAllCategories().addAll(categoryRepository.findByUser(userEntity).stream().map(CategoryEntity::getName).collect(Collectors.toList()));
        channel.getPresentCategories().addAll(channelToCategoryRepository.findByUserAndChannel(userEntity, channelEntity).stream().map(channelToCategoryEntity -> channelToCategoryEntity.getCategory().getName()).collect(Collectors.toList()));

        VideoListPageResponse videoListPageResponse = new VideoListPageResponse();
        videoListPageResponse.setInformation(channel);
        videoListPageResponse.setVideos(videos);

        if (userEntity != null) {
            Filter filter = filterService.findFilterOrGetDefaultOne(userEntity, VideoListType.CHANNEL, null);
            videoListPageResponse.setFilter(filter);
        }

        return videoListPageResponse;
    }



    public String reloadChannelImage(String channelId) throws ApiException {
        ChannelEntity channelInformation = youtubeChannelService.getChannelInformation(channelId);
        ChannelEntity savedChannel = channelRepository.findChannelEntityByYoutubeId(channelId);
        savedChannel.setImage(channelInformation.getImage());
        channelRepository.save(savedChannel);
        return channelInformation.getImage();
    }

    private void updateChannel(ChannelEntity channelEntity) throws ApiException {

        logger.debug("Updating channel " + channelEntity.getTitle());

        Instant lastUpdatedAt = channelEntity.getUpdateStart();
        if (lastUpdatedAt != null) {
            lastUpdatedAt = lastUpdatedAt.minusSeconds(OVERLAP_BETWEEN_UPDATES_IN_SECONDS);
        } else {
            lastUpdatedAt = Instant.ofEpochMilli(Long.MIN_VALUE);
        }

        ChannelVideosResponse channelVideosResponse;

        try {
            channelVideosResponse = youtubeChannelService.loadChannelFirstPage(channelEntity.getYoutubeId(), channelEntity);
        } catch (IOException e) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "There was an error loading channel with id " + channelEntity.getYoutubeId());
        }

        channelEntity.setUpdateStart(Instant.now());
        channelEntity.setUpdateFinish(null);
        channelEntity.setTotalVideos(channelVideosResponse.getTotalResults());

        channelRepository.save(channelEntity);
        videoService.saveNewVideoEntities(channelVideosResponse.getVideos());

        boolean alreadyLoaded = UpdateChannelReceiver.isAlreadyLoaded(channelVideosResponse.getVideos(), lastUpdatedAt);

        if (channelVideosResponse.getNextPageToken() != null && !alreadyLoaded) {
            // Send a message with a POJO - the template reuse the message converter
            UpdateChannelMessage updateChannelMessage = new UpdateChannelMessage();
            updateChannelMessage.setPageToken(channelVideosResponse.getNextPageToken());
            updateChannelMessage.setSafetyCounter(0);
            updateChannelMessage.setChannelYoutubeId(channelEntity.getYoutubeId());
            updateChannelMessage.setPlaylistId(channelVideosResponse.getPlaylistId());

            updateChannelMessage.setLastUpdateInstant(lastUpdatedAt.toEpochMilli());
            logger.debug("Sending an update channel message " + updateChannelMessage);
            jmsTemplate.convertAndSend(UpdateChannelReceiver.UPDATE_CHANNEL_QUEUE_NAME, updateChannelMessage);
        } else {
            channelEntity.setUpdateFinish(Instant.now());
            channelRepository.save(channelEntity);
        }
    }
}
