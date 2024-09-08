package com.seriestable.youtube.video.data;

import com.google.api.services.youtube.model.PlaylistItem;
import com.google.api.services.youtube.model.SearchResult;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.tag.data.Tag;
import com.seriestable.youtube.tag.data.TagEntity;
import org.apache.commons.lang3.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VideoMapper {

    private static final Logger logger = LoggerFactory.getLogger(VideoMapper.class);

    public VideoEntity map(SearchResult searchResult) {
        VideoEntity video = new VideoEntity();
        video.setThumbnailUrl(searchResult.getSnippet().getThumbnails().getMedium().getUrl());
        video.setTitle(StringEscapeUtils.unescapeHtml4(searchResult.getSnippet().getTitle()));
        video.setDescription(StringEscapeUtils.unescapeHtml4(searchResult.getSnippet().getDescription()));
        video.setPublishedAt(Instant.ofEpochMilli(searchResult.getSnippet().getPublishedAt().getValue()));
        video.setYoutubeId(searchResult.getId().getVideoId());
        return video;
    }

    public List<VideoEntity> mapSearchResults(List<SearchResult> searchResults) {
        List<VideoEntity> videos = new ArrayList<>();
        for (SearchResult searchResult : searchResults) {
            videos.add(map(searchResult));
        }
        return videos;
    }

    public Video map(VideoEntity videoEntity) {
        Video video = new Video();
        video.setThumbnailUrl(videoEntity.getThumbnailUrl());
        video.setTitle(videoEntity.getTitle());
        video.setDescription(videoEntity.getDescription());
        video.setPublishedAt(videoEntity.getPublishedAt().toEpochMilli());
        video.setYoutubeId(videoEntity.getYoutubeId());
        video.setDuration(videoEntity.getDuration());

        video.setCommentCount(videoEntity.getCommentCount());
        video.setLikeCount(videoEntity.getLikeCount());
        video.setDislikeCount(videoEntity.getDislikeCount());
        video.setViewCount(videoEntity.getViewCount());

        video.setChannelYoutubeId(videoEntity.getChannel().getYoutubeId());
        video.setChannelTitle(videoEntity.getChannel().getTitle());
        return video;
    }

    public Collection<Video> map(Collection<VideoEntity> videoEntities){
        return videoEntities.stream().map(this::map).collect(Collectors.toList());
    }

    public List<Video> map(Collection<VideoEntity> videoEntities, Collection<VideoToUserEntity> watchedVideos, Collection<VideoToTagEntity> taggedVideoEntities) {
        Map<Long, Collection<String>> taggedVideos = mapTaggedVideos(taggedVideoEntities);
        Map<Long, VideoToUserEntity> watchedVideosMap = mapWatchedVideosIntoMap(watchedVideos);

        List<Video> videos = new ArrayList<>();
        for (VideoEntity videoEntity : videoEntities) {
            Video video = map(videoEntity);

            //watched
            if (watchedVideosMap.containsKey(videoEntity.getId())) {
                VideoToUserEntity videoToUserEntity = watchedVideosMap.get(videoEntity.getId());
                addVideoToUserEntityAttributes(video, videoToUserEntity);
            }

            //tags
            if (taggedVideos.containsKey(videoEntity.getId())) {
                video.getTags().addAll(taggedVideos.get(videoEntity.getId()));
            }
            videos.add(video);
        }
        return videos;
    }

    private Map<Long, VideoToUserEntity> mapWatchedVideosIntoMap(Collection<VideoToUserEntity> watchedVideos){
        Map<Long, VideoToUserEntity> watchedVideosMap = new HashMap<>();
        watchedVideos.forEach(watchedVideoEntity -> watchedVideosMap.put(watchedVideoEntity.getVideo().getId(), watchedVideoEntity));
        return watchedVideosMap;
    }

    public Bookmark map(BookmarkEntity bookmarkEntity) {
        Bookmark bookmark = new Bookmark();
        bookmark.setName(bookmarkEntity.getName());
        bookmark.setTimeInSeconds(bookmarkEntity.getTimeInSeconds());
        return bookmark;
    }

    public BookmarkEntity map(Bookmark bookmark) {
        BookmarkEntity bookmarkEntity = new BookmarkEntity();
        bookmarkEntity.setName(bookmark.getName());
        bookmarkEntity.setTimeInSeconds(bookmark.getTimeInSeconds());
        return bookmarkEntity;
    }

    public List<Bookmark> mapBookmarkEntities(List<BookmarkEntity> bookmarkEntities) {
        List<Bookmark> bookmarks = new ArrayList<>();
        for (BookmarkEntity bookmarkEntity : bookmarkEntities) {
            bookmarks.add(map(bookmarkEntity));
        }
        return bookmarks;
    }

    public List<BookmarkEntity> mapBookmarks(List<Bookmark> bookmarks) {
        List<BookmarkEntity> bookmarkEntities = new ArrayList<>();
        for (Bookmark bookmark : bookmarks) {
            bookmarkEntities.add(map(bookmark));
        }
        return bookmarkEntities;
    }

    public Video map(VideoToUserEntity videoToUserEntity, List<VideoToTagEntity> videoToTagEntities) {
        Video video = map(videoToUserEntity.getVideo());

        addVideoToUserEntityAttributes(video, videoToUserEntity);

        for(VideoToTagEntity videoToTagEntity: videoToTagEntities){
            video.getTags().add(videoToTagEntity.getTag().getName());
        }
        return video;
    }

    public void addVideoToUserEntityAttributes(Video video, VideoToUserEntity videoToUserEntity){
        video.setBookmarks(mapBookmarkEntities(videoToUserEntity.getBookmarks()));
        video.setTimeWatched(videoToUserEntity.getTimeWatched());
        video.setNote(videoToUserEntity.getNote());

        if (videoToUserEntity.getFinishedAt() != null) {
            video.setFinishedAt(videoToUserEntity.getFinishedAt().toEpochMilli());
        }
        if (videoToUserEntity.getLastWatchedAt() != null) {
            video.setLastWatchedAt(videoToUserEntity.getLastWatchedAt().toEpochMilli());
        }
        if (videoToUserEntity.getWatchedAt() != null) {
            video.setWatchedAt(videoToUserEntity.getWatchedAt().toEpochMilli());
        }
    }

    public Map<Long, Collection<String>> mapTaggedVideos(Collection<VideoToTagEntity> taggedVideoEntities){
        Map<Long, Collection<String>> taggedVideos = new HashMap<>();

        for(VideoToTagEntity videoToTagEntity : taggedVideoEntities){
            Long key = videoToTagEntity.getVideo().getId();

            if(!taggedVideos.containsKey(key)){
                taggedVideos.put(key, new ArrayList<>());
            }
            taggedVideos.get(key).add(videoToTagEntity.getTag().getName());

        }

        return taggedVideos;
    }


    public Collection<Tag> mapTagEntities(Collection<TagEntity> tagEntities) {
        Collection<Tag> tags = new HashSet<>();

        for(TagEntity tagEntity: tagEntities){
            tags.add(mapTagEntity(tagEntity));
        }

        return tags;
    }

    public Tag mapTagEntity(TagEntity tagEntity){
        Tag tag = new Tag();
        tag.setName(tagEntity.getName());
        tag.setKey(tagEntity.getName()+"Key");
        tag.setColor(tagEntity.getColor());
        tag.setIcon(tagEntity.getIcon());
        return tag;
    }

    public List<VideoEntity> mapPlaylistItems(List<PlaylistItem> items, ChannelEntity channelEntity) {
        List<VideoEntity> videoEntities = new ArrayList<>();
        for(PlaylistItem playlistItem: items){
            VideoEntity video = new VideoEntity();

            video.setThumbnailUrl(playlistItem.getSnippet().getThumbnails().getMedium().getUrl());
            video.setTitle(StringEscapeUtils.unescapeHtml4(playlistItem.getSnippet().getTitle()));
            video.setDescription(StringEscapeUtils.unescapeHtml4(playlistItem.getSnippet().getDescription()));
            video.setPublishedAt(Instant.ofEpochMilli(playlistItem.getSnippet().getPublishedAt().getValue()));
            video.setYoutubeId(playlistItem.getSnippet().getResourceId().getVideoId());
            video.setChannel(channelEntity);

            videoEntities.add(video);
        }
        return videoEntities;
    }
}