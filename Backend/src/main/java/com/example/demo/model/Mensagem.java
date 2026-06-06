package com.example.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "MENSAGENS")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String remetente;
    private String destinatario;

    @Lob
    private String conteudo;

    private String status;
    private LocalDateTime dataEnvio;
    private String tipoMensagem;

    @Lob
    @Column(name = "arquivo")
    private byte[] arquivo;

    private String nomeArquivo;
    private String tipoArquivo;
    private Long tamanhoArquivo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRemetente() { return remetente; }
    public void setRemetente(String remetente) { this.remetente = remetente; }

    public String getDestinatario() { return destinatario; }
    public void setDestinatario(String destinatario) { this.destinatario = destinatario; }

    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }

    public String getTipoMensagem() { return tipoMensagem; }
    public void setTipoMensagem(String tipoMensagem) { this.tipoMensagem = tipoMensagem; }

    public byte[] getArquivo() { return arquivo; }
    public void setArquivo(byte[] arquivo) { this.arquivo = arquivo; }

    public String getNomeArquivo() { return nomeArquivo; }
    public void setNomeArquivo(String nomeArquivo) { this.nomeArquivo = nomeArquivo; }

    public String getTipoArquivo() { return tipoArquivo; }
    public void setTipoArquivo(String tipoArquivo) { this.tipoArquivo = tipoArquivo; }

    public Long getTamanhoArquivo() { return tamanhoArquivo; }
    public void setTamanhoArquivo(Long tamanhoArquivo) { this.tamanhoArquivo = tamanhoArquivo; }
}