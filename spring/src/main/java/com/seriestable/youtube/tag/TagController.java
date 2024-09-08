package com.seriestable.youtube.tag;

import com.seriestable.rest.ApiException;
import com.seriestable.user.UserService;
import com.seriestable.youtube.filter.FilterService;
import com.seriestable.youtube.filter.data.Filter;
import com.seriestable.youtube.filter.data.VideoListType;
import com.seriestable.youtube.tag.data.*;
import com.seriestable.youtube.video.data.VideoListPageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/youtube/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @Autowired
    private UserService userService;

    @PostMapping(value = "")
    public void addTag(Authentication authentication,@RequestBody AddTagRequest addTagRequest) throws ApiException {
        tagService.addTag(userService.getUserOrThrowException(authentication), addTagRequest.getName());
    }

    @DeleteMapping(value = "{tag}")
    public void removeTag(Authentication authentication, @PathVariable(value="tag") String tag) throws ApiException {
        tagService.removeTag(userService.getUserOrThrowException(authentication), tag);
    }

    @PutMapping(value = "{tag}")
    public void editTag(Authentication authentication, @PathVariable(value="tag") String tag, @RequestBody EditTagRequest editTagRequest) throws ApiException {
        tagService.renameTag(userService.getUserOrThrowException(authentication), editTagRequest.getNewTag(), tag);
    }

    @PostMapping(value = "{tag}/videos")
    public void addTagToVideo(Authentication authentication, @PathVariable(value="tag") String tag, @RequestBody AddTagToVideoRequest addTagToVideoRequest) throws ApiException {
        tagService.addTagToVideo(addTagToVideoRequest.getVideoId(), userService.getUserOrThrowException(authentication), tag);
    }

    @PostMapping(value = "{tag}/videos/multiple")
    public void addTagToVideos(Authentication authentication, @PathVariable(value="tag") String tag, @RequestBody AddTagToVideosRequest addTagToVideosRequest) throws ApiException {
        tagService.addTagToVideos(addTagToVideosRequest.getVideoIds(), userService.getUserOrThrowException(authentication), tag);
    }

    @PostMapping(value = "{tag}/playlist")
    public void addPlaylistToTag(Authentication authentication, @PathVariable(value="tag") String tag, @RequestBody AddPlaylistToTagRequest addPlaylistToTagRequest) throws ApiException {
        tagService.addPlaylistToTag(addPlaylistToTagRequest.getPlaylist(), userService.getUserOrThrowException(authentication), tag);
    }

    @DeleteMapping(value = "{tag}/videos/{videoId}")
    public void removeTagFromVideo(Authentication authentication, @PathVariable(value="tag") String tag, @PathVariable(value="videoId") String videoId) throws ApiException {
        tagService.removeTagFromVideo(videoId, userService.getUserOrThrowException(authentication), tag);
    }

    @GetMapping(value = "{tag}")
    public VideoListPageResponse getVideosByTag(Authentication authentication, @PathVariable(value="tag") String tagName) throws ApiException {
        return tagService.getTagPage(userService.getUserOrThrowException(authentication), tagName);
    }

}
