package com.seriestable.security.data;

import lombok.Data;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Size;

/**
 * @author vojtechh
 * @date 2017-11-17
 */

@Data
public class SignupRequest {

    @NotBlank
    @Email
    String email;

    @Size(min=5, message="must be at least 5 characters long")
    String password;

    @NotBlank
    String name;
}
