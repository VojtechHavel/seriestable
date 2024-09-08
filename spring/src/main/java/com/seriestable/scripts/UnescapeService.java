package com.seriestable.scripts;

import com.seriestable.youtube.video.VideoRepository;
import com.seriestable.youtube.video.data.VideoEntity;
import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnescapeService {

    @Autowired
    VideoRepository videoRepository;

    public void unescapeAll(){
        Iterable<VideoEntity>  videos = videoRepository.findAll();
        for(VideoEntity videoEntity: videos){
            System.out.println("videoEntity = " + videoEntity.getId());
            videoEntity.setTitle(StringEscapeUtils.unescapeHtml4(videoEntity.getTitle()));
            videoRepository.save(videoEntity);
        }
        System.out.println("done");
    }
}
