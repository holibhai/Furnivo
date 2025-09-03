package com.crudoperation.jw.config;

import com.crudoperation.jw.filter.JwtAuthenticationFilter;
import com.crudoperation.jw.service.serviceImp.UserDetailsImp;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration


@EnableAspectJAutoProxy
public class SecurityConfig {
    private final UserDetailsImp userDetailsImp;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UserDetailsImp userDetailsImp, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsImp = userDetailsImp;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http

                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        req->req.requestMatchers("/api/authentication/**",
                                        "/api/user/**",
                                        "/api/productType/**",
                                        "/api/catagorie/get/**",
                                        "/api/productType/get/**",
                                        "/api/product/**",
                                        "/api/product/getAll/**",
                                        "/api/product/checkQuantity/**",
                                        "/api/product/minProduct/**",
                                        "/api/product/maxProduct/**",
                                        "/api/product/findProductsByCat/**",
                                        "/api/product/findProductsByProductType/**",
                                        "/api/order/get/{userId}/**",
                                        "/api/order/getOrderByOrderId/**",
                                        "/api/order/getAllOrders/**",
                                        "/api/deliveryCharge/get/**",
                                        "/api/deliveryCharge/getPrice/**",
                                        "/api/review/getAll/**",
                                        "/api/review/product/**",
                                        "/api/review/user/**"
                                )
                                .permitAll()

                                .requestMatchers("/api/catagorie/add/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/catagorie/update/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/catagorie/delete/**").hasAuthority("ADMIN")

                                .requestMatchers("/api/product/addProduct/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/productType/add/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/productType/delete/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/productType/update/**").hasAuthority("ADMIN")

                                .requestMatchers("/api/product/addProduct/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/product/update/{productId}/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/product/delete/{productId}/**").hasAuthority("ADMIN")

                                .requestMatchers("/api/order/update/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/order/updateStatus/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/order/getAllOrders/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/order/delete/**").hasAuthority("ADMIN")

                                .requestMatchers("/api/deliveryCharge/add/**").hasAuthority("ADMIN")

                                .requestMatchers("/api/review/status/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/review/delete/**").hasAuthority("ADMIN")

                                .requestMatchers("/api/order/add/**").hasAuthority("USER")
                                .requestMatchers("/api/billing/add/**").hasAuthority("USER")
                                .requestMatchers("/api/cartItem/add/**").hasAuthority("USER")
                                .requestMatchers("/api/cartItem/get/**").hasAuthority("USER")
                                .requestMatchers("/api/cartItem/incQuantity/**").hasAuthority("USER")
                                .requestMatchers("/api/cartItem/decQuantity/**").hasAuthority("USER")
                                .requestMatchers("/api/cartItem/delete/**").hasAuthority("USER")
                                .requestMatchers("/api/delivery/add/**").hasAuthority("USER")
                                .requestMatchers("/api/orderItem/add/**").hasAuthority("USER")
                                .requestMatchers("/api/review/add/**").hasAuthority("USER")
                                .requestMatchers("/api/payment/**").hasAuthority("USER")
                                .anyRequest()
                                .authenticated()
                ).userDetailsService(userDetailsImp)
                .sessionManagement(session->session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore( jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors->cors.configurationSource(corsConfigurationSource()))

                .build();

    }
    private CorsConfigurationSource corsConfigurationSource(){
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration configuration=new CorsConfiguration();
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);
                configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:5173","http://localhost:3001","http://localhost:8081"));
                configuration.setAllowedMethods(Collections.singletonList("*"));
                configuration.setAllowedHeaders(Collections.singletonList("*"));
                return configuration;
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


}
