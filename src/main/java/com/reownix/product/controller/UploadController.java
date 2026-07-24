package com.reownix.product.controller;

import com.reownix.product.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        Map<String, Object> response = cloudinaryService.uploadFile(file);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteImage(
            @RequestParam("publicId") String publicId) throws IOException {

        cloudinaryService.deleteFile(publicId);

        return ResponseEntity.ok("Image Deleted Successfully");
    }
    @PostMapping("/images")
    public ResponseEntity<List<Map<String, Object>>> uploadImages(
            @RequestParam("files") MultipartFile[] files) throws IOException {

        List<Map<String, Object>> response =
                cloudinaryService.uploadFiles(files);

        return ResponseEntity.ok(response);
    }
}