package com.seriestable.user.data;

import lombok.Data;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

@Data
public class ChangeEmailRequest {
    @NotBlank(message = "Email cannot be empty.")
    @Email(message = "Invalid email address format.")
    private String email;

    private String currentPassword;
}
