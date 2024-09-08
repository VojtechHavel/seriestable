package com.seriestable.user.data;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * @author vojtechh
 * @date 2017-12-02
 */

@Entity
@Data
@Table(name = "password_reset_tokens")
public class PasswordResetTokenEntity {

    private static final int EXPIRATION = 4;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    private Boolean valid;

    @OneToOne(targetEntity = UserEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "userId")
    private UserEntity user;

    private LocalDateTime expiryDate;

    public PasswordResetTokenEntity(String token, UserEntity user) {
        this.token = token;
        this.user = user;
        this.expiryDate = LocalDateTime.now().plusHours(EXPIRATION);
        this.valid = true;
    }

    //used by Repository queries
    public PasswordResetTokenEntity(){

    }
}