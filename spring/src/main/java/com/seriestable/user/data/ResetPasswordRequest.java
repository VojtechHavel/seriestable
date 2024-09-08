package com.seriestable.user.data;

import lombok.Data;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Size;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

@Data
public class ResetPasswordRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min=5, message="Password must be at least 5 characters long.")
    private String password;

    @NotBlank
    private String token;
}
