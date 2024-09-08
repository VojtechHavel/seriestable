package com.seriestable.youtube.video.data;
import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "bookmarks")
@Data
public class BookmarkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    Integer timeInSeconds;
    String name;

    @ManyToOne
    private VideoToUserEntity video;

    @Override
    public String toString() {
        return "BookmarkEntity{" +
                "id=" + id +
                ", timeInSeconds=" + timeInSeconds +
                ", name='" + name + '\'' +
                ", videoId=" + video.getId() +
                '}';
    }
}