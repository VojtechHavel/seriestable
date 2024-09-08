package com.seriestable.youtube.tag;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.tag.data.TagEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends CrudRepository<TagEntity, Long> {


    TagEntity findByNameAndUser(@Param("name") String name, @Param("user") UserEntity user);

    List<TagEntity> findByUser(@Param("user") UserEntity user);

}