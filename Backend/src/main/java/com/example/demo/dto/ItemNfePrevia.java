package com.example.demo.dto;

import java.math.BigDecimal;

public record ItemNfePrevia(
    String codigoProdutoFornecedor,
    String descricao,
    String ncm,
    String cfop,
    String cst,
    String unidadeComercial,
    BigDecimal quantidade,
    BigDecimal valorUnitario,
    BigDecimal valorTotal,
    boolean jaExisteNoBanco 
) {}