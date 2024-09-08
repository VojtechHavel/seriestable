package com.seriestable.youtube.category;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.category.data.ChannelToCategoryEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelToCategoryRepository extends CrudRepository<ChannelToCategoryEntity, Long> {

    List<ChannelToCategoryEntity> findByUser(UserEntity user);

    List<ChannelToCategoryEntity> findByUserAndChannel(UserEntity user, ChannelEntity channel);

    ChannelToCategoryEntity findByChannelAndUserAndCategory(ChannelEntity channelEntity, UserEntity user, CategoryEntity category);

    List<ChannelToCategoryEntity> findByCategory(CategoryEntity category);

    List<ChannelToCategoryEntity> findByCategoryIn(List<CategoryEntity> categories);
}
