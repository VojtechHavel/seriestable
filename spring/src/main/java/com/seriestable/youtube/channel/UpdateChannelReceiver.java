package com.seriestable.youtube.channel;

import com.google.api.services.youtube.model.PlaylistItem;
import com.google.api.services.youtube.model.PlaylistItemListResponse;
import com.seriestable.rest.ApiException;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.channel.data.UpdateChannelMessage;
import com.seriestable.youtube.client.YoutubePlaylistService;
import com.seriestable.youtube.video.VideoService;
import com.seriestable.youtube.video.data.VideoEntity;
import com.seriestable.youtube.video.data.VideoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

@Component
public class UpdateChannelReceiver {

    private static final Logger logger = LoggerFactory.getLogger(UpdateChannelReceiver.class);

    public static final String UPDATE_CHANNEL_QUEUE_NAME = "updateChannelQueue";

    @Autowired
    YoutubePlaylistService youtubePlaylistService;

    @Autowired
    VideoMapper videoMapper;

    @Autowired
    VideoService videoService;

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    JmsTemplate jmsTemplate;

    @JmsListener(destination = UpdateChannelReceiver.UPDATE_CHANNEL_QUEUE_NAME, containerFactory = "myFactory")
    public void receiveMessage(UpdateChannelMessage message) throws IOException, ApiException {
        logger.debug("Received <" + message + ">");
        ChannelEntity channelEntity = channelRepository.findChannelEntityByYoutubeId(message.getChannelYoutubeId());

        if(message.getSafetyCounter() < 4001){
            PlaylistItemListResponse playlistItemListResponse = youtubePlaylistService.searchForPlaylistItemsPage(message.getPlaylistId(), message.getPageToken());
            List<PlaylistItem> items = playlistItemListResponse.getItems();

            List<VideoEntity> videos = videoService.saveNewVideoEntities(videoMapper.mapPlaylistItems(items, channelEntity));

            boolean alreadyLoaded = isAlreadyLoaded(videos, Instant.ofEpochMilli(message.getLastUpdateInstant()));


            if(playlistItemListResponse.getNextPageToken()!=null && !alreadyLoaded) {
                UpdateChannelMessage loadChannelMessage = new UpdateChannelMessage();
                loadChannelMessage.setPageToken(playlistItemListResponse.getNextPageToken());
                loadChannelMessage.setSafetyCounter(message.getSafetyCounter() + 1);
                loadChannelMessage.setChannelYoutubeId(message.getChannelYoutubeId());
                loadChannelMessage.setPlaylistId(message.getPlaylistId());
                loadChannelMessage.setLastUpdateInstant(message.getLastUpdateInstant());
                logger.debug("Sending an load channel message " + loadChannelMessage);
                jmsTemplate.convertAndSend(UpdateChannelReceiver.UPDATE_CHANNEL_QUEUE_NAME, loadChannelMessage);
            }else{
                finish(channelEntity);
            }
        }else{
            logger.info("safety counter exceeded limit " + message);
            finish(channelEntity);
        }
    }


    /**
     * checks if loaded videos were published before last update
     * @param videos
     * @param lastUpdateInstant
     * @return
     */
    public static boolean isAlreadyLoaded(List<VideoEntity> videos, Instant lastUpdateInstant) {
        for(VideoEntity item: videos){
            if(item.getPublishedAt().isBefore(lastUpdateInstant)){
                return true;
            }
        }
        return false;
    }

    private void finish(ChannelEntity channelEntity){
        channelEntity.setUpdateFinish(Instant.now());
        channelRepository.save(channelEntity);
    }

}