package com.reownix.product.mapper;

import com.reownix.product.entity.Category;
import com.reownix.product.request.CategoryRequest;
import com.reownix.product.response.CategoryResponse;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    // Request DTO -> Entity
    public Category toEntity(CategoryRequest request) {

        return Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    // Entity -> Response DTO
    public CategoryResponse toResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .active(category.getActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}