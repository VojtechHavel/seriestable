package com.seriestable.user.data;

import lombok.Data;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

@Data
public class ForgotPasswordRequest {

    @NotBlank
    @Email
    private String email;

}
