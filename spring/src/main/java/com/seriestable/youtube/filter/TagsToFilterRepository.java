package com.seriestable.youtube.filter;

import com.seriestable.youtube.filter.data.InclusionType;
import com.seriestable.youtube.filter.data.FilterEntity;
import com.seriestable.youtube.filter.data.TagsToFilterEntity;
import com.seriestable.youtube.tag.data.TagEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface TagsToFilterRepository extends CrudRepository<TagsToFilterEntity, Long> {

    TagsToFilterEntity findByFilterEntityAndInclusionTypeAndTagEntity(@Param("filterEntity") FilterEntity filterEntity,
                                                                        @Param("inclusionType") InclusionType inclusionType,
                                                                        @Param("tagEntity") TagEntity tagEntity);

    Collection<TagsToFilterEntity> findByFilterEntity(@Param("filterEntity") FilterEntity filterEntity);

    Collection<TagsToFilterEntity> findByTagEntity(@Param("tagEntity") TagEntity tagEntity);
}