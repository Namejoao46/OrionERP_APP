package com.example.demo.controller;

import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String user = payload.get("username");
        String pass = payload.get("password");

        return repository.findByLogin(user)
            .filter(u -> u.getSenha().equals(pass))
            .map(u -> ResponseEntity.ok().body(Map.of("status", "sucesso")))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("status", "erro")));
    }

        @PostMapping("/{id}/upload-foto")
    public ResponseEntity<?> uploadFoto(@PathVariable Long id, @RequestBody String base64Foto) {
        return repository.findById(id).map(usuario -> {
            usuario.setFoto(Base64.getDecoder().decode(base64Foto));
            repository.save(usuario);
            return ResponseEntity.ok("Foto atualizada!");
        }).orElse(ResponseEntity.notFound().build());
}
}