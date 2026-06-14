package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "empresas")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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