package com.seriestable.youtube.client;


import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.PlaylistItem;
import com.google.api.services.youtube.model.PlaylistItemListResponse;
import com.seriestable.rest.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class YoutubePlaylistService {

//    ATTRIBUTES

    YoutubeClient youtubeClient;

    YoutubeVideoService youtubeVideoService;

    private static final Logger logger = LoggerFactory.getLogger(YoutubePlaylistService.class);

    @Autowired
    public YoutubePlaylistService(YoutubeClient youtubeClient, YoutubeVideoService youtubeVideoService) {
        this.youtubeClient = youtubeClient;
        this.youtubeVideoService = youtubeVideoService;
    }

//    PUBLIC

    public Set<String> getVideoIdsFromPlaylist(String playlistId) throws IOException, ApiException {
        List<PlaylistItem> playlistItems = searchForPlaylist(playlistId);
        return playlistItems.stream().map(playlistItem -> playlistItem.getSnippet().getResourceId().getVideoId()).collect(Collectors.toSet());
    }

//    PRIVATE

    private List<PlaylistItem> searchForPlaylist(String playlistId) throws IOException, ApiException {
        String pageToken = null;
        PlaylistItemListResponse response = searchForPlaylistItemsPage(playlistId, pageToken);
        logger.debug("Searching for playlist "+playlistId+" with pageToken "+pageToken + " page 0");
        List<PlaylistItem> playlistItems = response.getItems();
        pageToken = response.getNextPageToken();
        int safetyCounter = 1;
        while (pageToken!=null && safetyCounter<401){
            response = searchForPlaylistItemsPage(playlistId, pageToken);
            logger.debug("Searching for playlist "+playlistId+" with pageToken "+pageToken + " page "+safetyCounter + "(x"+ response.getPageInfo().getResultsPerPage() +") of " + response.getPageInfo().getTotalResults());
            playlistItems.addAll(response.getItems());
            pageToken = response.getNextPageToken();
            safetyCounter = safetyCounter +1;
        }
        return playlistItems;
    }

    public PlaylistItemListResponse searchForPlaylistItemsPage(String playlistId, String pageToken) throws IOException, ApiException {
        try {
            YouTube.PlaylistItems.List playlistByIdRequest = youtubeClient.getClient().playlistItems().list("snippet,contentDetails");
            playlistByIdRequest.setPlaylistId(playlistId);
            playlistByIdRequest.setMaxResults(50L);
            if(pageToken!=null){
                playlistByIdRequest.setPageToken(pageToken);
            }
            PlaylistItemListResponse response = youtubeClient.call(playlistByIdRequest);
            logger.trace("youtube client call response "+response);
            return response;

        } catch (IOException e) {
            logger.error("searchForPlaylist error", e);
            throw e;
        }
    }

//    GENERATED

}
