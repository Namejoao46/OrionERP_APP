package com.example.demo.repository;

import com.example.demo.model.Usuario;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final List<Usuario> usuariosEmMemoria = new ArrayList<>();

    public Usuario save(Usuario usuario) {
        usuariosEmMemoria.add(usuario);
        return usuario;
    }

    public Optional<Usuario> findByLogin(String login) {
        return usuariosEmMemoria.stream()
                .filter(u -> u.getLogin().equalsIgnoreCase(login))
                .findFirst();
    }

    public Optional<Usuario> findById(Long id) {
        return usuariosEmMemoria.stream()
                .filter(u -> u.getId() != null && u.getId().equals(id))
                .findFirst();
    }
}