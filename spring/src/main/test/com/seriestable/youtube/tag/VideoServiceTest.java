package com.seriestable.youtube.tag;

import com.seriestable.rest.ApiException;
import com.seriestable.youtube.channel.ChannelRepository;
import com.seriestable.youtube.client.YoutubeChannelService;
import com.seriestable.youtube.client.YoutubePlaylistService;
import com.seriestable.youtube.client.YoutubeVideoService;
import com.seriestable.youtube.filter.FilterRepository;
import com.seriestable.youtube.filter.FilterService;
import com.seriestable.youtube.filter.TagsToFilterRepository;
import com.seriestable.youtube.video.VideoRepository;
import com.seriestable.youtube.video.VideoService;
import com.seriestable.youtube.video.VideoToTagRepository;
import com.seriestable.youtube.video.VideoToUserRepository;
import com.seriestable.youtube.video.data.VideoMapper;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class VideoServiceTest {

    @TestConfiguration
    static class VideoServiceTestContextConfiguration {
        @Bean
        public TagService tagService() {
            return new TagService();
        }
    }

    @Autowired
    private TagService tagService;

    @MockBean
    VideoRepository videoRepository;

    @MockBean
    VideoService videoService;

    @MockBean
    VideoToTagRepository taggedVideosRepository;

    @MockBean
    VideoToUserRepository videoToUserRepository;

    @MockBean
    VideoMapper videoMapper;

    @MockBean
    YoutubeVideoService youtubeVideoService;

    @MockBean
    ChannelRepository channelRepository;

    @MockBean
    TagRepository tagRepository;

    @MockBean
    YoutubeChannelService youtubeChannelService;

    @MockBean
    FilterRepository filterRepository;

    @MockBean
    TagsToFilterRepository tagsToFilterRepository;

    @MockBean
    YoutubePlaylistService youtubePlaylistService;

    @MockBean
    FilterService filterService;

    @Test
    public void shouldReturnVideoIdForUrlTest() throws ApiException {
        String videoUrl = "https://www.youtube.com/watch?v=Y-mNcEctZQY&t=25";
        String videoId = tagService.getVideoId(videoUrl);

        Assert.assertEquals("Y-mNcEctZQY", videoId);
    }

    @Test
    public void shouldReturnVideoIdForVideoUdTest() throws ApiException {
        String videoUrl = "Y-mNcEctZQY";
        String videoId = tagService.getVideoId(videoUrl);

        Assert.assertEquals("Y-mNcEctZQY", videoId);
    }
}
