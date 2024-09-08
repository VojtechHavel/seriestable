package com.seriestable.scripts;

import com.seriestable.rest.ApiException;
import com.seriestable.youtube.channel.ChannelRepository;
import com.seriestable.youtube.channel.ChannelService;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.client.YoutubeChannelService;
import com.seriestable.youtube.video.VideoRepository;
import com.seriestable.youtube.video.data.VideoEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetChannelBannerImageService {

    private static final Logger logger = LoggerFactory.getLogger(GetChannelBannerImageService.class);

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    YoutubeChannelService youtubeChannelService;

    public void saveChannelImages(){
            List<ChannelEntity> channelEntities = channelRepository.findByImageIsNull();
            logger.debug("found "+channelEntities.size()+" channels without image");

            for(ChannelEntity channelEntity: channelEntities){
                try {
                    ChannelEntity channelEntity1 = youtubeChannelService.getChannelInformation(channelEntity.getYoutubeId());
                    channelEntity.setImage(channelEntity1.getImage());
                    channelRepository.save(channelEntity);
                    logger.debug("Saved channel image for channel "+channelEntity.getYoutubeId());
                } catch (ApiException e) {
                    logger.error("Unable to get channel image for channel "+channelEntity.getYoutubeId());
                }
            }

        logger.debug("saveChannelImages finished");
    }

}
