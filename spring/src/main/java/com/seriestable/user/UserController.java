package com.seriestable.user;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.*;
import com.seriestable.youtube.tag.TagService;
import com.seriestable.youtube.tag.data.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collection;

import static com.seriestable.user.AuthenticationExceptions.WRONG_CURRENT_PASSWORD;

/**
 * @author vojtechh
 * @date 2017-11-14
 */

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private TagService tagService;

    @GetMapping("/me")
    public UserSettings me(Authentication authentication, Principal principal) throws ApiException {
        UserSettings userSettings = new UserSettings();
        Collection<Tag> tags =  tagService.getTags(userService.getUserOrThrowException(authentication));
        userSettings.setTags(tags);

        User user= userService.adaptUser((UserEntity) authentication.getPrincipal());
        userSettings.setUser(user);

        return userSettings;
    }

    @PutMapping("/me/name")
    public void changeName(Authentication authentication, @RequestBody @Valid ChangeUsernameRequest request) throws IOException, ApiException {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        user.setName(request.getName());
        userService.saveUser(user);
    }

    @PutMapping("/me/email")
    public void changeEmail(Authentication authentication, HttpServletResponse httpServletResponse, Principal principal, @Valid @RequestBody ChangeEmailRequest request) throws IOException, ApiException {
        UserEntity user = (UserEntity) authentication.getPrincipal();

        if (user.getEmail()!=null && user.getEmail().equals(request.getEmail())) {
            throw new ApiException("email", "The email has not changed.");
        } else if (userService.getUserByEmail(request.getEmail()) != null) {
            throw new ApiException("email", "The email has already been taken.");
        } else {
            if (!StringUtils.isEmpty(user.getPassword()) && !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new ApiException("currentPassword", WRONG_CURRENT_PASSWORD);
            } else {
                user.setEmail(request.getEmail());
                userService.saveUser(user);
            }
        }
    }

    @PutMapping("/me/password")
    public void changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) throws IOException, ApiException {
        UserEntity user = (UserEntity) authentication.getPrincipal();

        if (!StringUtils.isEmpty(user.getPassword()) && !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ApiException("currentPassword", WRONG_CURRENT_PASSWORD);
        } else {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userService.saveUser(user);
        }
    }

    @PutMapping("/me/pageSize")
    public void changePageSize(Authentication authentication, @Valid @RequestBody PageSize pageSize) throws IOException, ApiException {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        user.setPageSize(pageSize.getPageSize());
        userService.saveUser(user);
    }

    @PutMapping("/me/remember-filters/{remember}")
    public void changePageSize(Authentication authentication, @PathVariable(value="remember") boolean remember) throws IOException, ApiException {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        user.setRememberFilters(remember);
        userService.saveUser(user);
    }

    @PostMapping("/me/forgot-password")
    public void sendResetPasswordLink(Authentication authentication, @Valid @RequestBody ForgotPasswordRequest request) throws IOException, ApiException {
        UserEntity user = userService.getUserByEmail(request.getEmail());

        if (user == null) {
            throw new ApiException("email", "User with specified email not found.");
        } else {
            userService.sendResetPasswordLink(user);
        }
    }

    @PostMapping("/me/reset-password")
    public void resetPassword(Authentication authentication, @Valid @RequestBody ResetPasswordRequest request) throws IOException, ApiException {
        UserEntity user = userService.getUserByEmail(request.getEmail());
        PasswordResetTokenEntity tokenEntity = passwordResetTokenRepository.findByUserAndToken(user, request.getToken());
        if (tokenEntity == null) {
            throw new ApiException("token", "token not found");
        } else if (!tokenEntity.getValid()) {
            throw new ApiException("token", "token expired");
        } else if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ApiException("token", "token not valid");
        } else {
            tokenEntity.setValid(false);
            passwordResetTokenRepository.save(tokenEntity);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userService.saveUser(user);
        }
    }
}