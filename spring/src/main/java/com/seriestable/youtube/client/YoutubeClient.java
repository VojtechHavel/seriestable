package com.seriestable.youtube.client;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.YouTubeRequest;
import com.seriestable.rest.ApiException;
import com.seriestable.youtube.client.data.YoutubeApiKeyEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAmount;
import java.util.List;

@Service
public class YoutubeClient {

    private static YouTube youtube;

    private static final Logger logger = LoggerFactory.getLogger(YoutubeClient.class);

    private String youtubeClientKey;

    @Autowired
    ApiKeyRepository apiKeyRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;

    /**
     * Define a global instance of the HTTP transport.
     */
    public static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();

    /**
     * Define a global instance of the JSON factory.
     */
    public static final JsonFactory JSON_FACTORY = new JacksonFactory();

    public YouTube getClient(){
        YouTube youtube = new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, new HttpRequestInitializer() {
            @Override
            public void initialize(HttpRequest request) throws IOException {
            }
        }).setApplicationName("youtube-seriestable").build();
        return youtube;
    }

    public <T> T call(YouTubeRequest<T> request) throws IOException, ApiException {
        try {
            request.setKey(getKey());
            return request.execute();
        } catch (GoogleJsonResponseException e) {
            if (!e.getDetails().getErrors().isEmpty() && (e.getDetails().getErrors().get(0).getReason().equals("dailyLimitExceeded") || e.getDetails().getErrors().get(0).getReason().equals("quotaExceeded")) || e.getDetails().getErrors().get(0).getDomain().equals("youtube.quota")) {
                YoutubeApiKeyEntity key = apiKeyRepository.findByApiKey(request.getKey());
                key.setExceededAt(Instant.now());
                apiKeyRepository.save(key);
                //todo send email
                youtubeClientKey=null;
                sendQuotaExceededEmail(key.getName());
                logger.error("quota exceeded for api key "+key.getName());
                return call(request);
            } else {
                throw e;
            }
        }
    }

    private String getKey() throws ApiException {
        if(youtubeClientKey==null){
            Instant instant = Instant.now().minus(1, ChronoUnit.DAYS);
            List<YoutubeApiKeyEntity> keys = apiKeyRepository.findApiKeyEntitiesByExceededAtBeforeOrExceededAtIsNullOrderByPriorityAsc(instant);
            if(keys.isEmpty()){
                logger.error("No valid api keys were found");
                throw new ApiException("global", "System error occured. Please try again latr.");
            }else{
                youtubeClientKey = keys.get(0).getApiKey();
            }
        }

        return youtubeClientKey;
    }

    private void sendQuotaExceededEmail(String keyName){
        String messageText = "Quota exceeded for key "+keyName;

        Context context = new Context();
        context.setVariable("content", "feedback");
        context.setVariable("message", messageText);
        final String htmlContent = templateEngine.process("layout/default", context);

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("quota@videomark.app", "Videomark.app");
            messageHelper.setTo("havelvojta@seznam.cz");
            messageHelper.setSubject("Videomark youtube quota exceeded");
            messageHelper.setText(htmlContent, true);
        };

        emailSender.send(messagePreparator);
    }
}
