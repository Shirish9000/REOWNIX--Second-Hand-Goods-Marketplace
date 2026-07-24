package com.reownix.product.entity;

import java.time.LocalDateTime;


import com.reownix.product.enums.ProductCondition;
import com.reownix.product.enums.ProductStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length= 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCondition condition;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.PENDING;

    @Column(nullable = false)
    private String location;

    private String imageUrl;

    private String videoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id",nullable=false)
    private Category category;

    @Column(nullable = false)
    private Long sellerId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate()
    {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if(status == null){
            status =ProductStatus.PENDING;
        }
    }
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductImage> images = new ArrayList<>();


}
