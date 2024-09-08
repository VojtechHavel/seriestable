/**
 * Copyright 2011-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.seriestable.social.google.api;

import org.springframework.social.ApiBinding;
import com.seriestable.social.google.api.impl.GoogleTemplate;
import com.seriestable.social.google.api.oauth2.OAuth2Operations;
import org.springframework.web.client.RestOperations;

/**
 * Interface specifying a basic set of operations for interacting with Google
 * APIs. Implemented by {@link GoogleTemplate}.
 *
 * @author Gabriel Axel
 */
public interface Google extends ApiBinding {

  /**
   * Retrieves {@link OAuth2Operations}, used for interacting with Google+ API.
   *
   */
  OAuth2Operations oauth2Operations();

  /**
   * Returns the access token, allowing interoperability with other libraries
   *
   * @see <a href="http://code.google.com/p/google-api-java-client/">Google
   *      APIs Client Library for Java</a>
   *
   * @return The OAuth2 access token
   */
  String getAccessToken();

  RestOperations restOperations();
}
