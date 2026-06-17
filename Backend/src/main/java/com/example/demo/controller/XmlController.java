package com.example.demo.controller;

import com.example.demo.service.XmlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/xml")
public class XmlController {

    private final XmlService xmlService;

    public XmlController(XmlService xmlService) {
        this.xmlService = xmlService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadXml(@RequestParam("file") MultipartFile arquivo) {
        try {
            xmlService.processarESalvarXml(arquivo);
            return ResponseEntity.ok("Arquivo XML processado e salvo com sucesso!");
        } catch (Exception e) {
            System.out.println("Erro ao processar XML: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erro ao processar o arquivo XML: " + e.getMessage());
        }
    }
}