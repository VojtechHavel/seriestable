package com.seriestable.youtube.category;


import com.seriestable.rest.ApiException;
import com.seriestable.user.UserService;
import com.seriestable.user.data.UserEntity;
import com.seriestable.youtube.channel.ChannelService;
import com.seriestable.youtube.category.data.CategoriesPageResponse;
import com.seriestable.youtube.category.data.AddCategoryRequest;
import com.seriestable.youtube.category.data.AddChannelToCategoryRequest;
import com.seriestable.youtube.category.data.RenameCategoryRequest;
import com.seriestable.youtube.channel.data.Channel;
import com.seriestable.youtube.recommend.RecommendedService;
import com.seriestable.youtube.video.data.VideoListPageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/youtube/categories")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    ChannelService channelService;

    @Autowired
    RecommendedService recommendedService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    UserService userService;

    @GetMapping(value = "")
    public CategoriesPageResponse getCategoriesPage(Authentication authentication) throws ApiException {
        UserEntity userEntity = null;
        if(authentication!=null){
            userEntity = ((UserEntity) authentication.getPrincipal());
        }
        CategoriesPageResponse categoriesPageResponse = new CategoriesPageResponse();
        categoriesPageResponse.setRecommendedChannels(recommendedService.getRecommendedChannels(userEntity));
        categoriesPageResponse.setCategories(categoryService.getCategories(userEntity));

        return categoriesPageResponse;
    }

    @GetMapping(value = "{categoryName}")
    public VideoListPageResponse getCategory(@PathVariable(value="categoryName") String categoryName, Authentication authentication) throws ApiException {
        if(authentication!=null) {
            return categoryService.getCategory(categoryName, (UserEntity) authentication.getPrincipal());
        }else{
            return null;
        }
    }

    @PostMapping(value = "{categoryName}")
    public Channel addChannelToCategory(@PathVariable(value="categoryName") String categoryName, @RequestBody AddChannelToCategoryRequest request, Authentication authentication) throws ApiException {
        logger.debug("request {}", request);
        return categoryService.addChannelToCategory(
                categoryName,
                request,
                userService.getUserOrThrowException(authentication)
        );
    }

    @PostMapping(value = "")
    public void addCategory(@RequestBody AddCategoryRequest request, Authentication authentication) throws ApiException {
        logger.debug("request {}", request);
        categoryService.addCategory(
                request.getCategoryName(),
                userService.getUserOrThrowException(authentication)
        );
    }

    @DeleteMapping(value = "{categoryName}")
    public void removeCategory(@PathVariable(value="categoryName") String categoryName, Authentication authentication) throws ApiException {
        categoryService.removeCategory(
                categoryName,
                userService.getUserOrThrowException(authentication)
        );
    }

    @PutMapping(value = "{categoryName}")
    public void renameCategory(@RequestBody RenameCategoryRequest request, @PathVariable(value="categoryName") String categoryName, Authentication authentication) throws ApiException {
        categoryService.renameCategory(
                categoryName,
                request.getNewName(),
                userService.getUserOrThrowException(authentication)
        );
    }

    @DeleteMapping(value = "{categoryName}/{channelId}")
    public void removeChannelFromCategory(@PathVariable(value="categoryName") String categoryName, @PathVariable(value="channelId") String channelId, Authentication authentication) throws ApiException {
        categoryService.removeChannelFromCategory(
                categoryName,
                channelId,
                userService.getUserOrThrowException(authentication)
        );
    }
}
