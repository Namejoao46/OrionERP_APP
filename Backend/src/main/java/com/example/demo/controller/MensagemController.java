package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Mensagem;
import com.example.demo.repository.MensagemRepository;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {

    private static final long TAMANHO_MAXIMO = 20 * 1024 * 1024;

    @Autowired
    private MensagemRepository mensagemRepository;

    @PostMapping("/enviar")
    public ResponseEntity<?> enviarTexto(
            @RequestParam("remetente") String remetente,
            @RequestParam("destinatario") String destinatario,
            @RequestParam("conteudo") String conteudo) {

        Mensagem mensagem = new Mensagem();
        mensagem.setRemetente(remetente);
        mensagem.setDestinatario(destinatario);
        mensagem.setConteudo(conteudo);
        mensagem.setTipoMensagem("TEXTO");
        mensagem.setStatus("PENDENTE");
        mensagem.setDataEnvio(LocalDateTime.now());

        return ResponseEntity.ok(mensagemRepository.save(mensagem));
    }

    @PostMapping("/enviar/arquivo")
    public ResponseEntity<?> enviarArquivo(
            @RequestParam("remetente") String remetente,
            @RequestParam("destinatario") String destinatario,
            @RequestParam(value = "conteudo", required = false) String conteudo,
            @RequestParam("arquivo") MultipartFile arquivo) {

        if (arquivo.isEmpty()) {
            return ResponseEntity.badRequest().body("Arquivo não pode ser vazio.");
        }

        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            return ResponseEntity.badRequest().body("Arquivo excede o limite de 20MB.");
        }

        try {
            String contentType = arquivo.getContentType();
            String tipo = resolverTipo(contentType);

            Mensagem mensagem = new Mensagem();
            mensagem.setRemetente(remetente);
            mensagem.setDestinatario(destinatario);
            mensagem.setConteudo(conteudo);
            mensagem.setTipoMensagem(tipo);
            mensagem.setStatus("PENDENTE");
            mensagem.setDataEnvio(LocalDateTime.now());
            mensagem.setArquivo(arquivo.getBytes());
            mensagem.setNomeArquivo(arquivo.getOriginalFilename());
            mensagem.setTipoArquivo(contentType);
            mensagem.setTamanhoArquivo(arquivo.getSize());

            return ResponseEntity.ok(mensagemRepository.save(mensagem));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao processar arquivo: " + e.getMessage());
        }
    }

    @GetMapping("/conversa")
    public ResponseEntity<List<Mensagem>> conversa(
            @RequestParam("usuario1") String usuario1,
            @RequestParam("usuario2") String usuario2) {

        List<Mensagem> ida = mensagemRepository.findByRemetenteAndDestinatario(usuario1, usuario2);
        List<Mensagem> volta = mensagemRepository.findByRemetenteAndDestinatario(usuario2, usuario1);
        ida.addAll(volta);
        ida.sort((a, b) -> a.getDataEnvio().compareTo(b.getDataEnvio()));

        return ResponseEntity.ok(ida);
    }

    @GetMapping("/inbox/{usuario}")
    public ResponseEntity<List<Mensagem>> inbox(@PathVariable String usuario) {
        return ResponseEntity.ok(mensagemRepository.findTodasMinhasMensagens(usuario));
    }

    @GetMapping("/pendentes/{usuario}")
    public ResponseEntity<List<Mensagem>> pendentes(@PathVariable String usuario) {
        return ResponseEntity.ok(mensagemRepository.findByDestinatarioAndStatus(usuario, "PENDENTE"));
    }

    @GetMapping("/nao-lidas/{usuario}")
    public ResponseEntity<Map<String, Long>> naoLidas(@PathVariable String usuario) {
        long total = mensagemRepository.countByDestinatarioAndStatus(usuario, "PENDENTE");
        Map<String, Long> resposta = new HashMap<>();
        resposta.put("naoLidas", total);
        return ResponseEntity.ok(resposta);
    }

    @Transactional
    @PostMapping("/marcar-lida/{id}")
    public ResponseEntity<?> marcarComoLida(@PathVariable Long id) {
        mensagemRepository.marcarComoLida(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/arquivo/{id}")
    public ResponseEntity<byte[]> baixarArquivo(@PathVariable Long id) {
        return mensagemRepository.findById(id).map(m -> {
            if (m.getArquivo() == null) {
                return ResponseEntity.notFound().<byte[]>build();
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + m.getNomeArquivo() + "\"")
                    .contentType(MediaType.parseMediaType(m.getTipoArquivo()))
                    .body(m.getArquivo());
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/arquivos/{usuario}")
    public ResponseEntity<List<Mensagem>> listarArquivos(@PathVariable String usuario) {
        return ResponseEntity.ok(mensagemRepository.findArquivosDoUsuario(usuario));
    }

    private String resolverTipo(String contentType) {
        if (contentType == null) return "ARQUIVO";
        if (contentType.startsWith("image/")) return "FOTO";
        if (contentType.startsWith("video/")) return "VIDEO";
        if (contentType.startsWith("audio/")) return "AUDIO";
        return "ARQUIVO";
    }
}