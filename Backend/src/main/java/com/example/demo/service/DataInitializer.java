package com.example.demo.service;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Colaborador;
import com.example.demo.model.Empresa;
import com.example.demo.repository.ColaboradorRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ColaboradorRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        Empresa empresa = entityManager.createQuery("SELECT e FROM Empresa e", Empresa.class)
                .getResultStream()
                .findFirst()
                .orElseGet(() -> {
                    Empresa e = new Empresa();
                    e.setNomeFantasia("OrionERP");
                    e.setCnpj("00000000000000");
                    e.setPlano("MASTER");
                    entityManager.persist(e);
                    return e;
                });
        
        Colaborador admin = repository.findByLogin("admin").orElse(null);
        
        if (admin == null) {
            admin = new Colaborador();
            admin.setLogin("admin");
            admin.setSenha(passwordEncoder.encode("123"));
        }
        
        admin.setNome("Leandro");
        admin.setSobrenome("Brito");
        admin.setCargo("Administrador");
        admin.setCpf("000.000.000-00");
        admin.setMatricula("ORION-001");
        admin.setDataNascimento(LocalDate.of(2005, 8, 23));
        admin.setTipoColaborador("FULLSTACK");
        admin.setRole("ADMIN_DEV");
        admin.setEmpresa(empresa);

        carregarFoto(admin, "images/admin1.jpeg");
        repository.save(admin);

        Colaborador jp = repository.findByLogin("admin2").orElse(null);
        
        if (jp == null) {
            jp = new Colaborador();
            jp.setLogin("admin2");
            jp.setSenha(passwordEncoder.encode("456"));
        }

        jp.setNome("João");
        jp.setSobrenome("Paulo");
        jp.setCargo("Administrador");
        jp.setCpf("111.111.111-11"); 
        jp.setMatricula("ORION-002");
        jp.setDataNascimento(LocalDate.of(1995, 5, 20));
        jp.setTipoColaborador("FULLSTACK");
        jp.setRole("ADMIN_DEV");
        jp.setEmpresa(empresa);

        carregarFoto(jp, "images/admin2.jpg");
        repository.save(jp);

        Colaborador admin3 = repository.findByLogin("admin3").orElse(null);

if (admin3 == null) {
    admin3 = new Colaborador();
    admin3.setLogin("admin3");
    admin3.setSenha(passwordEncoder.encode("789"));
}

    admin3.setNome("Jenifer");
    admin3.setSobrenome("Montalvao");
    admin3.setCargo("Gerente de Projetos");
    admin3.setCpf("222.222.222-22");
    admin3.setMatricula("ORION-003");
    admin3.setDataNascimento(LocalDate.of(1998, 1, 1));
    admin3.setTipoColaborador("GESTAO");
    admin3.setRole("ADMIN_DEV");
    admin3.setEmpresa(empresa);

    carregarFoto(admin3, "images/admin3.jpeg");

    repository.save(admin3);
        
        System.out.println(">>> Perfis OrionERP carregados no Firebird! <<<");
    }

    private void carregarFoto(Colaborador colaborador, String caminho) {
        try {
            byte[] foto = new ClassPathResource(caminho).getInputStream().readAllBytes();
            colaborador.setFoto(foto);
        } catch (IOException | IllegalArgumentException e) { 
            System.out.println(">>> Aviso: Foto não encontrada em resources/" + caminho);
        }
    }
}