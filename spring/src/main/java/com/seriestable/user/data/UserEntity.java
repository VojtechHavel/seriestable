package com.seriestable.user.data;

import com.seriestable.social.UserFromProvider;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(exclude="connections")
@ToString(exclude="connections")
@Table(name = "users")
public class UserEntity {
  @Id
  @GeneratedValue(strategy= GenerationType.AUTO)
  private Long id;
  private String name;
  @Column(unique = true)
  private String email;
  private String password;
  private String role;
  @Column(unique = true)
  private String apiToken;

  private Instant createdAt;

  private boolean rememberFilters;

  private Instant updatedAt;

  private Integer pageSize = 30;

  @OneToMany(
          mappedBy = "user",
          cascade = CascadeType.ALL,
          orphanRemoval = true
  )
  private List<UserFromProvider> connections = new ArrayList<>();

  @PrePersist
  protected void onCreate() {
    createdAt = Instant.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = Instant.now();
  }
}
