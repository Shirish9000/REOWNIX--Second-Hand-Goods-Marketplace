package com.reownix.product.request;

import com.reownix.product.enums.ProductCondition;
import jakarta.validation.constraints.*;
import java.util.List;
import com.reownix.product.request.ProductImageRequest;

import lombok.Data;
import java.util.List;

@Data
public class ProductRequest {

    @NotBlank(message = "Product title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Product condition is required")
    private ProductCondition condition;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Category Id is required")
    private Long categoryId;

    @NotNull(message = "Seller Id is required")
    private Long sellerId;

    private String imageUrl;

    private String videoUrl;
    private List<ProductImageRequest> images;

}