package com.seriestable.youtube.channel.data;

import com.seriestable.youtube.video.data.PageInformation;
import com.seriestable.youtube.video.data.Video;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Channel implements PageInformation {
    private String youtubeId;

    private String title;

    private String image;

    private List<String> allCategories = new ArrayList<>();

    private List<String> presentCategories = new ArrayList<>();

    private Integer totalVideos;

    private boolean loaded;
}