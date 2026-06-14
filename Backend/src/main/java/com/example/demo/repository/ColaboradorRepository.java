package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Colaborador;
import java.util.List;
import java.util.Optional;

@Repository
public interface ColaboradorRepository extends JpaRepository<Colaborador, Long> {
    
    boolean existsByLogin(String login);

    @Query("SELECT c FROM Colaborador c LEFT JOIN FETCH c.empresa WHERE c.login = :login")
    Optional<Colaborador> findByLogin(@Param("login") String login);
    
    List<Colaborador> findAllByEmpresaId(Long empresaId);
}