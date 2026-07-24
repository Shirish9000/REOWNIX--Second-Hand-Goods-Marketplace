package com.reownix.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title("REOWNIX Product Service API")
                                .version("1.0")
                                .description("Verified Second-Hand Goods Marketplace APIs")
                                .contact(
                                        new Contact()
                                                .name("Shirish Patil")
                                                .email("shirish@example.com")
                                )
                );
    }
}