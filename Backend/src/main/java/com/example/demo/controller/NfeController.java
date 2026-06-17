package com.example.demo.controller;

import com.example.demo.dto.NfePrevia;
import com.example.demo.model.Fornecedor;
import com.example.demo.model.Produto;
import com.example.demo.repository.FornecedorRepository;
import com.example.demo.repository.ProdutoRepository;
import com.example.demo.service.NfeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nfe")
@CrossOrigin(origins = "*")
public class NfeController {

    @Autowired private NfeService nfeService;
    @Autowired private FornecedorRepository fornecedorRepository;
    @Autowired private ProdutoRepository produtoRepository;

    @PostMapping("/previa")
    public ResponseEntity<?> lerPrevia(@RequestParam("xml") MultipartFile arquivo) {
        if (arquivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Arquivo XML não enviado."));
        }
        try {
            NfePrevia previa = nfeService.lerPrevia(arquivo.getInputStream());
            return ResponseEntity.ok(previa);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao ler XML: " + e.getMessage()));
        }
    }

    @PostMapping("/confirmar")
    public ResponseEntity<?> confirmar(@RequestBody NfePrevia previa) {
        try {
            NfeService.ImportacaoResultado resultado = nfeService.confirmarImportacao(previa);
            return ResponseEntity.ok(Map.of(
                "mensagem",           "Importação concluída com sucesso!",
                "fornecedoresNovos",  resultado.fornecedoresNovos(),
                "produtosNovos",      resultado.produtosNovos(),
                "produtosAtualizados",resultado.produtosAtualizados()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/fornecedores")
    public List<Fornecedor> listarFornecedores() {
        return fornecedorRepository.findAll();
    }

    @GetMapping("/produtos")
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    @GetMapping("/produtos/buscar")
    public List<Produto> buscarProdutos(@RequestParam String termo) {
        return produtoRepository.buscarPorDescricao(termo);
    }
}