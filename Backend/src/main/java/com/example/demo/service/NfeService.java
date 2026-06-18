package com.example.demo.service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.example.demo.dto.ItemNfePrevia;
import com.example.demo.dto.NfePrevia;
import com.example.demo.repository.FornecedorRepository;
import com.example.demo.repository.ProdutoRepository;

@Service
public class NfeService {

    private final FornecedorRepository fornecedorRepository;
    private final ProdutoRepository produtoRepository;

    public NfeService(FornecedorRepository fornecedorRepository, ProdutoRepository produtoRepository) {
        this.fornecedorRepository = fornecedorRepository;
        this.produtoRepository = produtoRepository;
    }

    public NfePrevia lerPrevia(InputStream xmlStream) throws Exception {
        Document doc = parseXml(xmlStream);

        Element infNFe = primeiro(doc, "infNFe");
        if (infNFe == null) {
            throw new Exception("Tag <infNFe> não encontrada. XML inválido para NF-e.");
        }

        String chave = infNFe.getAttribute("Id");
        if (chave != null && chave.startsWith("NFe")) {
            chave = chave.substring(3);
        }

        String numero = texto(doc, "nNF");
        String serie = texto(doc, "serie");

        Element emit = primeiro(doc, "emit");
        if (emit == null) {
            throw new Exception("Tag <emit> não encontrada.");
        }

        String cnpj = texto(emit, "CNPJ");
        String razaoSocial = texto(emit, "xNome");
        String nomeFantasia = texto(emit, "xFant");

        Element enderEmit = primeiro(emit, "enderEmit");
        String uf = enderEmit != null ? texto(enderEmit, "UF") : "";
        String cidade = enderEmit != null ? texto(enderEmit, "xMun") : "";

        BigDecimal valorTotalNota = BigDecimal.ZERO;
        Element icmsTot = primeiro(doc, "ICMSTot");
        if (icmsTot != null) {
            valorTotalNota = parseBD(texto(icmsTot, "vNF"));
        }

        boolean fornecedorJaCadastrado = cnpj != null
                && !cnpj.isBlank()
                && fornecedorRepository.existsByCnpj(cnpj);

        List<ItemNfePrevia> itens = new ArrayList<>();

        NodeList dets = doc.getElementsByTagNameNS("*", "det");

        for (int i = 0; i < dets.getLength(); i++) {
            Element det = (Element) dets.item(i);
            Element prod = primeiro(det, "prod");

            if (prod == null) continue;

            String codigoFornecedor = texto(prod, "cProd");
            String descricao = texto(prod, "xProd");
            String ncm = texto(prod, "NCM");
            String cfop = texto(prod, "CFOP");
            String unidade = texto(prod, "uCom");
            BigDecimal quantidade = parseBD(texto(prod, "qCom"));
            BigDecimal valorUnitario = parseBD(texto(prod, "vUnCom"));
            BigDecimal valorTotal = parseBD(texto(prod, "vProd"));
            String cst = extrairCst(det);

            boolean jaExiste = codigoFornecedor != null
                    && !codigoFornecedor.isBlank()
                    && produtoRepository.findByCodigoProdutoFornecedor(codigoFornecedor).isPresent();

            itens.add(new ItemNfePrevia(
                    codigoFornecedor,
                    descricao,
                    ncm,
                    cfop,
                    cst,
                    unidade,
                    quantidade,
                    valorUnitario,
                    valorTotal,
                    jaExiste
            ));
        }

        return new NfePrevia(
                cnpj,
                razaoSocial,
                nomeFantasia,
                uf,
                cidade,
                fornecedorJaCadastrado,
                numero,
                serie,
                chave,
                valorTotalNota,
                itens
        );
    }

    private Document parseXml(InputStream stream) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);

        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");

        Document doc = factory.newDocumentBuilder().parse(stream);
        doc.getDocumentElement().normalize();
        return doc;
    }

    private Element primeiro(Document doc, String tag) {
        NodeList lista = doc.getElementsByTagNameNS("*", tag);
        return lista.getLength() > 0 ? (Element) lista.item(0) : null;
    }

    private Element primeiro(Element el, String tag) {
        NodeList lista = el.getElementsByTagNameNS("*", tag);
        return lista.getLength() > 0 ? (Element) lista.item(0) : null;
    }

    private String texto(Document doc, String tag) {
        Element el = primeiro(doc, tag);
        return el != null ? el.getTextContent().trim() : "";
    }

    private String texto(Element el, String tag) {
        Element filho = primeiro(el, tag);
        return filho != null ? filho.getTextContent().trim() : "";
    }

    private BigDecimal parseBD(String valor) {
        if (valor == null || valor.isBlank()) return BigDecimal.ZERO;
        return new BigDecimal(valor.trim().replace(",", "."));
    }

    private String extrairCst(Element det) {
        NodeList cstList = det.getElementsByTagNameNS("*", "CST");
        if (cstList.getLength() > 0) {
            return cstList.item(0).getTextContent().trim();
        }

        NodeList csosnList = det.getElementsByTagNameNS("*", "CSOSN");
        if (csosnList.getLength() > 0) {
            return csosnList.item(0).getTextContent().trim();
        }

        return "";
    }
}