package com.seriestable.youtube.filter.data;


import com.seriestable.youtube.tag.data.TagEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * Filter videos by tag they have or don't have
 */
@Entity
@Data
@Table(
        name = "tags_to_filter",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"filterId", "tagId", "inclusionType"})
        })
public class TagsToFilterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    private InclusionType inclusionType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tagId")
    private TagEntity tagEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filterId")
    private FilterEntity filterEntity;
}
