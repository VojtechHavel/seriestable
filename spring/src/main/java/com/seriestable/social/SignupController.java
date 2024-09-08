package com.seriestable.social;

import com.seriestable.user.data.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.WebRequest;

import javax.inject.Inject;

/**
 * @author vojtechh
 * @date 2017-11-11
 */

@Controller
public class SignupController {
    private static final Logger logger = LoggerFactory.getLogger(SignupController.class);

    @Value( "${server.frontend}" )
    private String frontendUrl;

    @Inject
    private Environment environment;

    @Autowired
    SocialService socialService;

    @Autowired
    ConnectionFactoryLocator connectionFactoryLocator;

    @Autowired
    UsersConnectionRepository connectionRepository;

    @RequestMapping(value = "/signup")
    public String signup(WebRequest request) {
        logger.debug("signup");

        logger.debug("connection factories", connectionFactoryLocator);

        ProviderSignInUtils signInUtils = new ProviderSignInUtils(connectionFactoryLocator, connectionRepository);

        String redirectUrl = frontendUrl;

        Connection<?> connection = signInUtils.getConnectionFromSession(request);
        if (connection != null) {
            UserEntity user = socialService.authenticate(connection);
            redirectUrl+="?signup-token="+user.getApiToken();
            signInUtils.doPostSignUp(connection.getDisplayName(), request);
        }
        logger.debug("redirect url {}",redirectUrl);
        return "redirect:"+redirectUrl;
    }
}