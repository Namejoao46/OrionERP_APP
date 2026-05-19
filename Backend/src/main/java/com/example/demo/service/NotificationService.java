package com.example.demo.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    public void enviarNotificacao(String tokenDestinatario, String titulo, String mensagem) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("to", tokenDestinatario);
            body.put("title", titulo);
            body.put("body", mensagem);
            body.put("sound", "default");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForObject(EXPO_PUSH_URL, request, String.class);
            System.out.println(">>> Notificação enviada para o Expo com sucesso!");

        } catch (RestClientException e) {
            System.out.println(">>> Erro de rede/HTTP ao enviar notificacao: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println(">>> Erro nos parametros da notificacao: " + e.getMessage());
        }
    }
}