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
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GEN_COLABORADORES_ID")
@SequenceGenerator(
    name = "GEN_COLABORADORES_ID",
    sequenceName = "GEN_COLABORADORES_ID",
    allocationSize = 1
)
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
    public Long getId() { return id; }

public String getLogin() { return login; }
public void setLogin(String login) { this.login = login; }

public String getSenha() { return senha; }
public void setSenha(String senha) { this.senha = senha; }

public String getNome() { return nome; }
public void setNome(String nome) { this.nome = nome; }

public String getSobrenome() { return sobrenome; }
public void setSobrenome(String sobrenome) { this.sobrenome = sobrenome; }

public String getCargo() { return cargo; }
public void setCargo(String cargo) { this.cargo = cargo; }

public String getCpf() { return cpf; }
public void setCpf(String cpf) { this.cpf = cpf; }

public String getMatricula() { return matricula; }
public void setMatricula(String matricula) { this.matricula = matricula; }

public String getEndereco() { return endereco; }
public void setEndereco(String endereco) { this.endereco = endereco; }

public String getTipoColaborador() { return tipoColaborador; }
public void setTipoColaborador(String tipoColaborador) { this.tipoColaborador = tipoColaborador; }

public String getRole() { return role; }
public void setRole(String role) { this.role = role; }

public Empresa getEmpresa() { return empresa; }
public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

public byte[] getFoto() { return foto; }
public void setFoto(byte[] foto) { this.foto = foto; }

public LocalDate getDataNascimento() { return dataNascimento; }
public void setDataNascimento(LocalDate dataNascimento) {
    this.dataNascimento = dataNascimento;
}
}