package com.seriestable.youtube.filter.data;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class FilterMapper {

    private static final Logger logger = LoggerFactory.getLogger(FilterMapper.class);

    public Filter map(FilterEntity filterEntity, Collection<TagsToFilterEntity> tagsToFilter) {
        Filter filter = new Filter();
        filter.setSortBy(filterEntity.getSortByOption());
        filter.setFinished(filterEntity.isFinished());
        filter.setStarted(filterEntity.isStarted());
        filter.setNotStarted(filterEntity.isNotStarted());
        filter.setSearchByDescription(filterEntity.isSearchByDescription());
        filter.setSearchByNote(filterEntity.isSearchByNote());
        filter.setSearchByTitle(filterEntity.isSearchByTitle());

        for(TagsToFilterEntity tagToFilter: tagsToFilter){
            if(tagToFilter.getInclusionType().equals(InclusionType.INCLUDE)){
                filter.getIncludeTags().add(tagToFilter.getTagEntity().getName());
            }else{
                filter.getExcludeTags().add(tagToFilter.getTagEntity().getName());
            }
        }
        return filter;
    }
}