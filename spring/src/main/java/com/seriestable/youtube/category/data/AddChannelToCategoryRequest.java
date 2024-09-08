package com.seriestable.youtube.category.data;

import lombok.Data;

@Data
public class AddChannelToCategoryRequest {

    // either channelId or channelUrl should be filled
    // with channelId we expect that the channel is already created in evidence and we just put it in category
    // with channel url we have to first decide what the input is, then find channel id

    //channel's youtubeId
    String channelId;

    String channelUrl;
}
