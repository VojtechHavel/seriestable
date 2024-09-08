package com.seriestable.security.data;

import lombok.Data;

/**
 * @author vojtechh
 * @date 2017-11-17
 */

@Data
public class LoginRequest {
    String email;
    String password;
}
