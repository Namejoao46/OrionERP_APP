package com.example.demo.service;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public void run(String... args) throws Exception {
        
        Usuario admin = repository.findByLogin("admin").orElse(null);
        
        if (admin == null) {
            admin = new Usuario();
            admin.setLogin("admin");
            admin.setSenha("123");
        }
        
        admin.setNome("Leandro");
        admin.setSobrenome("Brito");
        admin.setCargo("Administrador");
        admin.setCpf("000.000.000-00");
        admin.setMatricula("ORION-001");
        admin.setDataNascimento(LocalDate.of(2005, 8, 23));
        admin.setTipoColaborador("FULLSTACK");

        carregarFoto(admin, "images/admin1.jpeg");
        repository.save(admin);

        Usuario jp = repository.findByLogin("admin2").orElse(null);
        
        if (jp == null) {
            jp = new Usuario();
            jp.setLogin("admin2");
            jp.setSenha("456");
        }

        jp.setNome("João");
        jp.setSobrenome("Paulo");
        jp.setCargo("Administrador");
        jp.setCpf("111.111.111-11"); 
        jp.setMatricula("ORION-002");
        jp.setDataNascimento(LocalDate.of(1995, 5, 20));
        jp.setTipoColaborador("FULLSTACK");

        carregarFoto(jp, "images/admin2.jpg");
        repository.save(jp);

        System.out.println(">>> Perfis OrionERP carregados no Firebird! <<<");
    }

    private void carregarFoto(Usuario usuario, String caminho) {
        try {
            byte[] foto = new ClassPathResource(caminho).getInputStream().readAllBytes();
            usuario.setFoto(foto);
        } catch (IOException | IllegalArgumentException e) { 
            System.out.println(">>> Aviso: Foto não encontrada em resources/" + caminho);
        }
    }
}