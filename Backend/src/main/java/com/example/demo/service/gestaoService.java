package com.example.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.Colaborador;
import com.example.demo.repository.ColaboradorRepository;

@Service
public class GestaoService {

    private final ColaboradorRepository repository;
    private final PasswordEncoder passwordEncoder;

    public GestaoService(ColaboradorRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Colaborador cadastrarNovoFuncionario(Colaborador novo, Colaborador adminLogado) {
        novo.setEmpresa(adminLogado.getEmpresa());
        novo.setRole("COLABORADOR");
        novo.setSenha(passwordEncoder.encode(novo.getSenha()));
        return repository.save(novo);
    }
}