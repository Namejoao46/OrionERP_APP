package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "FORNECEDORES")
@Data
public class Fornecedor {

    @Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GEN_FORNECEDORES_ID")
@SequenceGenerator(
    name = "GEN_FORNECEDORES_ID",
    sequenceName = "GEN_FORNECEDORES_ID",
    allocationSize = 1
)
private Long id;

    @Column(unique = true)
    private String cnpj;

    private String razaoSocial;
    private String nomeFantasia;
    private String inscricaoEstadual;
    private Integer crt;

    private String logradouro;
    private String numero;
    private String bairro;
    private String cidade;
    private String uf;
    private String cep;

    private String email;
    private String telefone;
}