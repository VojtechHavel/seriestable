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
import java.util.List;


@Service
public class GetVideoStatisticsService {

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    YoutubeVideoService youtubeVideoService;

    private static final Logger logger = LoggerFactory.getLogger(GetVideoStatisticsService.class);

    public void saveStatistics() {

        Long videosWithoutDuration = videoRepository.countVideosWithoutStatistics();

        logger.debug("Number of videos without duration " + videosWithoutDuration);

        int pageSize = 40;

        Pageable pageable = new PageRequest(0, pageSize);


        for(int i=0;i<10000;i++) {
            List<VideoEntity> videos = videoRepository.getVideosWithoutStatistics(pageable);
            logger.debug("going through page  " + i + " with page size " + pageSize);

            if(videos.isEmpty()){
                break;
            }
            try {
                youtubeVideoService.addStatistics(videos);
            } catch (IOException e) {
                logger.error("error", e);
            } catch (ApiException e) {
                logger.error("error", e);
            }
            videoRepository.save(videos);
        }

        logger.debug("saveStatistics finished");
    }

}
