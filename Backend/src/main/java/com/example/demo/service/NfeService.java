package com.example.demo.service;

import com.example.demo.dto.ItemNfePrevia;
import com.example.demo.dto.NfePrevia;
import com.example.demo.model.Fornecedor;
import com.example.demo.model.Produto;
import com.example.demo.repository.FornecedorRepository;
import com.example.demo.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NfeService {

    private final FornecedorRepository fornecedorRepository;
    private final ProdutoRepository produtoRepository;

    public NfeService(
            FornecedorRepository fornecedorRepository,
            ProdutoRepository produtoRepository
    ) {
        this.fornecedorRepository = fornecedorRepository;
        this.produtoRepository = produtoRepository;
    }
    
    public NfePrevia lerPrevia(InputStream xmlStream) throws Exception {
        Document doc = parseXml(xmlStream);

        String chave   = texto("Id",    doc);
        if (chave != null && chave.startsWith("NFe")) chave = chave.substring(3);

        String numero  = texto("nNF",   doc);
        String serie   = texto("serie", doc);

        BigDecimal totalNota = BigDecimal.ZERO;
        NodeList totais = doc.getElementsByTagName("ICMSTot");
        if (totais.getLength() > 0) {
            String vNF = texto("vNF", (Element) totais.item(0));
            if (vNF != null && !vNF.isBlank()) totalNota = new BigDecimal(vNF);
        }

        Element emit = (Element) doc.getElementsByTagName("emit").item(0);
        if (emit == null) throw new Exception("Tag <emit> não encontrada no XML.");

        String cnpj         = texto("CNPJ",  emit);
        String razaoSocial  = texto("xNome", emit);
        String nomeFantasia = texto("xFant", emit);

        String uf = "", cidade = "";
        Element ender = (Element) emit.getElementsByTagName("enderEmit").item(0);
        if (ender != null) {
            uf     = texto("UF",   ender);
            cidade = texto("xMun", ender);
        }

        boolean fornecedorJaCadastrado = fornecedorRepository.existsByCnpj(cnpj);

        NodeList detList = doc.getElementsByTagName("det");
        List<ItemNfePrevia> itens = new ArrayList<>();

        for (int i = 0; i < detList.getLength(); i++) {
            Element det  = (Element) detList.item(i);
            Element prod = (Element) det.getElementsByTagName("prod").item(0);
            if (prod == null) continue;

            String codigo   = texto("cProd",   prod);
            String descricao= texto("xProd",   prod);
            String ncm      = texto("NCM",     prod);
            String cfop     = texto("CFOP",    prod);
            String uc       = texto("uCom",    prod);
            String cst      = extrairCst(det);

            BigDecimal qtd  = parseBD(texto("qCom",  prod));
            BigDecimal vUnit = parseBD(texto("vUnCom",prod));
            BigDecimal vTotal= parseBD(texto("vProd", prod));

            boolean jaExiste = produtoRepository.findByCodigoProdutoFornecedor(codigo).isPresent();

            itens.add(new ItemNfePrevia(codigo, descricao, ncm, cfop, cst, uc, qtd, vUnit, vTotal, jaExiste));
        }

        return new NfePrevia(
            cnpj, razaoSocial, nomeFantasia, uf, cidade, fornecedorJaCadastrado,
            numero, serie, chave, totalNota, itens
        );
    }

    @Transactional
    public ImportacaoResultado confirmarImportacao(NfePrevia previa) {
        int fornecedoresNovos = 0;
        int produtosNovos     = 0;
        int produtosAtualizados = 0;

        Fornecedor fornecedor = fornecedorRepository.findByCnpj(previa.cnpjFornecedor())
            .orElseGet(() -> {
                Fornecedor novo = new Fornecedor();
                novo.setCnpj(previa.cnpjFornecedor());
                return novo;
            });

        boolean eraNovo = fornecedor.getId() == null;
        fornecedor.setRazaoSocial(previa.razaoSocial());
        fornecedor.setNomeFantasia(previa.nomeFantasia());
        fornecedor.setUf(previa.uf());
        fornecedor.setCidade(previa.cidade());
        fornecedor = fornecedorRepository.save(fornecedor);
        if (eraNovo) fornecedoresNovos++;

        for (ItemNfePrevia item : previa.itens()) {
            Optional<Produto> existente =
                produtoRepository.findByCodigoProdutoFornecedor(item.codigoProdutoFornecedor());

            Produto produto = existente.orElseGet(Produto::new);
            boolean eraNovoP = produto.getId() == null;

            produto.setCodigoProdutoFornecedor(item.codigoProdutoFornecedor());
            produto.setDescricao(item.descricao());
            produto.setNcm(item.ncm());
            produto.setCfop(item.cfop());
            produto.setCst(item.cst());
            produto.setUnidadeMedida(item.unidadeComercial());
            produto.setPrecoCusto(item.valorUnitario());
            produto.setFornecedor(fornecedor);

            if (eraNovoP) {
                produto.setEstoqueAtual(item.quantidade());
            }

            produtoRepository.save(produto);
            if (eraNovoP) produtosNovos++; else produtosAtualizados++;
        }

        return new ImportacaoResultado(fornecedoresNovos, produtosNovos, produtosAtualizados);
    }
    private Document parseXml(InputStream stream) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setNamespaceAware(false);
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(stream);
    }

    private String texto(String tag, Document doc) {
        NodeList nl = doc.getElementsByTagName(tag);
        return extrairTexto(nl);
    }

    private String texto(String tag, Element el) {
        NodeList nl = el.getElementsByTagName(tag);
        return extrairTexto(nl);
    }

    private String extrairTexto(NodeList nl) {
        if (nl.getLength() > 0 && nl.item(0).getChildNodes().getLength() > 0) {
            return nl.item(0).getChildNodes().item(0).getNodeValue();
        }
        return "";
    }

    private String extrairCst(Element det) {
        String[] tags = {"CST", "CSOSN"};
        for (String t : tags) {
            NodeList nl = det.getElementsByTagName(t);
            if (nl.getLength() > 0) {
                String v = extrairTexto(nl);
                if (v != null && !v.isBlank()) return v;
            }
        }
        return "";
    }

    private BigDecimal parseBD(String val) {
        try {
            if (val == null || val.isBlank()) return BigDecimal.ZERO;
            return new BigDecimal(val);
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }

    public record ImportacaoResultado(
        int fornecedoresNovos,
        int produtosNovos,
        int produtosAtualizados
    ) {}
}