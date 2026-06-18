package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "EMPRESAS")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Empresa {
    
    @Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GEN_EMPRESAS_ID")
@SequenceGenerator(
    name = "GEN_EMPRESAS_ID",
    sequenceName = "GEN_EMPRESAS_ID",
    allocationSize = 1
)
private Long id;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(unique = true, nullable = false)
    private String cnpj;

    private String plano;

    @Lob
    @Column(name = "logo", columnDefinition = "BLOB")
    private byte[] logo;
}