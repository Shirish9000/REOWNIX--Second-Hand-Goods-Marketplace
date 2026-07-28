package com.reownix.product.controller;

import com.reownix.product.enums.ProductStatus;
import com.reownix.product.request.ProductRequest;
import com.reownix.product.response.ProductResponse;
import com.reownix.product.service.ProductService;
import org.springframework.data.domain.Page;
import com.reownix.product.enums.ProductCondition;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Create Product
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {

        return new ResponseEntity<>(
                productService.createProduct(request),
                HttpStatus.CREATED);
    }

    // Get All Products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts());
    }

    // Get Product By Id
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                productService.getProductById(id));
    }

    // Update Product
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        return ResponseEntity.ok(
                productService.updateProduct(id, request));
    }

    // Delete Product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Get Products By Category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                productService.getProductsByCategory(categoryId));
    }

    // Search Products
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                productService.searchProducts(keyword));
    }

    // Get Products By Location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<ProductResponse>> getProductsByLocation(
            @PathVariable String location) {

        return ResponseEntity.ok(
                productService.getProductsByLocation(location));
    }
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ProductResponse>> getSellerProducts(
            @PathVariable Long sellerId) {

        return ResponseEntity.ok(
                productService.getProductsBySeller(sellerId));
    }
    @GetMapping("/page")
    public ResponseEntity<Page<ProductResponse>> getProductsWithPagination(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "id") String sortBy) {

        return ResponseEntity.ok(
                productService.getAllProducts(page, size, sortBy));
    }

    @GetMapping("/price")
    public ResponseEntity<List<ProductResponse>> getProductsByPriceRange(

            @RequestParam Double minPrice,

            @RequestParam Double maxPrice) {

        return ResponseEntity.ok(
                productService.getProductsByPriceRange(minPrice, maxPrice));
    }
    @GetMapping("/approved")
    public ResponseEntity<List<ProductResponse>> getApprovedProducts() {

        return ResponseEntity.ok(
                productService.getApprovedProducts());
    }
    @PutMapping("/{id}/approve")
    public ResponseEntity<ProductResponse> approveProduct(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                productService.approveProduct(id));
    }
    @PutMapping("/{id}/reject")
    public ResponseEntity<ProductResponse> rejectProduct(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                productService.rejectProduct(id));
    }
    @GetMapping("/condition/{condition}")
    public ResponseEntity<List<ProductResponse>> getProductsByCondition(
            @PathVariable ProductCondition condition) {

        return ResponseEntity.ok(
                productService.getProductsByCondition(condition));
    }
    @GetMapping("/latest")
    public ResponseEntity<List<ProductResponse>> getLatestProducts() {

        return ResponseEntity.ok(
                productService.getLatestProducts());
    }
}