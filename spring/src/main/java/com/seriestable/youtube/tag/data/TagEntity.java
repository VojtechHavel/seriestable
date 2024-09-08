package com.seriestable.youtube.tag.data;

import com.seriestable.user.data.UserEntity;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "tags")
public class TagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userId")
    private UserEntity user;

    private String color;

    private String icon;
}