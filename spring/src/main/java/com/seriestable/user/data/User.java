package com.seriestable.user.data;

import lombok.Data;

import javax.annotation.Nullable;

/**
 * @author vojtechh
 * @date 2017-11-15
 */

@Data
public class User {
    @Nullable
    private String name;
    @Nullable
    private String email;
    @Nullable
    private String apiToken;
    @Nullable
    private String role;
    @Nullable
    private Boolean hasPassword;

    private int pageSize;

    private boolean rememberFilters;
}
