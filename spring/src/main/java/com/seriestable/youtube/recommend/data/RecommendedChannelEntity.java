package com.seriestable.youtube.recommend.data;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.channel.data.ChannelEntity;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "recommended_channels")
public class RecommendedChannelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="channelId")
    private ChannelEntity channel;
}
