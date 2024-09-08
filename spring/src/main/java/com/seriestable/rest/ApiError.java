package com.seriestable.rest;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author vojtechh
 * @date 2017-11-18
 */

//TODO VHa: refactor constructors into factory methods
@Data
public class    ApiError {

    private HttpStatus status;
    private String message;
    private Map<String, List<String>> errors = new HashMap<>();

    public ApiError(HttpStatus status, String message, Map<String, List<String>> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public ApiError(){}

    public ApiError(String type, String message){
        this.status = HttpStatus.BAD_REQUEST;
        this.message = type;
        List<String> typeErrors = new ArrayList<>();
        typeErrors.add(message);
        this.errors.put(type, typeErrors);
    }

    public void addError(String type, String message){
        List<String> typeErrors = errors.get(type);
        if(typeErrors == null){
            typeErrors = new ArrayList<>();
            this.errors.put(type, typeErrors);
        }
        typeErrors.add(message);
    }
}