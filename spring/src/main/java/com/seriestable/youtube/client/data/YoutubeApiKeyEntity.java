package com.seriestable.youtube.client.data;
import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "youtube_api_keys")
@Data
public class YoutubeApiKeyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long priority;

    private Instant exceededAt;

    private String name;

    @Column(unique = true)
    private String apiKey;
}