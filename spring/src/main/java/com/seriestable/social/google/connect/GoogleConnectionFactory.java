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
package com.seriestable.social.google.connect;

import org.springframework.social.connect.UserProfile;
import org.springframework.social.connect.support.OAuth2ConnectionFactory;
import com.seriestable.social.google.api.Google;
import org.springframework.social.oauth2.AccessGrant;

/**
 * Google ConnectionFactory implementation.
 *
 * @author Gabriel Axel
 */
public class GoogleConnectionFactory extends OAuth2ConnectionFactory<Google> {
  public GoogleConnectionFactory(String appId, String appSecret) {
    this(appId, appSecret, (String)null);
  }

  public GoogleConnectionFactory(String appId, String appSecret, String appNamespace) {
    super("google", new GoogleServiceProvider(appId, appSecret), new GoogleAdapter());
  }
}