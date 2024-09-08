package com.seriestable.youtube.channel;

import com.seriestable.rest.ApiException;
import com.seriestable.user.UserService;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.channel.data.*;
import com.seriestable.youtube.video.data.Video;
import com.seriestable.youtube.video.data.VideoListPageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

/**
 * @author Vojtech Havel
 * @created June, 2018
 */

@RestController
@RequestMapping("/api/youtube/channels")
public class ChannelController {

    private static final Logger logger = LoggerFactory.getLogger(ChannelController.class);

    @Autowired
    ChannelService channelService;

    @Autowired
    UserService userService;

    @RequestMapping(value = "/ping")
    public String ping(WebRequest request) {
        return "pong";
    }

    @GetMapping(value = "/{channelId}")
    public VideoListPageResponse getChannel(WebRequest request, @PathVariable(value="channelId") String channelId, Authentication authentication) throws ApiException {
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }
        return channelService.getChannel(channelId, user);
    }

    @GetMapping(value = "/{channelId}/load")
    public ChannelVideosLoad getChannelVideosLoad(WebRequest request, @PathVariable(value="channelId") String channelId, Authentication authentication) throws ApiException {
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }

        return channelService.getChannelVideosLoadStatus(channelId, user);
    }

    @PostMapping(value = "/{channelId}/reload-image")
    public String reloadChannelImage(@PathVariable(value="channelId") String channelId, Authentication authentication) throws ApiException {
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }

        return channelService.reloadChannelImage(channelId);
    }
}
