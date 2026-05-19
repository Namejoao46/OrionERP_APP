package com.example.demo.controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.NotificationService;

@RestController
@RequestMapping("/api/mensagens")
@CrossOrigin(origins = "*")
public class MensagemController {

    @Autowired
    private NotificationService notificationService;

    private static final Map<String, String> tokensUsuarios = new ConcurrentHashMap<>();

    @PostMapping("/registrar-token")
    public ResponseEntity<?> registrarToken(@RequestBody Map<String, String> payload) {
        String usuario = payload.get("username");
        String token = payload.get("token");

        if (usuario != null && token != null) {
            tokensUsuarios.put(usuario, token);
            System.out.println(">>> Token registrado para " + usuario + ": " + token);
            return ResponseEntity.ok(Map.of("status", "Token registrado com sucesso!"));
        }
        return ResponseEntity.badRequest().body(Map.of("erro", "Dados inválidos"));
    }

    @PostMapping("/enviar")
    public ResponseEntity<?> enviarMensagem(@RequestBody Map<String, String> payload) {
        String remetente = payload.get("remetente");       
        String destinatario = payload.get("destinatario"); 
        String mensagem = payload.get("mensagem");         

        String tokenDestinatario = tokensUsuarios.get(destinatario);

        if (tokenDestinatario != null) {
            String tituloNotificacao = "Nova mensagem de " + remetente;
            notificationService.enviarNotificacao(tokenDestinatario, tituloNotificacao, mensagem);
            return ResponseEntity.ok(Map.of("status", "Notificação enviada!"));
        } else {
            System.out.println(">>> Usuário " + destinatario + " não está online ou não registrou o token.");
            return ResponseEntity.status(404).body(Map.of("erro", "Destinatário não encontrado ou offline"));
        }
    }
}