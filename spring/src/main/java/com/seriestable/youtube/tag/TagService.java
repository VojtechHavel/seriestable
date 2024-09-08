package com.seriestable.youtube.tag;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.UserEntity;
import com.seriestable.utility.UrlValidator;
import com.seriestable.youtube.channel.ChannelRepository;
import com.seriestable.youtube.client.YoutubePlaylistService;
import com.seriestable.youtube.client.YoutubeVideoService;
import com.seriestable.youtube.filter.FilterRepository;
import com.seriestable.youtube.filter.FilterService;
import com.seriestable.youtube.filter.TagsToFilterRepository;
import com.seriestable.youtube.filter.data.Filter;
import com.seriestable.youtube.filter.data.FilterEntity;
import com.seriestable.youtube.filter.data.TagsToFilterEntity;
import com.seriestable.youtube.filter.data.VideoListType;
import com.seriestable.youtube.tag.data.Tag;
import com.seriestable.youtube.tag.data.TagEntity;
import com.seriestable.youtube.video.VideoRepository;
import com.seriestable.youtube.video.VideoService;
import com.seriestable.youtube.video.VideoToTagRepository;
import com.seriestable.youtube.video.VideoToUserRepository;
import com.seriestable.youtube.video.data.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TagService {

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    VideoToTagRepository taggedVideosRepository;

    @Autowired
    FilterRepository filterRepository;

    @Autowired
    TagsToFilterRepository tagsToFilterRepository;

    @Autowired
    VideoToUserRepository videoToUserRepository;

    @Autowired
    VideoMapper videoMapper;

    @Autowired
    YoutubeVideoService youtubeVideoService;

    @Autowired
    YoutubePlaylistService youtubePlaylistService;

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    VideoService videoService;

    @Autowired
    FilterService filterService;

    private static final Logger logger = LoggerFactory.getLogger(TagService.class);

    private List<Video> getTaggedVideos(UserEntity userEntity, TagEntity tagEntity) {
        if (userEntity == null) {
            return null;
        }

        List<VideoToTagEntity> tagVideosForSpecifiedTag = taggedVideosRepository.findByUserAndTag(userEntity, tagEntity);

        Set<VideoToUserEntity> usersVideos = videoToUserRepository.findByUserAndVideoIn(userEntity, tagVideosForSpecifiedTag.stream().map(VideoToTagEntity::getVideo).collect(Collectors.toList()));

        List<VideoToTagEntity> allTagsForVideos = taggedVideosRepository.findTaggedVideosByUserAndVideoIn(userEntity, tagVideosForSpecifiedTag.stream().map(VideoToTagEntity::getVideo).collect(Collectors.toList()));

        List<Video> videos = videoMapper.map(tagVideosForSpecifiedTag.stream().map(VideoToTagEntity::getVideo).collect(Collectors.toList()), usersVideos, allTagsForVideos);

        List<Video> videoToTags = new ArrayList<>();

        for (Video video : videos) {
            Optional<VideoToTagEntity> optionalVideo = tagVideosForSpecifiedTag.stream().filter(taggedVideo -> taggedVideo.getVideo().getYoutubeId().equals(video.getYoutubeId())).findFirst();
            if (optionalVideo.isPresent()) {
                VideoToTagEntity videoToTagEntity = optionalVideo.get();
                video.setAdded(videoToTagEntity.getAdded().toEpochMilli());
                videoToTags.add(video);
            }
        }


        return videoToTags;
    }

    public Collection<Tag> getTags(UserEntity userEntity) {
        Collection<TagEntity> tagEntities = tagRepository.findByUser(userEntity);
        return videoMapper.mapTagEntities(tagEntities);
    }

    public void addTagToVideo(String videoIdOrUrl, UserEntity userEntity, String tag) throws ApiException {

        String videoId = getVideoId(videoIdOrUrl);

        VideoEntity videoEntity = videoRepository.findByYoutubeId(videoId);

        if (videoEntity == null) {
            videoEntity = videoService.getNewVideo(videoId);
        }

        boolean tagAdded = saveTaggedVideo(videoEntity, tag, userEntity);

        if (!tagAdded) {
            throw new ApiException(ApiException.TYPE_INFO, "Video is already tagged");
        }
    }

    public void addTagToVideos(List<String> videoIds, UserEntity userEntity, String tag) throws ApiException {

        for(String videoId: videoIds) {
            VideoEntity videoEntity = videoRepository.findByYoutubeId(videoId);
            if (videoEntity != null) {
                saveTaggedVideo(videoEntity, tag, userEntity);
            }
        }
    }

    public void addPlaylistToTag(String playlist, UserEntity userEntity, String tag) throws ApiException {
        List<VideoEntity> videos = null;

        if(playlist.contains("list=")){
            String playlistId = getPlaylist(playlist);
            try {
                videos = getVideosFromPlaylist(playlistId);
            } catch (IOException e) {
                throw new ApiException(ApiException.TYPE_GLOBAL, "Playlist not found");
            }
        }else{
            throw new ApiException(ApiException.TYPE_GLOBAL, "Playlist not found");
        }



        for (VideoEntity videoEntity : videos) {
            saveTaggedVideo(videoEntity, tag, userEntity);
        }
    }


    public void addTag(UserEntity userEntity, String tag) throws ApiException {

        if (StringUtils.isBlank(tag)) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Tag name cannot be empty.");
        }
        UrlValidator.validate(tag);

        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, userEntity);

        if (tagEntity != null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Tag already exists");
        }

        tagEntity = new TagEntity();
        tagEntity.setName(tag);
        tagEntity.setUser(userEntity);

        tagRepository.save(tagEntity);
    }

    public void removeTag(UserEntity userEntity, String tag) throws ApiException {

        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, userEntity);

        List<VideoToTagEntity> taggedVideoEntities = taggedVideosRepository.findByUserAndTag(userEntity, tagEntity);

        taggedVideosRepository.delete(taggedVideoEntities);

        Collection<TagsToFilterEntity> tagsToFilterEntities = tagsToFilterRepository.findByTagEntity(tagEntity);

        tagsToFilterRepository.delete(tagsToFilterEntities);

        FilterEntity filterEntity = filterRepository.findFilterByTag(userEntity, VideoListType.TAG, tagEntity);

        if(filterEntity!=null) {
            filterRepository.delete(filterEntity);
        }

        tagRepository.delete(tagEntity);
    }

    public void renameTag(UserEntity userEntity, Tag newTag, String tag) throws ApiException {

        if (!tag.equals(newTag.getName())) {
            TagEntity duplicateTagEntity = tagRepository.findByNameAndUser(newTag.getName(), userEntity);

            // either not found or is the same one (eg when changing case)
            if (duplicateTagEntity != null && !duplicateTagEntity.getName().equals(tag)) {
                throw new ApiException(ApiException.TYPE_GLOBAL, "Tag already exists");
            }
        }

        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, userEntity);
        tagEntity.setName(newTag.getName());
        tagEntity.setColor(newTag.getColor());
        tagEntity.setIcon(newTag.getIcon());

        tagRepository.save(tagEntity);
    }

    private boolean saveTaggedVideo(VideoEntity videoEntity, String tag, UserEntity userEntity) {
        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, userEntity);

        if (taggedVideosRepository.findByUserAndVideoAndTag(userEntity, videoEntity, tagEntity) != null) {
            return false;
        }

        VideoToTagEntity entity = new VideoToTagEntity();
        entity.setUser(userEntity);
        entity.setVideo(videoEntity);
        entity.setTag(tagEntity);
        entity.setAdded(Instant.now());

        taggedVideosRepository.save(entity);
        return true;
    }

    private List<VideoEntity> getVideosFromPlaylist(String playlistId) throws IOException, ApiException {
        Set<String> foundVideos = youtubePlaylistService.getVideoIdsFromPlaylist(playlistId);

        logger.debug("found videos in playlist " + foundVideos);

        List<VideoEntity> savedEntities = videoService.getVideosFromIds(foundVideos);

        return savedEntities;
    }

    protected String getPlaylist(String playlistIdOrUrl) {
        URL url;
        try {
            url = new URL(playlistIdOrUrl);
        } catch (MalformedURLException e) {
            return playlistIdOrUrl;
        }

        return Arrays.stream(url.getQuery().split("&")).filter(query -> query.split("=")[0].equals("list")).map(result -> result.split("=")[1]).collect(Collectors.toList()).get(0);
    }

    public void removeTagFromVideo(String videoId, UserEntity userEntity, String tag) {
        VideoEntity videoEntity = videoRepository.findByYoutubeId(videoId);
        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, userEntity);
        VideoToTagEntity videoToTagEntity = taggedVideosRepository.findByUserAndVideoAndTag(userEntity, videoEntity, tagEntity);
        taggedVideosRepository.delete(videoToTagEntity);
    }

    protected String getVideoId(String videoIdOrUrl) throws ApiException {
        final String YOUTUBE_PREFIX = "https://youtu.be/";

        URL url;
        try {
            url = new URL(videoIdOrUrl);
        } catch (MalformedURLException e) {
            return videoIdOrUrl;
        }

        if (videoIdOrUrl.startsWith(YOUTUBE_PREFIX)) {
            return videoIdOrUrl.replace(YOUTUBE_PREFIX, "");
        }

        if(videoIdOrUrl.contains("v=")){
            return Arrays.stream(url.getQuery().split("&")).filter(query -> query.split("=")[0].equals("v")).map(result -> result.split("=")[1]).collect(Collectors.toList()).get(0);
        }else if(videoIdOrUrl.contains("localhost") || videoIdOrUrl.contains("videomark.app") || videoIdOrUrl.contains("seriestable.com")){
            return videoIdOrUrl.substring(videoIdOrUrl.lastIndexOf("/")+1);
        }else{
            logger.error("Unrecognized url "+videoIdOrUrl);
            throw new ApiException("global", "We could not find the video");
        }

    }

    public Tag getTag(UserEntity user, String tag) {
        TagEntity tagEntity = tagRepository.findByNameAndUser(tag, user);
        return videoMapper.mapTagEntity(tagEntity);
    }

    public VideoListPageResponse getTagPage(UserEntity user, String tagName) {
        VideoListPageResponse videoListPageResponse = new VideoListPageResponse();

        TagEntity tagEntity = tagRepository.findByNameAndUser(tagName, user);

        //Page info
        Tag tag = getTag(user, tagName);
        videoListPageResponse.setInformation(videoMapper.mapTagEntity(tagEntity));

        //Page filter
        Filter filter = filterService.findFilterOrGetDefaultOne(user, VideoListType.TAG, tagName);
        videoListPageResponse.setFilter(filter);

        //Page videos
        List<Video> videos = getTaggedVideos(user, tagEntity);
        videoListPageResponse.setVideos(videos);

        return videoListPageResponse;
    }
}
