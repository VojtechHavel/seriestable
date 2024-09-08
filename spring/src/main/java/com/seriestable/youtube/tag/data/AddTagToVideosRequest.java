package com.seriestable.youtube.tag.data;

import lombok.Data;

import java.util.List;

@Data
public class AddTagToVideosRequest {
    List<String> videoIds;
}
