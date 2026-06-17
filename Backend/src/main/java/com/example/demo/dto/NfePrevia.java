package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;

public record NfePrevia(
    String cnpjFornecedor,
    String razaoSocial,
    String nomeFantasia,
    String uf,
    String cidade,
    boolean fornecedorJaCadastrado,

    String numeroNota,
    String serie,
    String chaveAcesso,
    BigDecimal valorTotalNota,

    // Itens
    List<ItemNfePrevia> itens
) {}