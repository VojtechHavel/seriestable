package com.seriestable.feedback.data;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;

/**
 * @author vojtechh
 * @date 2017-11-28
 */

@Data
public class Feedback {
    @NotBlank
    String body;

    @NotBlank
    String email;
}
