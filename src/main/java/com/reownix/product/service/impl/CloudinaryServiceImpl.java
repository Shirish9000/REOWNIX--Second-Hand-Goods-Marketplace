package com.reownix.product.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.reownix.product.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, Object> uploadFile(MultipartFile file) throws IOException {

        return cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );
    }

    @Override
    public List<Map<String, Object>> uploadFiles(MultipartFile[] files) throws IOException {

        List<Map<String, Object>> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {

            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );

            uploadedFiles.add(uploadResult);
        }

        return uploadedFiles;
    }

    @Override
    public void deleteFile(String publicId) throws IOException {

        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.emptyMap()
        );
    }
}