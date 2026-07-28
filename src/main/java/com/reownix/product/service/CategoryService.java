package com.reownix.product.service;

import com.reownix.product.request.CategoryRequest;
import com.reownix.product.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    // Create Category
    CategoryResponse createCategory(CategoryRequest request);

    // Get All Categories
    List<CategoryResponse> getAllCategories();

    // Get Category By Id
    CategoryResponse getCategoryById(Long id);

    // Update Category
    CategoryResponse updateCategory(Long id, CategoryRequest request);

    // Delete Category
    void deleteCategory(Long id);
}