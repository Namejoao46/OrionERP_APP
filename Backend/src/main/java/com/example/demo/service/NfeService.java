package com.example.demo.service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;

import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.example.demo.dto.NfePrevia;
import com.example.demo.repository.FornecedorRepository;
import com.example.demo.repository.ProdutoRepository;

@Service
public class NfeService {
    private final FornecedorRepository fornecedorRepository;
    private final ProdutoRepository produtoRepository;

    public NfeService(FornecedorRepository f, ProdutoRepository p) {
        this.fornecedorRepository = f;
        this.produtoRepository = p;
    }

    public NfePrevia lerPrevia(InputStream xmlStream) throws Exception {
        Document doc = parseXml(xmlStream);
        
        // Usando * como namespace para pegar a tag independente do prefixo
        String chave = textoNS("Id", doc);
        String numero = textoNS("nNF", doc);
        String serie = textoNS("serie", doc);

        // ... lógica de totais
        NodeList totais = doc.getElementsByTagNameNS("*", "ICMSTot");
        BigDecimal totalNota = BigDecimal.ZERO;
        if (totais.getLength() > 0) {
            totalNota = parseBD(textoNS("vNF", (Element) totais.item(0)));
        }

        Element emit = (Element) doc.getElementsByTagNameNS("*", "emit").item(0);
        if (emit == null) throw new Exception("Tag <emit> não encontrada.");

        String cnpj = textoNS("CNPJ", emit);
        String razaoSocial = textoNS("xNome", emit);
        String nomeFantasia = textoNS("xFant", emit);
        
        // ... (resto da lógica de produtos igual, usando textoNS e extrairCstNS)
        return new NfePrevia(cnpj, razaoSocial, nomeFantasia, "", "", false, numero, serie, chave, totalNota, new ArrayList<>());
    }

    private Document parseXml(InputStream stream) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true); // Obrigatório para ler NF-e
        return factory.newDocumentBuilder().parse(stream);
    }

    private String textoNS(String tag, Document doc) { return extrairTexto(doc.getElementsByTagNameNS("*", tag)); }
    private String textoNS(String tag, Element el) { return extrairTexto(el.getElementsByTagNameNS("*", tag)); }

    private String extrairTexto(NodeList nl) {
        return (nl.getLength() > 0 && nl.item(0).getFirstChild() != null) ? nl.item(0).getFirstChild().getNodeValue() : "";
    }
    
    private BigDecimal parseBD(String val) {
        return (val == null || val.isBlank()) ? BigDecimal.ZERO : new BigDecimal(val);
    }
    // ... restante dos métodos (confirmarImportacao, etc)
}