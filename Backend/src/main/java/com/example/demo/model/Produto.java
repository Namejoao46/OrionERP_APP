package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "PRODUTOS")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigoBarras;

    private String codigoProdutoFornecedor;

    @Column(nullable = false)
    private String descricao;

    private String unidadeMedida;
    private String ncm;
    private String cfop;
    private String cst;

    @Column(nullable = false)
    private String status = "ATIVO";

    private BigDecimal estoqueAtual = BigDecimal.ZERO;
    private BigDecimal precoCusto;
    private BigDecimal precoVenda;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    private LocalDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDateTime.now();
        if (this.status == null) this.status = "ATIVO";
        if (this.estoqueAtual == null) this.estoqueAtual = BigDecimal.ZERO;
    }
}