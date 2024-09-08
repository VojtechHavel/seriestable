package com.seriestable.youtube.channel.data;

import lombok.Data;

import java.time.Instant;

@Data
public class UpdateChannelMessage {
    private String pageToken;
    private String channelYoutubeId;
    private String playlistId;
    private int safetyCounter;
    private Long lastUpdateInstant;
}
