package com.seriestable.rest;

import lombok.Data;

/**
 * @author vojtechh
 * @date 2017-11-19
 */

@Data
public class ApiException extends Exception {

    public static String TYPE_IGNORE = "ignore";
    public static String TYPE_GLOBAL = "global";
    public static String TYPE_INFO = "info";

    private ApiError apiError;

    public ApiException(ApiError apiError) {
        super(apiError.getMessage());
        this.apiError = apiError;
    }

    public ApiException(String type, String message){
        this.apiError = new ApiError(type, message);

    }
}