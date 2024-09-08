package com.seriestable.youtube.client;

import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.ChannelContentDetails;
import com.google.api.services.youtube.model.ChannelListResponse;
import com.google.api.services.youtube.model.PlaylistItem;
import com.google.api.services.youtube.model.PlaylistItemListResponse;
import com.seriestable.rest.ApiException;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.channel.data.ChannelMapper;
import com.seriestable.youtube.video.data.VideoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;


@Service
public class YoutubeChannelService {

    private static final Logger logger = LoggerFactory.getLogger(YoutubeChannelService.class);

    @Autowired
    YoutubeClient youtubeClient;

    @Autowired
    ChannelMapper channelMapper;

    @Autowired
    VideoMapper videoMapper;

    @Autowired
    YoutubeVideoService youtubeVideoService;

    @Autowired
    YoutubePlaylistService youtubePlaylistService;

    public ChannelEntity getChannelInformation(String channelYoutubeId) throws ApiException {
        logger.debug("channelYoutubeId 2 {}", channelYoutubeId);
        try {
            YouTube.Channels.List request = youtubeClient.getClient().channels().list("");
            request.setId(channelYoutubeId);
            request.setPart("snippet");
            ChannelListResponse response = youtubeClient.call(request);
            logger.trace("youtube client call response " + response);
            if (response.getItems().isEmpty()) {
                return null;
            } else {
                return channelMapper.map(response.getItems().get(0));
            }
        } catch (IOException e) {
            logger.error("getChannelInformation error", e);
        }
        return null;
    }

    public String getChannelIdByUsername(String userName) throws ApiException {
        logger.debug("userName {}", userName);
        try {
            YouTube.Channels.List request = youtubeClient.getClient().channels().list("");
            request.setForUsername(userName);
            request.setPart("id");
            ChannelListResponse response = youtubeClient.call(request);
            logger.debug("youtube client call response " + response);
            if (response.getPageInfo().getTotalResults() == 0) {
                return null;
            } else {
                return response.getItems().get(0).getId();
            }
        } catch (IOException e) {
            logger.error("getChannelInformation error", e);
        }
        return null;
    }

    public ChannelVideosResponse loadChannelFirstPage(String channelYoutubeId, ChannelEntity channelEntity) throws IOException, ApiException {
        String playlistId = getChannelUploadPlaylistId(channelYoutubeId);
        PlaylistItemListResponse playlistItemListResponse = youtubePlaylistService.searchForPlaylistItemsPage(playlistId, null);
        List<PlaylistItem> items = playlistItemListResponse.getItems();

        ChannelVideosResponse channelVideosResponse = new ChannelVideosResponse();

        channelVideosResponse.setVideos(videoMapper.mapPlaylistItems(items, channelEntity));
        channelVideosResponse.setPlaylistId(playlistId);
        channelVideosResponse.setTotalResults(playlistItemListResponse.getPageInfo().getTotalResults());
        channelVideosResponse.setNextPageToken(playlistItemListResponse.getNextPageToken());
        return channelVideosResponse;
    }

    public String getChannelUploadPlaylistId(String channelYoutubeId) throws IOException, ApiException {
        YouTube.Channels.List request = youtubeClient.getClient().channels().list("");
        request.setId(channelYoutubeId);
        request.setPart("contentDetails");
        ChannelListResponse response = youtubeClient.call(request);
        logger.trace("youtube client call response " + response);

        ChannelContentDetails.RelatedPlaylists relatedPlaylists = response.getItems().get(0).getContentDetails().getRelatedPlaylists();
        return relatedPlaylists.getUploads();
    }
}
