package com.reownix.product.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CloudinaryService {

    Map<String, Object> uploadFile(MultipartFile file) throws IOException;
    List<Map<String, Object>> uploadFiles(MultipartFile[] files) throws IOException;
    void deleteFile(String publicId) throws IOException;
}