package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.Colaborador;
import com.example.demo.repository.ColaboradorRepository;

@Service
public class gestaoService {

    @Autowired
    private ColaboradorRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Colaborador cadastrarNovoFuncionario(Colaborador novo, Colaborador adminLogado) {
        novo.setEmpresa(adminLogado.getEmpresa());
        novo.setRole("COLABORADOR");
        novo.setSenha(passwordEncoder.encode(novo.getSenha()));
        return repository.save(novo);
    }
}