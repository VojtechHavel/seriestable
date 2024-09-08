package com.seriestable.youtube.video.data;

import com.seriestable.youtube.channel.data.ChannelEntity;
import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Data
@Table(name = "videos")
public class VideoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true)
    private String youtubeId;

    private String thumbnailUrl;

    private String title;

    @Column(length = 5100)
    private String description;

    private Instant publishedAt;

    private Long duration;

    private Long viewCount;
    private Long likeCount;
    private Long dislikeCount;
    private Long commentCount;

    private Instant updatedAt;

    @Column(columnDefinition = "BOOLEAN default false", nullable = false)
    private Boolean unavailable = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="channelId")
    private ChannelEntity channel;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
