package com.seriestable.social;

import com.seriestable.user.data.UserEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

@Entity
@Data
@Table(name = "users_from_providers")
public class UserFromProvider {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userId")
    private UserEntity user;

    private String provider;

    private String providerUser;
}
