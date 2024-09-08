package com.seriestable.youtube.video.data;

import com.seriestable.youtube.filter.data.Filter;
import lombok.Data;

import javax.annotation.Nullable;
import java.util.Collection;
import java.util.List;

@Data
public class VideoListPageResponse {

    private Collection<Video> videos;

    @Nullable
    private Filter filter;

    private PageInformation information;
}
