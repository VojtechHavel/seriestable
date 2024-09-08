package com.seriestable.social;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

@Repository
public interface UserToUserconnectionsRepository extends CrudRepository<UserFromProvider, Long>{

    UserFromProvider findFirstByProviderAndProviderUser(String provider, String providerUser);

}