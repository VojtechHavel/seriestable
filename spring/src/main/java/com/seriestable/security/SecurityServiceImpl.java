package com.seriestable.security;

import com.seriestable.user.data.UserEntity;
import com.seriestable.user.UserRepository;
import com.seriestable.user.UserService;
import org.apache.commons.text.RandomStringGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;

import static org.apache.commons.text.CharacterPredicates.DIGITS;
import static org.apache.commons.text.CharacterPredicates.LETTERS;

/**
 * @author vojtechh
 * @date 2017-11-17
 */

@Service
public class SecurityServiceImpl implements SecurityService {

    private final Integer tokenLength = 200;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String findOrCreateApiToken(UserEntity user){
        String token = user.getApiToken();
        if(StringUtils.isEmpty(token)){
            //Generate Token
            RandomStringGenerator tokenGenerator = new RandomStringGenerator.Builder()
                    .withinRange('0', 'z')
                    .filteredBy(LETTERS, DIGITS)
                    .build();

            token = tokenGenerator.generate(tokenLength);

            //Save the token for the logged in user
            user.setApiToken(token);
            userRepository.save(user);
        }
        return token;
    }

    @Override
    public UserEntity authenticate(UserEntity user){
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
        if(StringUtils.isEmpty(user.getApiToken())) {
            user.setApiToken(findOrCreateApiToken(user));
        }
        final UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, Arrays.asList(authority));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return user;
    }
}
