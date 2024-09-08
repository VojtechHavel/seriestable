package com.seriestable.youtube.channel.data;

import lombok.Data;

@Data
public class ChannelVideosLoad {
    Long videoCount;
    boolean loadFinished;
}