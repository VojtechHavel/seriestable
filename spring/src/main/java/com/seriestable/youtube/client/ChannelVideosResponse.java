package com.seriestable.youtube.client;

import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.video.data.VideoEntity;
import lombok.Data;

import java.util.List;

@Data
public class ChannelVideosResponse {
    private List<VideoEntity> videos;
    private String nextPageToken;
    private String playlistId;
    private Integer totalResults;
}
