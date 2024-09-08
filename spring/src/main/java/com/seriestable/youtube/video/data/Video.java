package com.seriestable.youtube.video.data;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.annotation.Nullable;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Data
public class Video {
    private String youtubeId;
    private String thumbnailUrl;
    private String title;
    private String description;
    private String note;
    private Long publishedAt;
    private Long duration;
    private Integer timeWatched;
    private Collection<String> tags = new HashSet<>();
    private String channelTitle;
    private String channelYoutubeId;
    private Long lastWatchedAt;
    private Long viewCount;
    private Long likeCount;
    private Long dislikeCount;
    private Long commentCount;
    private Long added;
    @Nullable
    private Long watchedAt;
    private List<Bookmark> bookmarks;
    @Nullable
    private Long finishedAt;
}
