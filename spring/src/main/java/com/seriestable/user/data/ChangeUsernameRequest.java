package com.seriestable.user.data;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

@Data
public class ChangeUsernameRequest {

    @NotBlank
    private String name;

}
