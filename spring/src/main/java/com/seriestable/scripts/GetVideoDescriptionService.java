package com.seriestable.scripts;

import com.seriestable.rest.ApiException;
import com.seriestable.youtube.client.YoutubeVideoService;
import com.seriestable.youtube.video.VideoRepository;
import com.seriestable.youtube.video.data.VideoEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Service
public class GetVideoDescriptionService {

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    YoutubeVideoService youtubeVideoService;

    private static final Logger logger = LoggerFactory.getLogger(GetVideoDescriptionService.class);

    public void saveDescriptions() throws IOException, ApiException {

        Long videosWithoutDescription = videoRepository.countVideosWithoutDescription();

        logger.debug("Number of videos without description " + videosWithoutDescription);

        int pageSize = 40;
        int pageLimit = 3000;

        Pageable pageable = new PageRequest(0, pageSize);


        for (int i = 0; i < pageLimit; i++) {
            List<VideoEntity> videos = videoRepository.getVideosWithoutDescription(pageable);
            logger.debug("going through page  " + i + " with page size " + pageSize);

            if (videos.isEmpty()) {
                break;
            }
            youtubeVideoService.addDescriptions(videos);
            videoRepository.save(videos);
        }

        logger.debug("saveDescription finished");
    }

}
