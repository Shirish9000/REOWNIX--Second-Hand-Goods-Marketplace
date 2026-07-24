package com.reownix.product.mapper;

import com.reownix.product.entity.Category;
import com.reownix.product.entity.Product;
import com.reownix.product.entity.ProductImage;
import com.reownix.product.request.ProductImageRequest;
import com.reownix.product.request.ProductRequest;
import com.reownix.product.response.ProductImageResponse;
import com.reownix.product.response.ProductResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    // Request -> Entity
    public Product toEntity(ProductRequest request, Category category) {

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .condition(request.getCondition())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .videoUrl(request.getVideoUrl())
                .category(category)
                .sellerId(request.getSellerId())
                .build();

        product.setImages(
                mapImages(request.getImages(), product)
        );

        return product;
    }

    // Entity -> Response
    public ProductResponse toResponse(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .condition(product.getCondition())
                .status(product.getStatus())
                .location(product.getLocation())
                .imageUrl(product.getImageUrl())
                .videoUrl(product.getVideoUrl())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .sellerId(product.getSellerId())
                .images(mapImageResponses(product.getImages()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    // Product Images Mapping
    private List<ProductImage> mapImages(List<ProductImageRequest> requests,
                                         Product product) {

        if (requests == null || requests.isEmpty()) {
            return new ArrayList<>();
        }

        List<ProductImage> images = new ArrayList<>();

        int order = 1;

        for (ProductImageRequest request : requests) {

            ProductImage image = ProductImage.builder()
                    .imageUrl(request.getImageUrl())
                    .displayOrder(order++)
                    .product(product)
                    .build();

            images.add(image);
        }

        return images;
    }

    // Image Response Mapping
    private List<ProductImageResponse> mapImageResponses(
            List<ProductImage> images) {

        if (images == null || images.isEmpty()) {
            return new ArrayList<>();
        }

        return images.stream()
                .map(image -> ProductImageResponse.builder()
                        .id(image.getId())
                        .imageUrl(image.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }
}