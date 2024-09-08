package com.seriestable.user;

import com.seriestable.rest.ApiException;
import com.seriestable.user.data.PasswordResetTokenEntity;
import com.seriestable.user.data.Roles;
import com.seriestable.user.data.UserEntity;
import com.seriestable.user.data.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.UUID;

import static com.seriestable.user.AuthenticationExceptions.USER_NOL_LOGGED_IN;

/**
 * @author vojtechh
 * @date 2017-11-12
 */

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;;

    @Value( "${server.frontend}" )
    private String frontendUrl;

    public void saveApiToken(String email, String token) {
        UserEntity user = userRepository.findByEmailIgnoreCase(email);
        user.setApiToken(token);
        userRepository.save(user);
    }

    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public UserEntity getUserByToken(String token) {
        UserEntity user = userRepository.findByApiToken(token);
        return user;
    }

    public UserEntity saveUser(String email, String name, String password) {
        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Roles.USER.name());
        user = userRepository.save(user);
        return user;
    }

    public UserEntity saveUser(UserEntity user) {
        return userRepository.save(user);
    }

    public UserEntity createAccount(UserEntity user, String email, String password) {
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User adaptUser(UserEntity user){
        ModelMapper modelMapper = new ModelMapper();
        if(user.getPageSize()==null){
            user.setPageSize(30);
        }
        User userResponse =  modelMapper.map(user, User.class);
        userResponse.setHasPassword(!StringUtils.isEmpty(user.getPassword()));
        return userResponse;
    }

    public void sendResetPasswordLink(UserEntity user) {
        String token = UUID.randomUUID().toString();
        PasswordResetTokenEntity tokenEntity = createPasswordResetTokenForUser(user, token);
        sendResetPasswordEmail(tokenEntity);
    }


    public UserEntity getUserOrThrowException(Authentication authentication) throws ApiException {
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }else{
            throw new ApiException(ApiException.TYPE_GLOBAL, USER_NOL_LOGGED_IN);
        }
        return user;
    }

    public UserEntity getUserOrThrowIgnoreException(Authentication authentication) throws ApiException {
        UserEntity user = null;
        if (authentication != null) {
            user = (UserEntity) authentication.getPrincipal();
        }else{
            throw new ApiException(ApiException.TYPE_IGNORE, USER_NOL_LOGGED_IN);
        }
        return user;
    }


    private PasswordResetTokenEntity createPasswordResetTokenForUser(UserEntity user, String token) {
        PasswordResetTokenEntity tokenEntity = new PasswordResetTokenEntity(token, user);
        passwordResetTokenRepository.save(tokenEntity);
        return tokenEntity;
    }

    private void sendResetPasswordEmail(PasswordResetTokenEntity tokenEntity){
        String resetLink = frontendUrl + "/reset-password?token=" + tokenEntity.getToken() + "&email=" + tokenEntity.getUser().getEmail();
        Context context = new Context();
        context.setVariable("content", "reset-password");
        context.setVariable("resetLink", resetLink);
        String processedContext =  templateEngine.process("layout/default", context);

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("info@videomark.app", "Videomark.app");
            messageHelper.setTo(tokenEntity.getUser().getEmail());
            messageHelper.setSubject("Password Reset");
            messageHelper.setText(processedContext, true);
        };

        emailSender.send(messagePreparator);
    }
}