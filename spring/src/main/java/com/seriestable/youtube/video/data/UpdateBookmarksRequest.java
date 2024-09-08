package com.seriestable.youtube.video.data;

import lombok.Data;

import java.util.List;

@Data
public class UpdateBookmarksRequest {
    List<Bookmark> bookmarks;
}
