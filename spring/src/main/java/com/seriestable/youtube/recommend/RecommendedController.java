package com.seriestable.youtube.recommend;

import com.seriestable.rest.ApiException;
import com.seriestable.user.UserService;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.filter.FilterService;
import com.seriestable.youtube.filter.data.VideoListType;
import com.seriestable.youtube.video.VideoService;
import com.seriestable.youtube.video.data.VideoListPageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/youtube/recommended")
public class RecommendedController {

    @Autowired
    RecommendedService recommendedService;

    @Autowired
    VideoService videoService;

    @Autowired
    UserService userService;

    @Autowired
    FilterService filterService;

    @DeleteMapping(value = "channels/{channelId}")
    public void stopRecommendingChannel(@PathVariable(value="channelId") String channelId, Authentication authentication) throws ApiException {
        recommendedService.stopRecommendingChannel(
                channelId,
                userService.getUserOrThrowIgnoreException(authentication)
        );
    }

    @DeleteMapping(value = "videos/{videoId}")
    public void stopRecommendingVideo(@PathVariable(value="videoId") String videoId, Authentication authentication) throws ApiException {
        videoService.stopRecommendingVideo(
                videoId,
                userService.getUserOrThrowIgnoreException(authentication)
        );
    }

    @GetMapping(value = "videos/{videoId}")
    VideoListPageResponse getRecommendedVideos(@PathVariable(value="videoId") String videoId, Authentication authentication){
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }

        VideoListPageResponse videoListPageResponse = new VideoListPageResponse();
        videoListPageResponse.setVideos(recommendedService.recommendVideos(videoId, user,0));
        videoListPageResponse.setFilter(filterService.findFilterOrGetDefaultOne(null, VideoListType.RECOMMENDED, null));
        return videoListPageResponse;
    }
}
