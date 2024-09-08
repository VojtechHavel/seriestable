package com.seriestable.security;

import com.seriestable.user.data.UserEntity;
import com.seriestable.user.UserService;
import org.apache.commons.text.RandomStringGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Arrays;

import static org.apache.commons.text.CharacterPredicates.DIGITS;
import static org.apache.commons.text.CharacterPredicates.LETTERS;

/**
 * @author vojtechh
 * @date 2017-11-12
 */

@Component
public class CustomBasicAuthenticationFilter extends BasicAuthenticationFilter {

    private static final Logger logger = LoggerFactory.getLogger(CustomBasicAuthenticationFilter.class);

    private final Integer tokenLength = 200;

    private UserService userService;

    @Autowired
    public CustomBasicAuthenticationFilter(final AuthenticationManager authenticationManager, final UserService userService) {
        super(authenticationManager);
        this.userService = userService;
    }

    @Override
    protected void onSuccessfulAuthentication(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response, final Authentication authResult) {
        logger.debug("auth successfull");

        UserEntity user = userService.getUserByEmail(authResult.getName());
        if(StringUtils.isEmpty(user.getApiToken())){
            //Generate Token
            RandomStringGenerator tokenGenerator = new RandomStringGenerator.Builder()
                    .withinRange('0', 'z')
                    .filteredBy(LETTERS, DIGITS)
                    .build();

            String token = tokenGenerator.generate(tokenLength);

            //Save the token for the logged in user
            userService.saveApiToken(authResult.getName(), token);
        }

        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
        final UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, Arrays.asList(authority));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
