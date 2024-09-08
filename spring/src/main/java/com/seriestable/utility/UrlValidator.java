package com.seriestable.utility;


import com.seriestable.rest.ApiException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

public class UrlValidator {

    public static void validate(String text) throws ApiException {
        final List<String> UNSUPPORTED_CHARACTERS =
                Arrays.asList("\\", "/", ".", "?", "*", "\"", ":", "<", ">", "#", "%", "=");
        String unsupportedCharacters = "";

        for(String character: UNSUPPORTED_CHARACTERS){
            if(text.contains(character)){
                unsupportedCharacters = unsupportedCharacters + " " + character;
            }
        }

        if(!unsupportedCharacters.equals("")){
            String EXCEPTION_PREFIX = "The name contains unsupported characters";
            throw new ApiException(ApiException.TYPE_GLOBAL, EXCEPTION_PREFIX +unsupportedCharacters);
        }

    }
}
