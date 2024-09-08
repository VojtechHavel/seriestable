package com.seriestable.youtube.category.data;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.channel.data.ChannelEntity;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(
        name = "channels_to_category",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"userId", "channelId", "categoryId"})
        })
public class ChannelToCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="channelId")
    private ChannelEntity channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userId")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="categoryId")
    private CategoryEntity category;
}