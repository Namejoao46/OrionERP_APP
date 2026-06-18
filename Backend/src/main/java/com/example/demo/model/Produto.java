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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GEN_PRODUTOS_ID")
    @SequenceGenerator(
        name = "GEN_PRODUTOS_ID",
        sequenceName = "GEN_PRODUTOS_ID",
        allocationSize = 1
    )
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

    @Column(precision = 15, scale = 3)
    private BigDecimal estoqueAtual = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal precoCusto;

    @Column(precision = 15, scale = 2)
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