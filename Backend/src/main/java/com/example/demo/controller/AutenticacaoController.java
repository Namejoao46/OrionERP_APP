package com.example.demo.controller;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.demo.model.Colaborador;
import com.example.demo.repository.ColaboradorRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AutenticacaoController {

    @Autowired
    private ColaboradorRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${api.security.token.secret}")
    private String secret;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        String login = dados.get("login");
        String senha = dados.get("senha");

        Colaborador colaborador = repository.findByLogin(login).orElse(null);

        if (colaborador != null && passwordEncoder.matches(senha, colaborador.getSenha())) {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            String token = JWT.create()
                    .withIssuer("API OrionERP")
                    .withSubject(colaborador.getLogin())
                    .withExpiresAt(LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00")))
                    .sign(algoritmo);

            Map<String, Object> resposta = new HashMap<>();

            resposta.put("id", colaborador.getId());
            resposta.put("token", token);
            resposta.put("login", colaborador.getLogin());
            resposta.put("nome", colaborador.getNome());
            resposta.put("sobrenome", colaborador.getSobrenome());
            resposta.put("role", colaborador.getRole());

            resposta.put("cargo", colaborador.getCargo());
            resposta.put("cpf", colaborador.getCpf());
            resposta.put("matricula", colaborador.getMatricula());
            resposta.put("endereco", colaborador.getEndereco());
            resposta.put("tipoColaborador", colaborador.getTipoColaborador());
            resposta.put("dataNascimento",
                    colaborador.getDataNascimento() != null
                            ? colaborador.getDataNascimento().toString()
                            : null);

            resposta.put("foto",
                    colaborador.getFoto() != null
                            ? Base64.getEncoder().encodeToString(colaborador.getFoto())
                            : null);

            if (colaborador.getEmpresa() != null) {
                resposta.put("empresaId", colaborador.getEmpresa().getId());
            } else {
                resposta.put("empresaId", null);
            }

            return ResponseEntity.ok(resposta);
        }

        return ResponseEntity.status(403).body("Credenciais inválidas");
    }
}