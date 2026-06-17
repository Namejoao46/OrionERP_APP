package com.example.demo.service;

import com.example.demo.model.RegistroXml;
import com.example.demo.repository.RegistroXmlRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.nio.charset.StandardCharsets;

@Service
public class XmlService {

    private final RegistroXmlRepository repository;

    public XmlService(RegistroXmlRepository repository) {
        this.repository = repository;
    }

    public String processarXml() {
        return "Arquivo processado com sucesso";
    }

    public void processarESalvarXml(MultipartFile arquivoXml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(arquivoXml.getInputStream());
        document.getDocumentElement().normalize();

        String fornecedor = extrairValorTag(document, "xNome"); 
        String produto = extrairValorTag(document, "xProd");
        String qtdString = extrairValorTag(document, "qCom");
        Integer quantidade = 0;
        
        if (qtdString != null && !qtdString.isEmpty()) {
            quantidade = (int) Double.parseDouble(qtdString); 
        }

        String conteudoXml = new String(arquivoXml.getBytes(), StandardCharsets.UTF_8);

        RegistroXml registro = new RegistroXml();
        registro.setDadosXml(conteudoXml);
        registro.setFornecedor(fornecedor);
        registro.setProduto(produto);
        registro.setQuantidade(quantidade);

        repository.save(registro);
    }

    private String extrairValorTag(Document document, String nomeTag) {
        NodeList nodeList = document.getElementsByTagName(nomeTag);
        if (nodeList != null && nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return null;
    }
}