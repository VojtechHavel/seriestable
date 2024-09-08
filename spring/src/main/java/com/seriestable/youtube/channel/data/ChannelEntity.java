package com.seriestable.youtube.channel.data;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Data
@Table(name = "channels")
public class ChannelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique=true)
    private String youtubeId;

    private String title;

    private String image;

    private Instant updateStart;

    private Instant updateFinish;

    @Column(nullable = true)
    private Integer totalVideos;
}
