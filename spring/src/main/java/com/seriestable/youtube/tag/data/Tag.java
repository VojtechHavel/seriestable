package com.seriestable.youtube.tag.data;

import com.seriestable.youtube.video.data.PageInformation;
import lombok.Data;

@Data
public class Tag implements PageInformation {
    private String name;
    private String key;
    private String icon;
    private String color;
}
