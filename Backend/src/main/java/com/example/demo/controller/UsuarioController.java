package com.example.demo.controller;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/upload-foto")
    public ResponseEntity<?> uploadFoto(@PathVariable Long id, @RequestBody String base64Foto) {
        return repository.findById(id).map(usuario -> {
            try {
                byte[] fotoBytes = Base64.getDecoder().decode(base64Foto.trim());
                usuario.setFoto(fotoBytes);
                return ResponseEntity.ok("Foto atualizada na memoria!");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Base64 invalido");
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}