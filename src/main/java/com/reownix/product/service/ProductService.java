package com.reownix.product.service;

import com.reownix.product.request.ProductRequest;
import com.reownix.product.response.ProductResponse;

import org.springframework.data.domain.Page;
import java.util.List;
import com.reownix.product.enums.ProductCondition;



public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> getProductsBySeller(Long sellerId);
    Page<ProductResponse> getAllProducts(int page, int size, String sortBy);

    List<ProductResponse> getProductsByCategory(Long categoryId);

    List<ProductResponse> searchProducts(String keyword);

    List<ProductResponse> getProductsByLocation(String location);

    List<ProductResponse> getProductsByPriceRange(Double minPrice, Double maxPrice);

    List<ProductResponse> getApprovedProducts();

    ProductResponse approveProduct(Long productId);

    ProductResponse rejectProduct(Long productId);

    List<ProductResponse> getProductsByCondition(ProductCondition condition);

    List<ProductResponse> getLatestProducts();
}