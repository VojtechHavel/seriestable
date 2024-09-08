package com.seriestable.feedback;

import com.seriestable.feedback.data.Feedback;
import com.seriestable.user.data.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;

/**
 * @author vojtechh
 * @date 2017-11-28
 */

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;
    ;

    @PostMapping("")
    public void sendFeedback(HttpServletRequest request, Authentication authentication, Principal principal, @RequestBody @Valid Feedback feedback) throws IOException, MessagingException {


        String messageStart = "Not logged in user. ";
        if (authentication != null) {
            messageStart = "User[" + ((UserEntity) authentication.getPrincipal()).getId() + "]. ";
        }
        messageStart = messageStart + "userAgent:["+request.getHeader("User-Agent")+"]";
        messageStart = messageStart + "ip:["+request.getRemoteAddr()+"]";

        String messageText = messageStart + "Response email: [" + feedback.getEmail() + "]: " + feedback.getBody();

        Context context = new Context();
        context.setVariable("content", "feedback");
        context.setVariable("message", messageText);
        final String htmlContent = templateEngine.process("layout/default", context);

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("feedback@videomark.app", "Videomark.app");
            messageHelper.setTo("havelvojta@seznam.cz");
            messageHelper.setSubject("Feedback");
            messageHelper.setText(htmlContent, true);
        };

        emailSender.send(messagePreparator);
    }
}