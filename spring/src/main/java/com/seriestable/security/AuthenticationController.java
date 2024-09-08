package com.seriestable.security;

import com.seriestable.rest.ApiError;
import com.seriestable.rest.ApiException;
import com.seriestable.security.data.LoginRequest;
import com.seriestable.security.data.SignupRequest;
import com.seriestable.user.data.UserEntity;
import com.seriestable.user.UserService;
import com.seriestable.user.data.User;
import com.seriestable.user.data.UserSettings;
import com.seriestable.youtube.tag.TagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;

/**
 * @author vojtechh
 * @date 2017-11-12
 */

@RestController
@RequestMapping("/api")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    SecurityService securityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TagService tagService;

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

    @PostMapping(value = "/login")
    public UserSettings login(WebRequest request, Principal principal, HttpServletResponse httpServletResponse, @RequestBody LoginRequest loginRequest) throws IOException, ApiException {

        UserEntity userEntity = userService.getUserByEmail(loginRequest.getEmail());
        if (userEntity != null && passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPassword())) {

            this.securityService.authenticate(userEntity);

            UserSettings userSettings = new UserSettings();
            userSettings.setTags(tagService.getTags(userEntity));

            User user= userService.adaptUser(userEntity);
            userSettings.setUser(user);

            return userSettings;
        } else {
            ApiError apiError = new ApiError();
            apiError.setStatus(HttpStatus.UNAUTHORIZED);
            apiError.setMessage("There were erros while signing in.");
            apiError.addError(ApiException.TYPE_GLOBAL, "These credentials do not match any account.");
            throw new ApiException(apiError);
        }
    }

    @PostMapping(value = "/signup")
    public UserSettings signup(WebRequest request, Principal principal, HttpServletResponse httpServletResponse, @Valid @RequestBody SignupRequest signupRequest) throws IOException, ApiException {

        UserEntity userEntity = userService.getUserByEmail(signupRequest.getEmail());
        if (userEntity != null) {
            ApiError apiError = new ApiError();
            apiError.setStatus(HttpStatus.CONFLICT);
            apiError.setMessage("There were erros while signing up.");
            apiError.addError("email", "The email has already been taken.");
            throw new ApiException(apiError);
        } else {
            userEntity = userService.saveUser(signupRequest.getEmail(), signupRequest.getName(), signupRequest.getPassword());
            this.securityService.authenticate(userEntity);

            UserSettings userSettings = new UserSettings();
            User user= userService.adaptUser(userEntity);
            userSettings.setUser(user);
            userSettings.setTags(new ArrayList<>());

            return userSettings;
        }
    }
}