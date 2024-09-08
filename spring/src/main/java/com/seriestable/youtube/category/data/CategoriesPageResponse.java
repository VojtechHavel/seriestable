package com.seriestable.youtube.category.data;

import com.seriestable.youtube.channel.data.Channel;
import com.seriestable.youtube.video.data.Video;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class CategoriesPageResponse {
    List<Channel> recommendedChannels = new ArrayList<>();

    List<Category> categories = new ArrayList<>();
}
