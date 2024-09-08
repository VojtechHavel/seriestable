package com.seriestable.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * @author vojtechh
 * @date 2017-11-19
 */

@ControllerAdvice
public class CustomRestExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(CustomRestExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    @ResponseBody
    protected ResponseEntity<Object> handleApiException(
            final ApiException exception,
            final WebRequest request) {

        logger.error("handling exception with error {}", exception.getApiError(), exception);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return handleExceptionInternal(exception, exception.getApiError(), headers,  exception.getApiError().getStatus(), request);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseBody
    protected ResponseEntity<Object> handleRuntimeException(
            final RuntimeException exception,
            final WebRequest request) {

        logger.error("handling exception with error {}", exception);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return handleExceptionInternal(exception, "Server error occured. Please try again later", headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        ApiError apiError = new ApiError();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            apiError.addError(error.getField(), error.getDefaultMessage());
        }
        for (ObjectError error : ex.getBindingResult().getGlobalErrors()) {
            apiError.addError(error.getObjectName(), error.getDefaultMessage());
        }

        apiError.setStatus(HttpStatus.BAD_REQUEST);
        apiError.setMessage("Validation error.");
        return handleExceptionInternal(ex, apiError, headers, apiError.getStatus(), request);
    }
}