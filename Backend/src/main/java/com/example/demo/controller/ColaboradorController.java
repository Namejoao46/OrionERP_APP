package com.example.demo.controller;

import com.example.demo.model.Colaborador;
import com.example.demo.repository.ColaboradorRepository;
import com.example.demo.service.GestaoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/colaboradores")
@CrossOrigin(origins = "*")
public class ColaboradorController {

    private final ColaboradorRepository repository;
    private final GestaoService gestaoService;

    public ColaboradorController(ColaboradorRepository repository, GestaoService gestaoService) {
        this.repository = repository;
        this.gestaoService = gestaoService;
    }

    @GetMapping("/equipe")
    public ResponseEntity<List<Colaborador>> listarEquipe(
            @AuthenticationPrincipal Colaborador logado) {

        if (logado == null) {
            return ResponseEntity.status(401).build();
        }

        if (logado.getEmpresa() != null && logado.getEmpresa().getId() != null) {
            return ResponseEntity.ok(repository.findAllByEmpresaId(logado.getEmpresa().getId()));
        }

        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping("/{id}/upload-foto")
    public ResponseEntity<String> uploadFoto(
            @PathVariable Long id,
            @RequestParam("foto") MultipartFile arquivo) {

        if (id == null) return ResponseEntity.badRequest().body("ID inválido");

        try {
            Colaborador colaborador = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            colaborador.setFoto(arquivo.getBytes());
            repository.save(colaborador);
            return ResponseEntity.ok("Foto atualizada com sucesso!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erro ao processar arquivo: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/foto")
    public ResponseEntity<byte[]> getFoto(@PathVariable Long id) {
        if (id == null) return ResponseEntity.notFound().build();

        return repository.findById(id)
                .map(c -> {
                    byte[] foto = c.getFoto();
                    if (foto != null) {
                        return ResponseEntity.ok()
                                .contentType(MediaType.IMAGE_JPEG)
                                .body(foto);
                    }
                    return ResponseEntity.notFound().<byte[]>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(
            @RequestBody Colaborador novo,
            @AuthenticationPrincipal Colaborador logado) {

        if (logado == null) return ResponseEntity.status(401).build();

        try {
            Colaborador salvo = gestaoService.cadastrarNovoFuncionario(novo, logado);
            return ResponseEntity.ok(salvo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/atualizar-perfil")
    public ResponseEntity<?> atualizarPerfil(
            @PathVariable Long id,
            @RequestBody Colaborador dadosAtualizados,
            @AuthenticationPrincipal UserDetails usuarioLogado) {

        if (dadosAtualizados == null) {
            return ResponseEntity.badRequest().body("Dados de atualização não fornecidos.");
        }

        try {
            Colaborador colaborador = null;

            if (usuarioLogado != null) {
                colaborador = repository.findByLogin(usuarioLogado.getUsername()).orElse(null);
            }

            if (colaborador == null) {
                colaborador = repository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            }

            byte[] fotoAtual      = colaborador.getFoto();
            String senhaAtual     = colaborador.getSenha();
            String loginAtual     = colaborador.getLogin();
            String roleAtual      = colaborador.getRole();
            var    empresaAtual   = colaborador.getEmpresa();

            colaborador.setNome(dadosAtualizados.getNome());
            colaborador.setSobrenome(dadosAtualizados.getSobrenome());
            colaborador.setCargo(dadosAtualizados.getCargo());
            colaborador.setCpf(dadosAtualizados.getCpf());
            colaborador.setMatricula(dadosAtualizados.getMatricula());
            colaborador.setEndereco(dadosAtualizados.getEndereco());
            colaborador.setTipoColaborador(dadosAtualizados.getTipoColaborador());

            if (dadosAtualizados.getDataNascimento() != null) {
                colaborador.setDataNascimento(dadosAtualizados.getDataNascimento());
            }

            colaborador.setFoto(fotoAtual);
            colaborador.setSenha(senhaAtual);
            colaborador.setLogin(loginAtual);
            colaborador.setRole(roleAtual);
            colaborador.setEmpresa(empresaAtual);

            Colaborador salvo = repository.save(colaborador);
            return ResponseEntity.ok(salvo);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar perfil: " + e.getMessage());
        }
    }
}