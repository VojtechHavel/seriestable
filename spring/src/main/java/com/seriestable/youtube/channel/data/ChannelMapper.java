package com.seriestable.youtube.channel.data;

import com.seriestable.youtube.category.data.Category;
import com.seriestable.youtube.category.data.ChannelToCategoryEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChannelMapper {
    public ChannelEntity map(com.google.api.services.youtube.model.Channel channel){
        ChannelEntity channelEntity = new ChannelEntity();
        channelEntity.setImage(channel.getSnippet().getThumbnails().getHigh().getUrl());
        channelEntity.setTitle(channel.getSnippet().getTitle());
        channelEntity.setYoutubeId(channel.getId());
        return channelEntity;
    }

    public com.seriestable.youtube.channel.data.Channel map(ChannelEntity channelEntity) {
        com.seriestable.youtube.channel.data.Channel channel = new com.seriestable.youtube.channel.data.Channel();
            channel.setImage(channelEntity.getImage());
            channel.setTitle(channelEntity.getTitle());
            channel.setYoutubeId(channelEntity.getYoutubeId());
            channel.setTotalVideos(channelEntity.getTotalVideos());
            channel.setLoaded(channelEntity.getUpdateFinish()!=null);
        return channel;
    }

    public Map<String, Category> map(List<ChannelToCategoryEntity> channelToCategoryEntities) {
        Map<String, Category> channelCategoryMap = new HashMap<>();
        Map<String, Channel> channelMap = new HashMap<>();

        for(ChannelToCategoryEntity channelToCategoryEntity: channelToCategoryEntities){
            if(!channelCategoryMap.containsKey(channelToCategoryEntity.getCategory().getName())){
                Category category = new Category();
                category.setName(channelToCategoryEntity.getCategory().getName());
                category.setKey(channelToCategoryEntity.getCategory().getName() + "Key");
                category.setChannels(new ArrayList<>());
                channelCategoryMap.put(channelToCategoryEntity.getCategory().getName(), category);
            }

            Channel channel;

            if(channelMap.containsKey(channelToCategoryEntity.getChannel().getYoutubeId())){
                channel = channelMap.get(channelToCategoryEntity.getChannel().getYoutubeId());
            }else{
                channel = map(channelToCategoryEntity.getChannel());
                channelMap.put(channel.getYoutubeId(), channel);
            }
            channelCategoryMap.get(channelToCategoryEntity.getCategory().getName()).getChannels().add(channel);
        }
        return channelCategoryMap;
    }

    public com.seriestable.youtube.channel.data.Channel map(ChannelEntity channelEntity, List<ChannelToCategoryEntity> channelToCategoryEntities) {
        Channel channel = map(channelEntity);
        for(ChannelToCategoryEntity channelToCategoryEntity: channelToCategoryEntities){
            channel.getPresentCategories().add(channelToCategoryEntity.getCategory().getName());
        }
        return channel;
    }
}
