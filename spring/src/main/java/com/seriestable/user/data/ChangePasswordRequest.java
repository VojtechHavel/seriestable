package com.seriestable.user.data;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Size;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

@Data
public class ChangePasswordRequest {

    private String currentPassword;

    @NotBlank
    @Size(min=5, message="Password must be at least 5 characters long.")
    private String newPassword;
}
