package com.reownix.product.repository;

import com.reownix.product.entity.Product;
import com.reownix.product.entity.Category;
import com.reownix.product.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.reownix.product.enums.ProductCondition;
import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long> {


    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByLocationIgnoreCase(String location);

    List<Product> findByTitleContainingIgnoreCase(String keyword);

    List<Product> findBySellerId(Long sellerId);

    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    List<Product> findByCondition(ProductCondition condition);

    List<Product> findTop10ByOrderByCreatedAtDesc();
    long countBySellerId(Long sellerId);

}