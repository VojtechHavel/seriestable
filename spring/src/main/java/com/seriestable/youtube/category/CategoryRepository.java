package com.seriestable.youtube.category;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.data.CategoryEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends CrudRepository<CategoryEntity, Long> {

    CategoryEntity findByNameAndUser(String name, UserEntity userEntity);

    List<CategoryEntity> findByUser(UserEntity userEntity);
}