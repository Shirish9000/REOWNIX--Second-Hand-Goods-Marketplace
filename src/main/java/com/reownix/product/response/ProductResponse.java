package com.reownix.product.response;

import com.reownix.product.enums.ProductCondition;
import com.reownix.product.enums.ProductStatus;
import lombok.Builder;
import lombok.Data;
import java.util.List;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {

    private Long id;
    private Long sellerId;
    private String sellerName;

    private String title;

    private String description;

    private Double price;

    private ProductCondition condition;

    private ProductStatus status;

    private String location;

    private String imageUrl;

    private String videoUrl;

    private Long categoryId;

    private String categoryName;


    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private List<ProductImageResponse> images;

}