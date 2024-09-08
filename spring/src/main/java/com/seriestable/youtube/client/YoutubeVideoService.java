package com.seriestable.youtube.client;

import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import com.seriestable.rest.ApiException;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.channel.data.ChannelMapper;
import com.seriestable.youtube.video.data.VideoEntity;
import com.seriestable.youtube.video.data.VideoMapper;
import org.apache.commons.lang3.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class YoutubeVideoService {

//    ATTRIBUTES

    private static final Logger logger = LoggerFactory.getLogger(YoutubeVideoService.class);

    YoutubeClient youtubeClient;

    VideoMapper videoMapper;

    @Autowired
    public YoutubeVideoService(YoutubeClient youtubeClient, VideoMapper videoMapper, ChannelMapper channelMapper) {
        this.youtubeClient = youtubeClient;
        this.videoMapper = videoMapper;
    }

//    PUBLIC

    public VideoEntity getVideo(String videoId) throws IOException, ApiException {
        VideoListResponse videoResponse = searchForVideo(videoId);

        if (videoResponse == null || videoResponse.getItems() == null || videoResponse.getItems().isEmpty()) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Video was not found.");
        }

        Video video = videoResponse.getItems().get(0);

        return mapVideoIntoVideoEntity(video);
    }

    public List<VideoEntity> getVideos(List<String> videoIds) throws IOException, ApiException {
        List<Video> videos = new ArrayList<>();

        final int pageSize = 40;
        double numberOfPages = Math.ceil((double) videoIds.size() / (double) pageSize);


        for (int i = 0; i < numberOfPages; i++) {
            int lastItem = pageSize * i + pageSize;
            if (lastItem > videoIds.size()) {
                lastItem = videoIds.size();
            }

            VideoListResponse videoResponse = searchForVideo(String.join(",", videoIds.subList(pageSize * i, lastItem)));

            if (videoResponse == null || videoResponse.getItems() == null || videoResponse.getItems().isEmpty()) {
                logger.debug("No items found for " + videoIds.subList(pageSize * i, lastItem));
            } else {
                videos.addAll(videoResponse.getItems());
            }
        }

        return mapVideosIntoVideoEntities(videos);
    }

    //    PRIVATE

    private VideoEntity mapVideoIntoVideoEntity(Video video) {
        VideoEntity videoEntity = new VideoEntity();
        ChannelEntity channelEntity = new ChannelEntity();
        channelEntity.setYoutubeId(video.getSnippet().getChannelId());
        channelEntity.setTitle(video.getSnippet().getChannelTitle());
        videoEntity.setChannel(channelEntity);
        java.time.Duration d = java.time.Duration.parse(video.getContentDetails().getDuration());

        videoEntity.setDuration(d.get(java.time.temporal.ChronoUnit.SECONDS));
        videoEntity.setYoutubeId(video.getId());
        videoEntity.setTitle(StringEscapeUtils.unescapeHtml4(video.getSnippet().getTitle()));
        videoEntity.setDescription(StringEscapeUtils.unescapeHtml4(video.getSnippet().getDescription()));
        videoEntity.setThumbnailUrl(video.getSnippet().getThumbnails().getMedium().getUrl());
        videoEntity.setPublishedAt(Instant.ofEpochMilli(video.getSnippet().getPublishedAt().getValue()));

        setStatistics(video, videoEntity);

        return videoEntity;
    }


    private List<VideoEntity> mapVideosIntoVideoEntities(List<Video> videos) {
        return videos.stream().map(this::mapVideoIntoVideoEntity).collect(Collectors.toList());
    }

    private VideoListResponse searchForVideo(String videoId) throws IOException, ApiException {
        try {

            logger.debug("searchForVideo videoId " + videoId);
            YouTube.Videos.List videosListByIdRequest = youtubeClient.getClient().videos().list("snippet,contentDetails,statistics");
            videosListByIdRequest.setId(videoId);
            VideoListResponse response = youtubeClient.call(videosListByIdRequest);
            logger.trace("youtube client call response " + response);
            return response;

        } catch (IOException e) {
            logger.error("getChannels error", e);
            throw e;
        }
    }


    private VideoListResponse searchForVideosCall(List<String> videoIds, String part) throws IOException, ApiException {

        YouTube.Videos.List videosListByIdRequest = youtubeClient.getClient().videos().list(part);
        StringBuilder idBuilder = new StringBuilder();
        for (int i = 0; i < videoIds.size(); i++) {
            if (videoIds.get(i) != null) {
                idBuilder.append(videoIds.get(i));
                if (i != (videoIds.size() - 1)) {
                    idBuilder.append(",");
                }
            }
        }

        logger.debug("searching for ids" + idBuilder.toString());

        videosListByIdRequest.setId(idBuilder.toString());
        VideoListResponse response = youtubeClient.call(videosListByIdRequest);
        logger.trace("youtube client call response " + response);
        return response;
    }

    public void addVideosToSearchResult(SearchListResponse pageResponse, List<SearchResult> videos, Set<String> youtubeVideoIds) {
        for (SearchResult video : pageResponse.getItems()) {
            if (!youtubeVideoIds.contains(video.getId().getVideoId())) {
                videos.add(video);
                youtubeVideoIds.add(video.getId().getVideoId());
            } else {
                logger.debug("Duplicate video with id {} in result", video.getId().getVideoId());
            }
        }
    }

    public void addDurationsAndStatistics(List<VideoEntity> videoEntities) throws IOException, ApiException {
        HashMap<String, VideoEntity> videoEntityHashMap = new HashMap<>();
        for (VideoEntity videoEntity : videoEntities) {
            videoEntityHashMap.put(videoEntity.getYoutubeId(), videoEntity);
        }

        List<String> idList = new ArrayList<>(videoEntityHashMap.keySet());

        java.util.List<Video> videos = searchForVideos(idList, "contentDetails,statistics");

        logger.trace("added duration to videos " + videos);

        for (Video video : videos) {

            java.time.Duration d = java.time.Duration.parse(video.getContentDetails().getDuration());

            Long duration = d.get(java.time.temporal.ChronoUnit.SECONDS);

            videoEntityHashMap.get(video.getId()).setDuration(duration);

            setStatistics(video, videoEntityHashMap.get(video.getId()));
        }

        for (VideoEntity videoEntity : videoEntities) {
            if (videoEntity.getDuration() == null || videoEntity.getDuration() == 0) {
                logger.debug(videoEntity.getYoutubeId() + " does not have duration");
                videoEntity.setUnavailable(true);
            }
        }

        setUnavailable(videoEntities, videos);
    }

    public void addStatistics(List<VideoEntity> videoEntities) throws IOException, ApiException {
        HashMap<String, VideoEntity> videoEntityHashMap = new HashMap<>();
        for (VideoEntity videoEntity : videoEntities) {
            videoEntityHashMap.put(videoEntity.getYoutubeId(), videoEntity);
        }

        List<String> idList = new ArrayList<>(videoEntityHashMap.keySet());

        java.util.List<Video> videos = searchForVideos(idList, "statistics");

        logger.trace("added statistics to videos " + videos);

        for (Video video : videos) {
            setStatistics(video, videoEntityHashMap.get(video.getId()));
        }

        setUnavailable(videoEntities, videos);
    }

    public void addDescriptions(List<VideoEntity> videoEntities) throws IOException, ApiException {
        HashMap<String, VideoEntity> videoEntityHashMap = new HashMap<>();
        for (VideoEntity videoEntity : videoEntities) {
            videoEntityHashMap.put(videoEntity.getYoutubeId(), videoEntity);
        }

        List<String> idList = new ArrayList<>(videoEntityHashMap.keySet());

        java.util.List<Video> videos = searchForVideos(idList, "snippet");

        logger.debug("added description to videos " + videos);

        for (Video video : videos) {
            videoEntityHashMap.get(video.getId()).setDescription(video.getSnippet().getDescription());
        }

        //set all not found as unavailable
        setUnavailable(videoEntities, videos);
    }

    public void setStatistics(Video video, VideoEntity videoEntity){
        if (video.getStatistics() == null) {
            logger.debug("setting unavailable for "+ video.getId());
            videoEntity.setUnavailable(true);
        } else {
            logger.debug("setting statistics for "+ video);
            if (video.getStatistics().getDislikeCount() != null) {
                videoEntity.setDislikeCount(video.getStatistics().getDislikeCount().longValue());
            }else{
                videoEntity.setDislikeCount(0L);
            }

            if (video.getStatistics().getLikeCount() != null) {
                videoEntity.setLikeCount(video.getStatistics().getLikeCount().longValue());
            }else{
                videoEntity.setLikeCount(0L);
            }

            if (video.getStatistics().getViewCount() != null) {
                videoEntity.setViewCount(video.getStatistics().getViewCount().longValue());
            }else{
                videoEntity.setViewCount(0L);
            }

            if (video.getStatistics().getCommentCount() != null) {
                videoEntity.setCommentCount(video.getStatistics().getCommentCount().longValue());
            }else{
                videoEntity.setCommentCount(0L);
            }
        }
    }

    private void setUnavailable(List<VideoEntity> videoEntities, java.util.List<Video> videos) {
        for (VideoEntity videoEntity : videoEntities) {
            boolean found = false;
            for (Video video : videos) {
                if (video.getId().equals(videoEntity.getYoutubeId())) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                logger.debug("setting unavailable for "+ videoEntity.getYoutubeId());
                videoEntity.setUnavailable(true);
            }
        }
    }


    private java.util.List<Video> searchForVideos(List<String> videoIds, String part) throws IOException, ApiException {
        java.util.List<Video> items = new ArrayList<>();

        int pageSize = 50;

        int pages = (int) Math.ceil((double) videoIds.size() / pageSize);

        for (int i = 0; i < pages; i++) {
            int last = pageSize * i + pageSize;
            if (videoIds.size() < last) {
                last = videoIds.size();
            }
            List<String> pageIds = videoIds.subList(pageSize * i, last);

            VideoListResponse videoListResponse = searchForVideosCall(pageIds, part);
            if (videoListResponse != null) {
                items.addAll(videoListResponse.getItems());
            }
        }

        return items;
    }

}
