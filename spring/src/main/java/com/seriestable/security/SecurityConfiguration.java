package com.seriestable.security;

import com.seriestable.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

/**
 * @author vojtechh
 * @date 2017-11-11
 */

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfiguration.class);

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        final TokenAuthenticationFilter tokenFilter = new TokenAuthenticationFilter(this.userService);
//
//        final CustomBasicAuthenticationFilter customBasicAuthFilter =
//                new CustomBasicAuthenticationFilter(this.authenticationManager(), this.userService);

//        http
//                .anonymous().disable()
//                .addFilterBefore(tokenFilter, BasicAuthenticationFilter.class)
//                .addFilter(customBasicAuthFilter)
//                .authorizeRequests()
//                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
////                .antMatchers("/api/session").permitAll()
////                .antMatchers("/").permitAll()
//                .antMatchers("/ping").permitAll()
////                .antMatchers("/login").permitAll()
//                .antMatchers("/api/**").authenticated()
////                .and().httpBasic().realmName(CustomAuthenticationEntryPoint.REALM)
////                .and().httpBasic()
////                .authenticationEntryPoint(customAuthenticationEntryPoint)
//                .and()
//                .requestCache()
//                .requestCache(new NullRequestCache())
//                .and()
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
//                .and().csrf().disable();

        http
//                .authorizeRequests()
//                    .antMatchers("/api/login").permitAll()
//                    .antMatchers("/api/pages").permitAll()
//                    .antMatchers("/api/notes").permitAll()
//                    .antMatchers("/api/contents").permitAll()
//                    .antMatchers("/api/signup").permitAll()
//                    .antMatchers("/api/ping").permitAll()
//                    .antMatchers("/api/feedback").permitAll()
//                    .antMatchers("/api/previews").permitAll()
//                    .antMatchers("/api/users/me/forgot-password").permitAll()
//                    .antMatchers("/api/users/me/reset-password").permitAll()
//                    //social connections
//                    .antMatchers("/signin/**", "/signup/**" ).permitAll()
//                    .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                    .anyRequest().authenticated()
//                    .and()
                .csrf().disable()
                .cors().and()
                .addFilterBefore(tokenFilter, BasicAuthenticationFilter.class);
    }

//    @Bean
//    public FilterRegistrationBean corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOrigin("http://domain1.com");
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//        source.registerCorsConfiguration("/**", config);
//        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
//        bean.setOrder(0);
//        return bean;
//    }

//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurerAdapter() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("http://localhost:8080")
//                        .allowedMethods("OPTIONS", "PUT", "POST", "GET", "DELETE");
//            }
//        };
//    }

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
//    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}