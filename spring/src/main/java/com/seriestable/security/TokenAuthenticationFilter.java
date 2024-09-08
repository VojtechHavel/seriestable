package com.seriestable.security;

import com.seriestable.user.data.UserEntity;
import com.seriestable.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;

/**
 * @author vojtechh
 * @date 2017-11-12
 */

public class TokenAuthenticationFilter extends GenericFilterBean {
    private static final Logger logger = LoggerFactory.getLogger(TokenAuthenticationFilter.class);

    public static String HEADER_PREFIX = "Bearer ";

    final UserService userService;

    public TokenAuthenticationFilter(UserService userService) {
        this.userService = userService;
    }


    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
            throws IOException, ServletException {
        final HttpServletRequest httpRequest = (HttpServletRequest) request;

        //extract token from header
//        final String accessToken = httpRequest.getHeader("Authorization").;
        final String requestApiToken = extractBearer(httpRequest.getHeader("Authorization"));
        logger.debug("accessToken" + requestApiToken);
        logger.debug("accessToken end");

        if (requestApiToken != null) {
            //get and check whether token is valid ( from DB or file wherever you are storing the token)
            UserEntity user = userService.getUserByToken(requestApiToken);
            logger.debug("doFilter user" + user);

            if (user!= null) {

                GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
                final UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, Arrays.asList(authority));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("auth set" + user);

            }
        }

        chain.doFilter(request, response);
    }

    public static String extractBearer(String header) {
        if (StringUtils.isEmpty(header)) {
            return null;
        }

        if (header.length() < HEADER_PREFIX.length()) {
            return null;
        }

        return header.substring(HEADER_PREFIX.length(), header.length());
    }
}