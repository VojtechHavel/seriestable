package com.seriestable.youtube.filter;

import com.seriestable.rest.ApiException;
import com.seriestable.user.UserService;
import com.seriestable.youtube.filter.data.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/youtube/filters")
public class FilterController {

    @Autowired
    UserService userService;

    @Autowired
    FilterService filterService;

    private static final Logger logger = LoggerFactory.getLogger(FilterController.class);

    @PutMapping(value = "/{videoListType}/{id}/sort-by/{sortByOption}")
    public void setSortBy(
            Authentication authentication,
            @PathVariable(value="videoListType") VideoListType videoListType,
            @PathVariable(value="id") String id,
            @PathVariable(value="sortByOption") SortByOption sortByOption
    ) throws ApiException {
        filterService.setSortBy(userService.getUserOrThrowException(authentication), videoListType, id, sortByOption);
    }

    @PutMapping(value = "/{videoListType}/{id}/state/{videoState}/{show}")
    public void setVideoState(
            Authentication authentication,
            @PathVariable(value="videoListType") VideoListType videoListType,
            @PathVariable(value="id") String id,
            @PathVariable(value="show") boolean show,
            @PathVariable(value="videoState") VideoState videoState
    ) throws ApiException {
        filterService.setVideoState(userService.getUserOrThrowException(authentication), videoListType, id, videoState, show);
    }

    @PutMapping(value = "/{videoListType}/{id}/search-by/{videoSearchBy}/{show}")
    public void setVideoSearchBy(
            Authentication authentication,
            @PathVariable(value="videoListType") VideoListType videoListType,
            @PathVariable(value="id") String id,
            @PathVariable(value="show") boolean show,
            @PathVariable(value="videoSearchBy") VideoSearchBy videoSearchBy
    ) throws ApiException {
        filterService.setVideoSearchBy(userService.getUserOrThrowException(authentication), videoListType, id, videoSearchBy, show);
    }

    @PostMapping(value = "/{videoListType}/{id}/tags/{inclusionType}/{tag}")
    public void addTagInclusion(
            Authentication authentication,
            @PathVariable(value="videoListType") VideoListType videoListType,
            @PathVariable(value="id") String id,
            @PathVariable(value="tag") String tag,
            @PathVariable(value="inclusionType") InclusionType inclusionType
    ) throws ApiException {
        filterService.addTagInclusion(userService.getUserOrThrowException(authentication), videoListType, id, inclusionType, tag);
    }

    @DeleteMapping(value = "/{videoListType}/{id}/tags/{inclusionType}/{tag}")
    public void removeTagInclusion(
            Authentication authentication,
            @PathVariable(value="videoListType") VideoListType videoListType,
            @PathVariable(value="id") String id,
            @PathVariable(value="tag") String tag,
            @PathVariable(value="inclusionType") InclusionType inclusionType
    ) throws ApiException {
        filterService.removeTagInclusion(userService.getUserOrThrowException(authentication), videoListType, id, inclusionType, tag);
    }

    @DeleteMapping(value = "/{videoListType}/{id}")
    public void clearFilter(
            Authentication authentication,
            @PathVariable(value="videoListType") VideoListType videoListType,
            @PathVariable(value="id") String id
    ) throws ApiException {
        filterService.clearFilter(userService.getUserOrThrowException(authentication), videoListType, id);
    }

}
