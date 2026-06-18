package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "REGISTROS_XML")
public class RegistroXml {

    @Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GEN_REGISTROS_XML_ID")
@SequenceGenerator(
    name = "GEN_REGISTROS_XML_ID",
    sequenceName = "GEN_REGISTROS_XML_ID",
    allocationSize = 1
)
private Long id;

    @Lob 
    private String dadosXml; 

    private String fornecedor;
    private String produto;
    private Integer quantidade;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDadosXml() { return dadosXml; }
    public void setDadosXml(String dadosXml) { this.dadosXml = dadosXml; }

    public String getFornecedor() { return fornecedor; }
    public void setFornecedor(String fornecedor) { this.fornecedor = fornecedor; }

    public String getProduto() { return produto; }
    public void setProduto(String produto) { this.produto = produto; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
}