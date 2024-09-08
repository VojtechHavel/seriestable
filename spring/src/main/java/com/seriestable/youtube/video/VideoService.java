package com.seriestable.youtube.video;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.channel.ChannelRepository;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.client.YoutubeChannelService;
import com.seriestable.youtube.client.YoutubeVideoService;
import com.seriestable.youtube.tag.TagRepository;
import com.seriestable.youtube.video.data.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VideoService {

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    VideoToTagRepository taggedVideosRepository;

    @Autowired
    VideoToUserRepository videoToUserRepository;

    @Autowired
    VideoToTagRepository videoToTagRepository;

    @Autowired
    VideoMapper videoMapper;

    @Autowired
    YoutubeVideoService youtubeVideoService;

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    YoutubeChannelService youtubeChannelService;

    private static final Logger logger = LoggerFactory.getLogger(VideoService.class);


    public void markAsFinished(String videoId, UserEntity userEntity) throws ApiException {
        if (userEntity == null) {
            return;
        }
        logger.debug("adding to watched");

        VideoToUserEntity videoToUserEntity = findOrCreateWatchedVideo(videoId, userEntity);
        videoToUserEntity.setFinishedAt(Instant.now());

        videoToUserRepository.save(videoToUserEntity);
    }


    public void stopRecommendingVideo(String videoYoutubeId, UserEntity userEntity) throws ApiException {
        VideoToUserEntity videoToUserEntity = findOrCreateWatchedVideo(videoYoutubeId, userEntity);
        videoToUserEntity.setStopRecommending(Instant.now());
        videoToUserRepository.save(videoToUserEntity);
    }

    public Video getUserVideoData(String videoId, UserEntity userEntity) throws ApiException {
        if (userEntity == null) {
            return null;
        }

        VideoEntity videoEntity = videoRepository.findByYoutubeId(videoId);
        VideoToUserEntity videoToUserEntity = videoToUserRepository.findByVideoAndUser(videoEntity, userEntity);

        List<VideoToTagEntity> videoToTagEntities = new ArrayList<>();

        if (videoToUserEntity == null) {
            if (videoEntity == null) {
                videoEntity = getNewVideo(videoId);
            }
            videoToUserEntity = getInitialWatchedData(videoEntity);
        }

        videoToTagEntities = videoToTagRepository.findTaggedVideosByUserAndVideoIn(userEntity, Collections.singleton(videoToUserEntity.getVideo()));

        return videoMapper.map(videoToUserEntity, videoToTagEntities);
    }

    public VideoToUserEntity getInitialWatchedData(VideoEntity videoEntity) {
        VideoToUserEntity videoToUser = new VideoToUserEntity();
        videoToUser.setBookmarks(new ArrayList<>());
        videoToUser.setVideo(videoEntity);
        videoToUser.setTimeWatched(0);
        videoToUser.setNote("");
        return videoToUser;
    }

    public Video getInitialWatchedData(String videoId) throws ApiException {
        VideoEntity videoEntity = videoRepository.findByYoutubeId(videoId);

        if (videoEntity == null) {
            videoEntity = getNewVideo(videoId);
        }

        return videoMapper.map(getInitialWatchedData(videoEntity), new ArrayList<>());
    }

    public void markAsNotStarted(String videoId, UserEntity userEntity) throws ApiException {
        if (userEntity == null) {
            return;
        }
        VideoToUserEntity videoToUserEntity = findOrCreateWatchedVideo(videoId, userEntity);
        videoToUserEntity.setFinishedAt(null);
        videoToUserEntity.setTimeWatched(0);
        videoToUserRepository.save(videoToUserEntity);
    }

    public void updateNote(String videoId, UserEntity userEntity, String note) throws ApiException {
        VideoToUserEntity videoToUserEntity = findOrCreateWatchedVideo(videoId, userEntity);
        if (videoToUserEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Video was not found.");
        }
        videoToUserEntity.setNote(note);
        videoToUserRepository.save(videoToUserEntity);
    }

    public void updateTimeWatched(String videoId, UserEntity userEntity, Integer timeWatched) throws ApiException {
        VideoToUserEntity videoToUserEntity = findOrCreateWatchedVideo(videoId, userEntity);
        if (videoToUserEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Video was not found.");
        }
        videoToUserEntity.setTimeWatched(timeWatched);
        videoToUserEntity.setLastWatchedAt(Instant.now());
        videoToUserRepository.save(videoToUserEntity);
    }

    public void updateBookmarks(String videoId, UserEntity userEntity, List<Bookmark> bookmarks) throws ApiException {
        VideoToUserEntity videoToUserEntity = findOrCreateWatchedVideo(videoId, userEntity);
        if (videoToUserEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Video was not found.");
        }

        if (videoToUserEntity.getBookmarks() != null) {
            videoToUserEntity.getBookmarks().clear();
        } else {
            videoToUserEntity.setBookmarks(new ArrayList<>());
        }

        List<BookmarkEntity> bookmarkEntities = videoMapper.mapBookmarks(bookmarks);
        videoToUserEntity.getBookmarks().addAll(bookmarkEntities);

        for (BookmarkEntity bookmarkEntity : bookmarkEntities) {
            bookmarkEntity.setVideo(videoToUserEntity);
        }
        videoToUserRepository.save(videoToUserEntity);
    }

    private VideoToUserEntity findOrCreateWatchedVideo(String videoId, UserEntity userEntity) throws ApiException {
        VideoEntity videoEntity = videoRepository.findByYoutubeId(videoId);
        if (videoEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Video was not found.");
        }
        VideoToUserEntity videoToUserEntity = videoToUserRepository.findByVideoAndUser(videoEntity, userEntity);
        if (videoToUserEntity == null) {
            videoToUserEntity = new VideoToUserEntity();
            videoToUserEntity.setVideo(videoEntity);
            videoToUserEntity.setUser(userEntity);
            return videoToUserEntity;
        } else {
            return videoToUserEntity;
        }
    }

    public List<Video> getContinueWatching(UserEntity userEntity) {
        if (userEntity == null) {
            return null;
        }

        Set<VideoToUserEntity> watchedVideoEntities = videoToUserRepository.findContinueWatchingVideos(userEntity);
        List<VideoToTagEntity> taggedEntities = taggedVideosRepository.findTaggedVideosByUserAndVideoIn(userEntity, watchedVideoEntities.stream().map(VideoToUserEntity::getVideo).collect(Collectors.toList()));

        return videoMapper.map(watchedVideoEntities.stream().map(VideoToUserEntity::getVideo).collect(Collectors.toSet()), watchedVideoEntities, taggedEntities);
    }

    public List<Video> getNotesVideos(UserEntity userEntity) {
        if (userEntity == null) {
            return null;
        }

        Set<VideoToUserEntity> watchedVideoEntities = videoToUserRepository.findNotesVideos(userEntity);
        List<VideoToTagEntity> taggedEntities = taggedVideosRepository.findTaggedVideosByUserAndVideoIn(userEntity, watchedVideoEntities.stream().map(VideoToUserEntity::getVideo).collect(Collectors.toList()));

        return videoMapper.map(watchedVideoEntities.stream().map(VideoToUserEntity::getVideo).collect(Collectors.toSet()), watchedVideoEntities, taggedEntities);
    }

    /**
     * We don't know channel of item loaded through playlist, so we need another call to get video details
     *
     * @param videoIds
     * @return
     * @throws IOException
     */
    public List<VideoEntity> getVideosFromIds(Set<String> videoIds) throws IOException, ApiException {

        List<VideoEntity> result = new ArrayList<>();
        List<VideoEntity> videoEntitiesToSave = new ArrayList<>();
        List<String> newVideosIds = new ArrayList<>();

        for (String videoId : videoIds) {
            VideoEntity existingVideoEntity = videoRepository.findByYoutubeId(videoId);
            if (existingVideoEntity == null) {
                newVideosIds.add(videoId);
            } else {
                result.add(existingVideoEntity);
            }
        }

        List<VideoEntity> newVideoEntities = youtubeVideoService.getVideos(newVideosIds);

        for (VideoEntity videoEntity : newVideoEntities) {
            setVideoEntityChannel(videoEntity);
            videoEntitiesToSave.add(videoEntity);
        }

        videoRepository.save(videoEntitiesToSave);

        result.addAll(videoEntitiesToSave);

        return result;
    }


    public List<VideoEntity> saveNewVideoEntities(List<VideoEntity> videos) throws ApiException {
        List<VideoEntity> videoEntitiesToSave = new ArrayList<>();

        for (VideoEntity video : videos) {
            VideoEntity existingVideoEntity = videoRepository.findByYoutubeId(video.getYoutubeId());
            if (existingVideoEntity == null) {
                videoEntitiesToSave.add(video);
            }
        }

        for (VideoEntity videoEntity : videoEntitiesToSave) {
            setVideoEntityChannel(videoEntity);
        }

        try {
            youtubeVideoService.addDurationsAndStatistics(videos);
        } catch (IOException e) {
            logger.error("Unable to add duration for videos " + videos.stream().map(VideoEntity::getYoutubeId), e);
        }

        videoRepository.save(videoEntitiesToSave);

        return videoEntitiesToSave;
    }

    public VideoEntity getNewVideo(String videoId) throws ApiException {
        VideoEntity videoEntity = null;
        try {
            videoEntity = youtubeVideoService.getVideo(videoId);
        } catch (IOException e) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Video was not found.");
        }
        setVideoEntityChannel(videoEntity);
        videoRepository.save(videoEntity);
        return videoEntity;
    }

    public void setVideoEntityChannel(VideoEntity videoEntity) throws ApiException {
        ChannelEntity channelEntity = channelRepository.findChannelEntityByYoutubeId(videoEntity.getChannel().getYoutubeId());
        if (channelEntity == null) {
            channelEntity = youtubeChannelService.getChannelInformation(videoEntity.getChannel().getYoutubeId());
            channelRepository.save(channelEntity);
        }
        videoEntity.setChannel(channelEntity);
    }
}
