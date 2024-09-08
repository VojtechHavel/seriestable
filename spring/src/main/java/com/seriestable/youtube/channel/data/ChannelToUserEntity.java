package com.seriestable.youtube.channel.data;

import com.seriestable.user.data.UserEntity;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(
        name = "channels_to_user",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"userId", "channelId"})
        })
public class ChannelToUserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channelId")
    private ChannelEntity channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;

    @Column( nullable = false )
    private Boolean dontRecommend = false;
}
