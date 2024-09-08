package com.seriestable.social;

import com.seriestable.user.data.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.social.config.annotation.SocialConfigurer;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.web.SignInAdapter;

import javax.inject.Inject;
import javax.sql.DataSource;

/**
 * @author vojtechh
 * @date 2017-11-11
 */

@Configuration
public class SocialConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(SocialConfiguration.class);

    @Value( "${server.frontend}" )
    private String frontendUrl;

    @Autowired
    SocialService socialService;

    @Inject
    private Environment environment;

    @Bean
    public SocialConfigurer socialConfigurerAdapter() {
        return new DatabaseSocialConfigurer();
    }

//
    @Bean
    public SignInAdapter authSignInAdapter() {
        return (userId, connection, request) -> {
            logger.debug("authSignInAdapter userId {}", userId);
            UserEntity user = socialService.authenticate(connection);
            return frontendUrl+"?login-token="+user.getApiToken();
        };
    }

}