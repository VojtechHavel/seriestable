package com.seriestable.youtube.category.data;

import com.seriestable.youtube.channel.data.Channel;
import lombok.Data;

import java.util.List;

@Data
public class Category {
    private String name;

    private String key;

    private List<Channel> channels;
}
