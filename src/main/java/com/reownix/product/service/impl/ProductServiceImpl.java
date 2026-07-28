package com.reownix.product.service.impl;



import com.reownix.product.entity.Category;
import com.reownix.product.entity.Product;
import com.reownix.product.enums.ProductStatus;
import com.reownix.product.exception.CategoryNotFoundException;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.mapper.ProductMapper;
import com.reownix.product.repository.CategoryRepository;
import com.reownix.product.repository.ProductRepository;
import com.reownix.product.request.ProductRequest;
import com.reownix.product.response.ProductResponse;
import com.reownix.product.service.ProductService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.StreamSupport.stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.reownix.product.enums.ProductCondition;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    private final ProductMapper productMapper;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        long totalProducts = productRepository.countBySellerId(request.getSellerId());

        if (totalProducts >= 10) {
            throw new RuntimeException(
                    "Free product limit reached. Upgrade to Premium.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));



        Product product = productMapper.toEntity(request, category);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->new  ProductNotFoundException("Product Not Found"));

        return productMapper.toResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));



        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCondition(request.getCondition());
        product.setLocation(request.getLocation());
        product.setImageUrl(request.getImageUrl());
        product.setVideoUrl(request.getVideoUrl());
        product.setCategory(category);
//        product.setSeller(seller);

        Product updatedProduct = productRepository.save(product);

        return productMapper.toResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return productRepository.findByCategoryId(category.getId())
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {

        return productRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByLocation(String location) {

        return productRepository.findByLocationIgnoreCase(location)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<ProductResponse> getProductsBySeller(Long sellerId) {

        return productRepository.findBySellerId(sellerId)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductResponse> getAllProducts(int page,
                                                int size,
                                                String sortBy) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(sortBy).ascending());

        return productRepository
                .findAll(pageable)
                .map(productMapper::toResponse);
    }
    @Override
    public List<ProductResponse> getProductsByPriceRange(Double minPrice,
                                                         Double maxPrice) {

        return productRepository.findByPriceBetween(minPrice, maxPrice)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<ProductResponse> getApprovedProducts() {

        return productRepository.findByStatus(ProductStatus.APPROVED)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse approveProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        product.setStatus(ProductStatus.APPROVED);

        Product updatedProduct = productRepository.save(product);

        return productMapper.toResponse(updatedProduct);
    }

    @Override
    public ProductResponse rejectProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        product.setStatus(ProductStatus.REJECTED);

        Product updatedProduct = productRepository.save(product);

        return productMapper.toResponse(updatedProduct);
    }
    @Override
    public List<ProductResponse> getProductsByCondition(ProductCondition condition) {

        return productRepository.findByCondition(condition)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<ProductResponse> getLatestProducts() {

        return productRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }


}