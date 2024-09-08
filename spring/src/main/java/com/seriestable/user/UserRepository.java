package com.seriestable.user;

import com.seriestable.user.data.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author vojtechh
 * @date 2017-11-12
 */

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    UserEntity findByEmailIgnoreCase(String email);

    UserEntity findByApiToken(String apiToken);

}