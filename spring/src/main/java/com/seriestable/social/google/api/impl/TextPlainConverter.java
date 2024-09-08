package com.seriestable.social.google.api.impl;

import org.springframework.http.MediaType;
import org.springframework.http.converter.json.GsonHttpMessageConverter;

import java.util.Arrays;
import java.util.List;

public class TextPlainConverter extends GsonHttpMessageConverter {
    public TextPlainConverter() {
        List<MediaType> types = Arrays.asList(
                new MediaType("text", "plain", DEFAULT_CHARSET)
        );
        super.setSupportedMediaTypes(types);
    }
}