package com.seriestable.social;

import com.seriestable.security.SecurityService;
import com.seriestable.social.facebook.FacebookService;
import com.seriestable.user.UserRepository;
import com.seriestable.user.data.UserEntity;
import com.seriestable.user.UserService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionKey;
import org.springframework.social.connect.UserProfile;
import org.springframework.stereotype.Service;

import java.util.Arrays;

/**
 * @author vojtechh
 * @date 2017-11-11
 */

@Service
public class SocialService {

    @Autowired
    UserService userService;

    @Autowired
    SecurityService securityService;

    @Autowired
    FacebookService facebookService;

    @Autowired
    UserToUserconnectionsRepository usersToUserconnectionsRepository;

    @Autowired
    UserRepository userRepository;

    protected static final Logger logger = LoggerFactory.getLogger(SocialService.class);

    public UserEntity authenticate(Connection<?> connection) {

        UserProfile userProfile;

        if(connection.getKey().getProviderId().equals("facebook")){
            userProfile = facebookService.getProfile("me", connection.createData().getAccessToken());
        }else {
            userProfile = connection.fetchUserProfile();
        }

        logger.debug("authenticated connection {} ", userProfile);

        UserEntity user = findOrCreateSocialUser(userProfile.getName(), connection.getKey(), userProfile.getEmail());
        securityService.findOrCreateApiToken(user);
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null,  Arrays.asList(authority));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.info("UserEntity {} connected.", connection.getDisplayName());
        return user;
    }

    public UserEntity findOrCreateSocialUser(String name, ConnectionKey connectionKey, String email){

        UserFromProvider usersToUserconnections = usersToUserconnectionsRepository
                .findFirstByProviderAndProviderUser(connectionKey.getProviderId(), connectionKey.getProviderUserId());

        if(usersToUserconnections == null) {

            usersToUserconnections = new UserFromProvider();
            usersToUserconnections.setProvider(connectionKey.getProviderId());
            usersToUserconnections.setProviderUser(connectionKey.getProviderUserId());

            UserEntity user = new UserEntity();
            user.setName(name);
            user.setRole("USER");
            if(StringUtils.isNotEmpty(email) && userRepository.findByEmailIgnoreCase(email)==null) {
                user.setEmail(email);
            }
            user.getConnections().add(usersToUserconnections);

            usersToUserconnections.setUser(user);
            return userService.saveUser(user);
        }else{
            return usersToUserconnections.getUser();
        }
    }
}