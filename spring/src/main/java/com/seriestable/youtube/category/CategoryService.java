package com.seriestable.youtube.category;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.UserEntity;
import com.seriestable.utility.UrlValidator;
import com.seriestable.youtube.category.data.AddChannelToCategoryRequest;
import com.seriestable.youtube.category.data.Category;
import com.seriestable.youtube.category.data.CategoryEntity;
import com.seriestable.youtube.category.data.ChannelToCategoryEntity;
import com.seriestable.youtube.channel.ChannelRepository;
import com.seriestable.youtube.channel.ChannelToUserRepository;
import com.seriestable.youtube.channel.data.Channel;
import com.seriestable.youtube.channel.data.ChannelEntity;
import com.seriestable.youtube.channel.data.ChannelMapper;
import com.seriestable.youtube.client.YoutubeChannelService;
import com.seriestable.youtube.client.YoutubeVideoService;
import com.seriestable.youtube.filter.FilterRepository;
import com.seriestable.youtube.filter.FilterService;
import com.seriestable.youtube.filter.TagsToFilterRepository;
import com.seriestable.youtube.filter.data.Filter;
import com.seriestable.youtube.filter.data.FilterEntity;
import com.seriestable.youtube.filter.data.TagsToFilterEntity;
import com.seriestable.youtube.filter.data.VideoListType;
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

import java.util.*;

@Service
public class CategoryService {
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);


    @Autowired
    ChannelMapper channelMapper;

    @Autowired
    YoutubeChannelService youtubeChannelService;

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ChannelToCategoryRepository channelToCategoryRepository;

    @Autowired
    FilterRepository filterRepository;

    @Autowired
    TagsToFilterRepository tagsToFilterRepository;

    @Autowired
    VideoMapper videoMapper;

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    VideoToUserRepository videoToUserRepository;

    @Autowired
    VideoToTagRepository taggedVideosRepository;

    @Autowired
    VideoService videoService;

    @Autowired
    FilterService filterService;

    public List<Category> getCategories(UserEntity userEntity) {
        if(userEntity==null){
            return new ArrayList<>();
        }

        List<ChannelToCategoryEntity> channelToCategoryEntities = channelToCategoryRepository.findByUser(userEntity);
        Map<String, Category> categories = channelMapper.map(channelToCategoryEntities);
        List<CategoryEntity> emptyCategories = categoryRepository.findByUser(userEntity);
        for (CategoryEntity categoryEntity : emptyCategories) {
            if (!categories.containsKey(categoryEntity.getName())) {
                Category category = new Category();
                category.setName(categoryEntity.getName());
                category.setKey(categoryEntity.getName() + "Key");
                categories.put(categoryEntity.getName(), category);
            }
        }
        return new ArrayList<>(categories.values());
    }

    public void addCategory(String categoryName, UserEntity userEntity) throws ApiException {
        if (StringUtils.isBlank(categoryName)) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Category name cannot be empty.");
        }
        UrlValidator.validate(categoryName);

        CategoryEntity categoryEntity = categoryRepository.findByNameAndUser(categoryName, userEntity);
        if (categoryEntity != null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Category with that name already exists");
        }

        categoryEntity = new CategoryEntity();
        categoryEntity.setName(categoryName);
        categoryEntity.setUser(userEntity);
        categoryRepository.save(categoryEntity);
    }

    public Channel addChannelToCategory(String categoryName, AddChannelToCategoryRequest request, UserEntity userEntity) throws ApiException {
        ChannelEntity channelEntity;
        if (request.getChannelId() == null) {
            channelEntity = findChannelOrCreateIt(request.getChannelUrl(), userEntity);
        } else {
            channelEntity = channelRepository.findChannelEntityByYoutubeId(request.getChannelId());
        }

        CategoryEntity categoryEntity = categoryRepository.findByNameAndUser(categoryName, userEntity);
        if (categoryEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Channel not found");
        }

        ChannelToCategoryEntity channelToCategoryEntity = channelToCategoryRepository.findByChannelAndUserAndCategory(channelEntity, userEntity, categoryEntity);
        if (channelToCategoryEntity != null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Channel " + channelEntity.getTitle() + " is already in category " + categoryName);
        }

        channelToCategoryEntity = new ChannelToCategoryEntity();
        channelToCategoryEntity.setCategory(categoryEntity);
        channelToCategoryEntity.setChannel(channelEntity);
        channelToCategoryEntity.setUser(userEntity);
        channelToCategoryRepository.save(channelToCategoryEntity);

        return channelMapper.map(channelEntity);
    }

    public void removeChannelFromCategory(String category, String channel, UserEntity userEntity) {
        ChannelEntity channelEntity = channelRepository.findChannelEntityByYoutubeId(channel);
        CategoryEntity categoryEntity = categoryRepository.findByNameAndUser(category, userEntity);
        ChannelToCategoryEntity channelToCategoryEntity = channelToCategoryRepository.findByChannelAndUserAndCategory(channelEntity, userEntity, categoryEntity);
        channelToCategoryRepository.delete(channelToCategoryEntity);
    }

    public void removeCategory(String categoryName, UserEntity userEntity) {
        CategoryEntity categoryEntity = categoryRepository.findByNameAndUser(categoryName, userEntity);

        List<ChannelToCategoryEntity> channelToCategoryEntities = channelToCategoryRepository.findByCategory(categoryEntity);
        channelToCategoryRepository.delete(channelToCategoryEntities);

        FilterEntity filterEntity = filterRepository.findFilterByCategory(userEntity, VideoListType.CATEGORY, categoryEntity);

        Collection<TagsToFilterEntity> tagsToFilterEntities = tagsToFilterRepository.findByFilterEntity(filterEntity);

        tagsToFilterRepository.delete(tagsToFilterEntities);

        if(filterEntity!=null) {
            filterRepository.delete(filterEntity);
        }

        categoryRepository.delete(categoryEntity);
    }

    public void renameCategory(String categoryName, String newName, UserEntity userEntity) throws ApiException {
        if (StringUtils.isEmpty(newName)) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Category name cannot be empty");
        }

        CategoryEntity categoryEntityWithNewName = categoryRepository.findByNameAndUser(newName, userEntity);
        if (categoryEntityWithNewName != null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Category with that name already exists");
        }

        CategoryEntity categoryEntity = categoryRepository.findByNameAndUser(categoryName, userEntity);
        if (categoryEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Category not found");
        }

        categoryEntity.setName(newName);
        categoryRepository.save(categoryEntity);

    }

    // PRIVATE

    private ChannelEntity findChannelOrCreateIt(String channel, UserEntity userEntity) throws ApiException {
        if (channel.startsWith("https://www.youtube.com/channel/")) {
            channel = channel.replace("https://www.youtube.com/channel/", "");
        } else if (channel.startsWith("https://www.youtube.com/c/")) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "This format is not supported. Please go to the channel and copy it's channel id.");
        } else if (channel.startsWith("UC") & channel.replaceAll(" ", "").length() == 24) {
            channel = channel.replaceAll(" ", "");
        }else if(channel.contains("localhost") || channel.contains("videomark.app") || channel.contains("seriestable.com")){
            channel =  channel.substring(channel.lastIndexOf("/")+1);
        } else {
            channel = getChannelByUsername(channel);
        }

        if (channel.contains("/")) {
            channel = channel.substring(0, channel.indexOf("/"));
        }


        ChannelEntity channelEntity = channelRepository.findChannelEntityByYoutubeId(channel);

        if (channelEntity == null) {
            channelEntity = youtubeChannelService.getChannelInformation(channel);
            channelRepository.save(channelEntity);
        }

        return channelEntity;
    }


    private String getChannelByUsername(String userName) throws ApiException {
        if (userName.startsWith("https://www.youtube.com/user/")) {
            userName = userName.replace("https://www.youtube.com/user/", "");
        }

        if (userName.contains("/")) {
            userName = userName.substring(0, userName.indexOf("/"));
        }

        String channel = youtubeChannelService.getChannelIdByUsername(userName);
        if (channel == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Channel not found");
        }
        return channel;
    }

    public VideoListPageResponse getCategory(String categoryName, UserEntity userEntity) throws ApiException {
        CategoryEntity categoryEntity = categoryRepository.findByNameAndUser(categoryName, userEntity);
        if (categoryEntity == null) {
            throw new ApiException(ApiException.TYPE_GLOBAL, "Category with that name doesn't exists");
        }

        List<Video> result = new ArrayList<>();

        List<ChannelToCategoryEntity> channelToCategoryEntities = channelToCategoryRepository.findByCategory(categoryEntity);
        for (ChannelToCategoryEntity channelToCategoryEntity : channelToCategoryEntities) {
            List<VideoEntity> videoEntities = videoRepository.findVideosByChannelId(channelToCategoryEntity.getChannel().getId());
            Set<VideoToUserEntity> videosToUser = new HashSet<>();
            if (userEntity != null) {
                videosToUser = videoToUserRepository.findWatchedVideos(channelToCategoryEntity.getChannel(), userEntity);
            }

            List<VideoToTagEntity> taggedVideoEntities = new ArrayList<>();
            if (userEntity != null) {
                taggedVideoEntities = taggedVideosRepository.findTaggedVideosByUserAndVideoIn(userEntity, videoEntities);
            }
            result.addAll(videoMapper.map(videoEntities, videosToUser, taggedVideoEntities));
        }
        VideoListPageResponse videoListPageResponse = new VideoListPageResponse();
        videoListPageResponse.setVideos(result);

        Filter filter = filterService.findFilterOrGetDefaultOne(userEntity, VideoListType.CATEGORY, categoryName);
        videoListPageResponse.setFilter(filter);

        return videoListPageResponse;
    }
}
