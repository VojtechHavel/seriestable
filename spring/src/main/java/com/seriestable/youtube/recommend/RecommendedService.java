package com.seriestable.youtube.recommend;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.CategoryRepository;
import com.seriestable.youtube.category.ChannelToCategoryRepository;
import com.seriestable.youtube.category.data.Category;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.category.data.ChannelToCategoryEntity;
import com.seriestable.youtube.channel.ChannelRepository;
import com.seriestable.youtube.channel.ChannelToUserRepository;
import com.seriestable.youtube.channel.data.Channel;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.channel.data.ChannelMapper;
import com.seriestable.youtube.channel.data.ChannelToUserEntity;
import com.seriestable.youtube.recommend.data.RecommendedChannelEntity;
import com.seriestable.youtube.video.VideoRepository;
import com.seriestable.youtube.video.VideoToTagRepository;
import com.seriestable.youtube.video.VideoToUserRepository;
import com.seriestable.youtube.video.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendedService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ChannelToUserRepository channelToUserRepository;

    @Autowired
    RecommendedChannelRepository recommendedChannelRepository;

    @Autowired
    ChannelToCategoryRepository channelToCategoryRepository;

    @Autowired
    VideoToUserRepository videoToUserRepository;

    @Autowired
    ChannelMapper channelMapper;

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    VideoMapper videoMapper;

    @Autowired
    VideoToTagRepository videoToTagRepository;

    @Autowired
    VideoRepository videoRepository;

    public List<Channel> getRecommendedChannels(UserEntity userEntity) {
        List<Channel> result = new ArrayList<>();
        Iterable<RecommendedChannelEntity> recommendedChannelEntities = recommendedChannelRepository.findAll();

        List<ChannelEntity> categorisedChannelEntities = new ArrayList<>();
        if (userEntity != null) {
            List<ChannelToCategoryEntity> categorisedChannels = channelToCategoryRepository.findByUser(userEntity);
            for (ChannelToCategoryEntity categorisedChannel : categorisedChannels) {
                categorisedChannelEntities.add(categorisedChannel.getChannel());
            }
        }

        Set<ChannelEntity> dontRecommendEntities = channelToUserRepository.findDontRecommendChannels(userEntity);

        for (RecommendedChannelEntity recommendedChannelEntity : recommendedChannelEntities) {
            if (!categorisedChannelEntities.contains(recommendedChannelEntity.getChannel()) &&
                    !dontRecommendEntities.contains(recommendedChannelEntity.getChannel())) {
                result.add(channelMapper.map(recommendedChannelEntity.getChannel()));
            }
        }

        return result;
    }

    public Collection<Video> getNewestVideos(UserEntity userEntity) {
        if (userEntity != null) {

            Set<VideoEntity> videoEntities = videoRepository.findNewestVideosFromSavedChannels(userEntity.getId());

            if (videoEntities.size() > 0) {
                List<VideoToUserEntity> watchedVideoEntities = videoToUserRepository.findByVideoInAndUser(videoEntities, userEntity);

                List<VideoToTagEntity> taggedEntities = videoToTagRepository.findTaggedVideosByUserAndVideoIn(userEntity, watchedVideoEntities.stream().map(VideoToUserEntity::getVideo).collect(Collectors.toList()));

                return videoMapper.map(videoEntities, watchedVideoEntities, taggedEntities);
            } else {
                return new ArrayList<>();
            }
        } else {
            List<VideoEntity> videoEntities = videoRepository.findNewestVideosFromRecommendedChannels(new PageRequest(0, 120));
            return videoMapper.map(videoEntities);
        }
    }

    public Collection<Video> recommendVideos(String videoYoutubeId, UserEntity userEntity, int page) {
        VideoEntity videoEntity = videoRepository.findByYoutubeId(videoYoutubeId);
        ChannelEntity channelEntity = null;

        PageRequest pageRequest = new PageRequest(page, 60);
        if (videoEntity != null) {
            channelEntity = videoEntity.getChannel();
        }

        if (userEntity == null) {
            List<VideoEntity> channelVideos = new ArrayList<>();
            if (channelEntity != null) {
                channelVideos = videoRepository.findAllVideosByChannelAndOrderBySimilarLength(channelEntity, videoEntity.getDuration(), videoEntity.getId(), pageRequest);
            }

            List<VideoEntity> newestVideos = new ArrayList<>();
            if (channelEntity == null || channelVideos.size() < 60) {
                newestVideos = videoRepository.findNewestVideosFromRecommendedChannels(pageRequest);
                channelVideos.addAll(newestVideos.subList(0, 60 - channelVideos.size()));
            }

            return videoMapper.map(channelVideos);
        } else {
            List<VideoEntity> videoEntities = new ArrayList<>();
            if (channelEntity != null) {

                //Tag
                List<VideoEntity> tagVideos = videoRepository.findAllNotWatchedVideosByTagAndOrderBySimilarLength(userEntity.getId(), videoEntity.getDuration(), videoEntity.getId());
                videoEntities.addAll(tagVideos);

                // Categories
                if (videoEntities.size() < 60) {
                    List<ChannelToCategoryEntity> channelCategories = channelToCategoryRepository.findByUserAndChannel(userEntity, channelEntity);

                    List<CategoryEntity> categories = channelCategories.stream().map(ChannelToCategoryEntity::getCategory).collect(Collectors.toList());

                    if(!categories.isEmpty()) {
                    List<ChannelToCategoryEntity> channelsInSameCategories = channelToCategoryRepository.findByCategoryIn(categories);

                    List<Long> channelIds = channelsInSameCategories.stream().map(channelToCategoryEntity->channelToCategoryEntity.getChannel().getId()).collect(Collectors.toList());

                        List<VideoEntity> channelVideos = videoRepository.findAllNotWatchedVideosByChannelsAndOrderByPublishedAt(channelIds, userEntity.getId(), videoEntity.getId());
                        for (VideoEntity channelVideo : channelVideos) {
                            if (!videoEntities.contains(channelVideo)) {
                                videoEntities.add(channelVideo);
                                if (videoEntities.size() >= 60) {
                                    break;
                                }
                            }
                        }
                    }
                }

                // Channel
                if (videoEntities.size() < 60) {
                    List<VideoEntity> channelVideos = videoRepository.findAllNotWatchedVideosByChannelAndOrderBySimilarLength(channelEntity.getId(), userEntity.getId(), videoEntity.getDuration(), videoEntity.getId());
                    for (VideoEntity channelVideo : channelVideos) {
                        if (!videoEntities.contains(channelVideo)) {
                            videoEntities.add(channelVideo);
                            if (videoEntities.size() >= 60) {
                                break;
                            }
                        }
                    }
                }
            }

            // Recommended
            if (videoEntities.size() < 60) {
                List<VideoEntity> newestVideos = videoRepository.findNewestNotWatchedVideosFromRecommendedChannels(userEntity.getId(), videoEntity.getDuration(), videoEntity.getId());
                for (VideoEntity newVideo : newestVideos) {
                    if (!videoEntities.contains(newVideo)) {
                        videoEntities.add(newVideo);
                        if (videoEntities.size() >= 60) {
                            break;
                        }
                    }
                }
            }

            List<VideoToUserEntity> watchedVideoEntities = videoToUserRepository.findByVideoInAndUser(videoEntities, userEntity);

            List<VideoToTagEntity> taggedEntities = videoToTagRepository.findTaggedVideosByUserAndVideoIn(userEntity, watchedVideoEntities.stream().map(VideoToUserEntity::getVideo).collect(Collectors.toList()));

            List<Video> videos = videoMapper.map(videoEntities, watchedVideoEntities, taggedEntities);

            Collections.shuffle(videos);

            return videos;

        }
    }

    public void stopRecommendingChannel(String channel, UserEntity userEntity) throws ApiException {
        ChannelEntity channelEntity = channelRepository.findChannelEntityByYoutubeId(channel);

        ChannelToUserEntity channelToUserEntity = channelToUserRepository.findByChannelAndUser(channelEntity, userEntity);
        if (channelToUserEntity == null) {
            channelToUserEntity = new ChannelToUserEntity();
            channelToUserEntity.setChannel(channelEntity);
            channelToUserEntity.setUser(userEntity);
        }
        channelToUserEntity.setDontRecommend(true);
        channelToUserRepository.save(channelToUserEntity);
    }
}