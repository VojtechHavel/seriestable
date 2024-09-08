package com.seriestable.youtube.filter.data;


import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.tag.data.TagEntity;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(
        name = "filters")
public class FilterEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;

        @Enumerated(EnumType.STRING)
        VideoListType videoListType;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "userId")
        private UserEntity user;

        /**
         * Filter for a specific tag
         */
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "tagId")
        private TagEntity tag;

        /**
         * Filter for a specific category
         */
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "categoryId")
        private CategoryEntity category;

        @Enumerated(EnumType.STRING)
        private SortByOption sortByOption;

        private boolean finished;
        private boolean notStarted;
        private boolean started;

        private boolean searchByTitle;
        private boolean searchByNote;
        private boolean searchByDescription;
}
