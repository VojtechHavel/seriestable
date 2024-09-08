package com.seriestable.youtube.video;

import com.seriestable.rest.ApiException;
import com.seriestable.user.UserService;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.filter.FilterService;
import com.seriestable.youtube.filter.data.Filter;
import com.seriestable.youtube.filter.data.SortByOption;
import com.seriestable.youtube.filter.data.VideoListType;
import com.seriestable.youtube.recommend.RecommendedService;
import com.seriestable.youtube.video.data.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/youtube/videos")
public class VideoController {

    @Autowired
    VideoService videoService;

    @Autowired
    UserService userService;

    @Autowired
    FilterService filterService;

    @Autowired
    RecommendedService recommendedService;

    private static final Logger logger = LoggerFactory.getLogger(VideoController.class);

    @PostMapping(value = "/{videoId}/finished")
    public void markAsFinished(Authentication authentication, @PathVariable(value="videoId") String videoId) throws ApiException {
        videoService.markAsFinished(videoId, userService.getUserOrThrowException(authentication));
    }

    @GetMapping(value = "/{videoId}")
    public Video getVideo(Authentication authentication, @PathVariable(value="videoId") String videoId) throws ApiException {
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }else{
            return videoService.getInitialWatchedData(videoId);
        }
        return videoService.getUserVideoData(videoId, user);
    }

    @PostMapping(value = "/{videoId}/not-started")
    public void markAsNotStarted(Authentication authentication, @PathVariable(value="videoId") String videoId) throws ApiException {
        videoService.markAsNotStarted(videoId, userService.getUserOrThrowException(authentication));
    }

    @PutMapping(value = "/{videoId}/note")
    public void updateNote(Authentication authentication, @PathVariable(value="videoId") String videoId, @RequestBody UpdateNoteRequest noteRequest) throws ApiException {
        videoService.updateNote(videoId, userService.getUserOrThrowException(authentication), noteRequest.getNote());
    }

    @PutMapping(value = "/{videoId}/time-watched")
    public void updateTimeWatched(Authentication authentication, @PathVariable(value="videoId") String videoId, @RequestBody UpdateTimeWatchedRequest timeWatchedRequest) throws ApiException {
        videoService.updateTimeWatched(videoId, userService.getUserOrThrowException(authentication), timeWatchedRequest.getTimeWatched());
    }

    @PutMapping(value = "/{videoId}/bookmarks")
    public void updateBookmarks(Authentication authentication, @PathVariable(value="videoId") String videoId, @RequestBody UpdateBookmarksRequest updateBookmarksRequest) throws ApiException {
        videoService.updateBookmarks(videoId, userService.getUserOrThrowException(authentication), updateBookmarksRequest.getBookmarks());
    }

    @GetMapping(value = "/continue-watching")
    public VideoListPageResponse getContinueWatching(Authentication authentication) throws ApiException {
        VideoListPageResponse videoListPageResponse = new VideoListPageResponse();
        videoListPageResponse.setVideos(videoService.getContinueWatching(userService.getUserOrThrowException(authentication)));
        Filter filter = filterService.findFilterOrGetDefaultOne(userService.getUserOrThrowException(authentication), VideoListType.CONTINUE_WATCHING, null);
        videoListPageResponse.setFilter(filter);
        return videoListPageResponse;
    }

    @GetMapping(value = "/new")
    VideoListPageResponse getNewest(Authentication authentication){
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }

        VideoListPageResponse videoListPageResponse = new VideoListPageResponse();
        videoListPageResponse.setVideos(recommendedService.getNewestVideos(user));
        videoListPageResponse.setFilter(filterService.findFilterOrGetDefaultOne(user, VideoListType.NEW, null));
        return videoListPageResponse;
    }

    @GetMapping(value = "/notes")
    public VideoListPageResponse getNotesVideos(Authentication authentication) throws ApiException {
        VideoListPageResponse videoListPageResponse = new VideoListPageResponse();
        videoListPageResponse.setVideos(videoService.getNotesVideos(userService.getUserOrThrowException(authentication)));
        Filter filter = filterService.findFilterOrGetDefaultOne(userService.getUserOrThrowException(authentication), VideoListType.NOTES, null);
        videoListPageResponse.setFilter(filter);
        return videoListPageResponse;
    }

}
