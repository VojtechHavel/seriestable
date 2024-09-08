package com.seriestable.youtube.filter;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.CategoryRepository;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.filter.data.*;
import com.seriestable.youtube.tag.TagRepository;
import com.seriestable.youtube.tag.data.TagEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class FilterService {

    @Autowired
    FilterRepository filterRepository;

    @Autowired
    TagsToFilterRepository tagsToFilterRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    FilterMapper filterMapper;

    public void setSortBy(UserEntity user, VideoListType videoListType, String id, SortByOption sortByOption) throws ApiException {
        FilterEntity filterEntity = findFilterOrCreateOne(user, videoListType, id);
        filterEntity.setSortByOption(sortByOption);
        filterRepository.save(filterEntity);
    }

    public void setVideoState(UserEntity user, VideoListType videoListType, String id, VideoState videoState, boolean show) throws ApiException {
        FilterEntity filterEntity = findFilterOrCreateOne(user, videoListType, id);
        if(VideoState.STARTED.equals(videoState)){
            filterEntity.setStarted(show);
        }else if(VideoState.NOT_STARTED.equals(videoState)){
            filterEntity.setNotStarted(show);
        }else if(VideoState.FINISHED.equals(videoState)){
            filterEntity.setFinished(show);
        }else{
            throw new ApiException(ApiException.TYPE_IGNORE, "Unsupported video state type "+videoState);
        }
        filterRepository.save(filterEntity);
    }

    public void setVideoSearchBy(UserEntity user, VideoListType videoListType, String id, VideoSearchBy videoSearchBy, boolean show) throws ApiException {
        FilterEntity filterEntity = findFilterOrCreateOne(user, videoListType, id);
        if(VideoSearchBy.TITLE.equals(videoSearchBy)){
            filterEntity.setSearchByTitle(show);
        }else if(VideoSearchBy.DESCRIPTION.equals(videoSearchBy)){
            filterEntity.setSearchByDescription(show);
        }else if(VideoSearchBy.NOTE.equals(videoSearchBy)){
            filterEntity.setSearchByNote(show);
        }else{
            throw new ApiException(ApiException.TYPE_IGNORE, "Unsupported video search by type "+videoSearchBy);
        }
        filterRepository.save(filterEntity);
    }

    public Filter findFilterOrGetDefaultOne(UserEntity user, VideoListType videoListType, String identifier){
        if(user==null || !user.isRememberFilters()){
            return filterMapper.map(getDefaultFilter(videoListType), new ArrayList<>());
        }else{
            FilterEntity filterEntity = findFilterEntity(user, videoListType, identifier);
            if (filterEntity == null) {
                return filterMapper.map(getDefaultFilter(videoListType), new ArrayList<>());
            }else{
                Collection<TagsToFilterEntity> tagsToFilterEntities = tagsToFilterRepository.findByFilterEntity(filterEntity);
                return filterMapper.map(filterEntity, tagsToFilterEntities);
            }
        }
    }

    private FilterEntity getDefaultFilter(VideoListType videoListType){
        FilterEntity filterEntity = new FilterEntity();
        if(videoListType.equals(VideoListType.TAG)){
            filterEntity.setSortByOption(SortByOption.ADDED_FIRST);
        }else if(videoListType.equals(VideoListType.CONTINUE_WATCHING)){
            filterEntity.setSortByOption(SortByOption.WATCHED_FIRST);
        }else{
            filterEntity.setSortByOption(SortByOption.NEWEST);
        }

        filterEntity.setVideoListType(videoListType);
        filterEntity.setFinished(true);
        filterEntity.setNotStarted(true);
        filterEntity.setStarted(true);
        filterEntity.setSearchByDescription(false);
        filterEntity.setSearchByNote(false);
        filterEntity.setSearchByTitle(true);
        return filterEntity;
    }

    private FilterEntity findFilterOrCreateOne(UserEntity user, VideoListType videoListType, String id) throws ApiException {
        FilterEntity filterEntity = findFilterEntity(user, videoListType, id);
        if (filterEntity == null) {
            filterEntity = getDefaultFilter(videoListType);
            if (VideoListType.TAG.equals(videoListType)) {
                TagEntity tagEntity = tagRepository.findByNameAndUser(id, user);
                if (tagEntity == null) {
                    throw new ApiException(ApiException.TYPE_IGNORE, "tag not found");
                }
                filterEntity.setTag(tagEntity);
            }else if (VideoListType.CATEGORY.equals(videoListType)) {
                CategoryEntity categoryEntity  = categoryRepository.findByNameAndUser(id, user);
                if (categoryEntity == null) {
                    throw new ApiException(ApiException.TYPE_IGNORE, "category not found");
                }
                filterEntity.setCategory(categoryEntity);
            }
            filterEntity.setUser(user);

            filterRepository.save(filterEntity);
        }

        return filterEntity;
    }

    private FilterEntity findFilterEntity(UserEntity user, VideoListType videoListType, String identifier) {
        if (VideoListType.TAG.equals(videoListType)) {
            TagEntity tagEntity = tagRepository.findByNameAndUser(identifier, user);
            return filterRepository.findFilterByTag(user, videoListType, tagEntity);
        } else if(VideoListType.CATEGORY.equals(videoListType)) {
            CategoryEntity categoryEntity = categoryRepository.findByNameAndUser(identifier, user);
            return filterRepository.findFilterByCategory(user, videoListType, categoryEntity);
        } else {
            return filterRepository.findFilter(user, videoListType);
        }
    }

    public void addTagInclusion(UserEntity user, VideoListType videoListType, String id, InclusionType inclusionType, String tag) throws ApiException {
        FilterEntity filterEntity = findFilterOrCreateOne(user, videoListType, id);

        TagsToFilterEntity tagsToFilterEntity = new TagsToFilterEntity();
        tagsToFilterEntity.setInclusionType(inclusionType);
        tagsToFilterEntity.setFilterEntity(filterEntity);

        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, user);
        if(tagEntity==null){
            throw new ApiException(ApiException.TYPE_IGNORE, "Tag not found");
        }

        tagsToFilterEntity.setTagEntity(tagEntity);

        tagsToFilterRepository.save(tagsToFilterEntity);
    }

    public void removeTagInclusion(UserEntity user, VideoListType videoListType, String id, InclusionType inclusionType, String tag) throws ApiException {
        FilterEntity filterEntity = findFilterEntity(user, videoListType, id);
        if(filterEntity==null){
            throw new ApiException(ApiException.TYPE_IGNORE, "Filter not found");
        }

        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, user);
        if(tagEntity==null){
            throw new ApiException(ApiException.TYPE_IGNORE, "Tag not found");
        }

        TagsToFilterEntity tagsToFilterEntity = tagsToFilterRepository.findByFilterEntityAndInclusionTypeAndTagEntity(filterEntity, inclusionType, tagEntity);

        if(tagsToFilterEntity==null){
            throw new ApiException(ApiException.TYPE_IGNORE, "TagsToFilter not found");
        }

        tagsToFilterRepository.delete(tagsToFilterEntity);
    }

    public void clearFilter(UserEntity user, VideoListType videoListType, String id) {
        FilterEntity filterEntity = findFilterEntity(user, videoListType, id);
        if(filterEntity!=null) {

            Collection<TagsToFilterEntity> tagsToFilter = tagsToFilterRepository.findByFilterEntity(filterEntity);
            tagsToFilterRepository.delete(tagsToFilter);

            filterRepository.delete(filterEntity);
        }
    }
}
