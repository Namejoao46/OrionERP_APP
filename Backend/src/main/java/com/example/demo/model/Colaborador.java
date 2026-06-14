package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "COLABORADORES")
public class Colaborador implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha;

    private String nome;
    private String sobrenome;
    private LocalDate dataNascimento;
    private String cpf;
    private String matricula;
    private String cargo;
    private String endereco;
    private String tipoColaborador;

    private String role = "COLABORADOR";

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @Lob
    @Column(name = "foto", columnDefinition = "BLOB")
    private byte[] foto;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == null) return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        return List.of(
            new SimpleGrantedAuthority("ROLE_" + this.role.toUpperCase()), 
            new SimpleGrantedAuthority("ROLE_USER")
        );
    }

    @Override public String getPassword() { return this.senha; }
    @Override public String getUsername() { return this.login; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}