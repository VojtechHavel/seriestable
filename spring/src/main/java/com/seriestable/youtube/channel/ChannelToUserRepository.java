package com.seriestable.youtube.channel;


import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.channel.data.ChannelToUserEntity;
import com.seriestable.youtube.video.data.VideoToUserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ChannelToUserRepository extends CrudRepository<ChannelToUserEntity, Long> {

    @Query("select channelToUser.channel from ChannelToUserEntity channelToUser where channelToUser.user = :user AND channelToUser.dontRecommend = true ")
    Set<ChannelEntity> findDontRecommendChannels(@Param("user") UserEntity userEntity);

    ChannelToUserEntity findByChannelAndUser(ChannelEntity channelEntity, UserEntity userEntity);
}
