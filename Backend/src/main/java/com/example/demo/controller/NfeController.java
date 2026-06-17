package com.example.demo.controller;

import com.example.demo.dto.NfePrevia;
import com.example.demo.service.NfeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/nfe")
public class NfeController {

    @Autowired 
    private NfeService nfeService;

    @PostMapping("/previa")
    public ResponseEntity<?> lerPrevia(@RequestParam("xml") MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Arquivo vazio"));
        }
        try {
            NfePrevia previa = nfeService.lerPrevia(arquivo.getInputStream());
            return ResponseEntity.ok(previa);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro no XML: " + e.getMessage()));
        }
    }
}