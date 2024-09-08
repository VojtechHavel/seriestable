package com.seriestable.youtube.video.data;

import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.channel.data.ChannelEntity;
import lombok.Data;

import javax.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Data
@Table(
        name = "videos_to_user",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"userId", "videoId"})
        })
public class VideoToUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "videoId")
    private VideoEntity video;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;

    private Instant lastWatchedAt;

    private Instant finishedAt;

    private Instant watchedAt;

    private Integer timeWatched;

    private Instant stopRecommending;

    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "video", orphanRemoval = true)
    private List<BookmarkEntity> bookmarks;

    private String note;
}
