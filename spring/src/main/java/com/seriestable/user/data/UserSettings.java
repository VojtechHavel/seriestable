package com.seriestable.user.data;

import com.seriestable.youtube.tag.data.Tag;
import lombok.Data;

import java.util.Collection;

@Data
public class UserSettings {
    User user;
    Collection<Tag> tags;
}
