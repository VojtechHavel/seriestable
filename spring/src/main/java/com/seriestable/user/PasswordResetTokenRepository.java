package com.seriestable.user;

import com.seriestable.user.data.PasswordResetTokenEntity;
import com.seriestable.user.data.UserEntity;
import org.springframework.data.repository.CrudRepository;

/**
 * @author vojtechh
 * @date 2017-12-02
 */
public interface PasswordResetTokenRepository  extends CrudRepository<PasswordResetTokenEntity, Long> {
    PasswordResetTokenEntity findByUserAndToken(UserEntity user, String token);
}
