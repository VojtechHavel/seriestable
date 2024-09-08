package com.seriestable.security;

import com.seriestable.user.data.UserEntity;

/**
 * @author vojtechh
 * @date 2017-11-17
 */
public interface SecurityService {

    String findOrCreateApiToken(UserEntity user);

    UserEntity authenticate(UserEntity user);
}
