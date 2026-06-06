package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.demo.model.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    List<Mensagem> findByDestinatarioAndStatus(String destinatario, String status);

    long countByDestinatarioAndStatus(String destinatario, String status);

    @Modifying
    @Query("UPDATE Mensagem m SET m.status = 'LIDA' WHERE m.id = :id")
    void marcarComoLida(@Param("id") Long id);

    List<Mensagem> findByRemetenteAndDestinatario(String remetente, String destinatario);

    List<Mensagem> findByDestinatarioOrderByDataEnvioDesc(String destinatario);

    @Query("SELECT m FROM Mensagem m WHERE m.remetente = :usuario OR m.destinatario = :usuario ORDER BY m.dataEnvio DESC")
    List<Mensagem> findTodasMinhasMensagens(@Param("usuario") String usuario);

    @Query("SELECT m FROM Mensagem m WHERE (m.remetente = :usuario OR m.destinatario = :usuario) AND m.tipoMensagem IN ('FOTO', 'ARQUIVO') ORDER BY m.dataEnvio DESC")
    List<Mensagem> findArquivosDoUsuario(@Param("usuario") String usuario);

    @Query("SELECT m FROM Mensagem m WHERE (m.remetente = :usuario OR m.destinatario = :usuario) AND m.tipoMensagem = :tipo ORDER BY m.dataEnvio DESC")
    List<Mensagem> findByUsuarioAndTipo(@Param("usuario") String usuario, @Param("tipo") String tipo);
}