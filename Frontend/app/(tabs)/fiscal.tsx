import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    ActivityIndicator, Alert, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useConfig } from '@/context/ConfigContext';
import Colors from '@/constants/Colors';
import { BASE_URL } from '../login';

const API = `${BASE_URL}/api/nfe`;

// ─── Tipos ───────────────────────────────────────────────────────
interface ItemPrevia {
    codigoProdutoFornecedor: string;
    descricao: string;
    ncm: string;
    unidadeComercial: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    jaExisteNoBanco: boolean;
}

interface NfePrevia {
    cnpjFornecedor: string;
    razaoSocial: string;
    nomeFantasia: string;
    uf: string;
    cidade: string;
    fornecedorJaCadastrado: boolean;
    numeroNota: string;
    serie: string;
    chaveAcesso: string;
    valorTotalNota: number;
    itens: ItemPrevia[];
}

type Etapa = 'inicial' | 'carregando' | 'previa' | 'confirmando' | 'sucesso' | 'erro';

// ─── Componente principal ─────────────────────────────────────────
export default function FiscalScreen() {
    const { theme } = useConfig();
    const C = Colors[theme as keyof typeof Colors] || Colors.dark;

    const [etapa, setEtapa] = useState<Etapa>('inicial');
    const [previa, setPrevia] = useState<NfePrevia | null>(null);
    const [erroMsg, setErroMsg] = useState('');
    const [resultado, setResultado] = useState<any>(null);

    const getToken = async () => AsyncStorage.getItem('@OrionToken') ?? '';

    // ── PASSO 1: seleciona XML e busca prévia ──
    const selecionarXml = async () => {
        try {
            const picked = await DocumentPicker.getDocumentAsync({
                type: ['text/xml', 'application/xml', '*/*'],
                copyToCacheDirectory: true,
            });

            if (picked.canceled || !picked.assets?.[0]) {
                return;
            }

            const asset = picked.assets[0];

            console.log('Arquivo selecionado:', asset);

            setEtapa('carregando');

            const token = await getToken();

            const form = new FormData();

            form.append(
                'xml',
                {
                    uri: asset.uri,
                    name: asset.name || 'nfe.xml',
                    type: asset.mimeType || 'application/xml',
                } as any
            );

            const resp = await fetch(`${API}/previa`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            const texto = await resp.text();

            console.log('Status:', resp.status);
            console.log('Resposta:', texto);

            let json;

            try {
                json = JSON.parse(texto);
            } catch {
                json = { erro: texto };
            }

            if (!resp.ok) {
                setErroMsg(json.erro || json.message || 'Erro ao processar XML.');
                setEtapa('erro');
                return;
            }

            setPrevia(json);
            setEtapa('previa');

        } catch (e: any) {
            console.error(e);

            setErroMsg(
                'Não foi possível ler o arquivo: ' +
                (e?.message || 'Erro desconhecido')
            );

            setEtapa('erro');
        }
    };

    // ── PASSO 2: confirma importação ──
    const confirmarImportacao = async () => {
        if (!previa) return;

        Alert.alert(
            'Confirmar importação',
            `Deseja salvar ${previa.itens.length} produto(s) e o fornecedor ${previa.razaoSocial}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        setEtapa('confirmando');
                        try {
                            const token = await getToken();
                            const resp = await fetch(`${API}/confirmar`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(previa),
                            });

                            const json = await resp.json();
                            if (!resp.ok) {
                                setErroMsg(json.erro ?? 'Erro ao importar.');
                                setEtapa('erro');
                                return;
                            }

                            setResultado(json);
                            setEtapa('sucesso');
                        } catch (e: any) {
                            setErroMsg('Erro de conexão: ' + e.message);
                            setEtapa('erro');
                        }
                    },
                },
            ]
        );
    };

    const reiniciar = () => {
        setEtapa('inicial');
        setPrevia(null);
        setResultado(null);
        setErroMsg('');
    };

    // ────────────────────────────────────────────────────────────────
    return (
        <View style={{ flex: 1, backgroundColor: C.background }}>
            <SafeAreaView style={styles.safe} edges={['top']}>

                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Ionicons name="document-text" size={24} color="#00D1FF" />
                    <Text style={[styles.headerTitle, { color: C.text }]}>Importar NF-e</Text>
                </View>

                {/* ── INICIAL ── */}
                {etapa === 'inicial' && (
                    <View style={styles.centerContent}>
                        <Ionicons name="cloud-upload-outline" size={80} color="#1E2F4D" />
                        <Text style={[styles.instrucao, { color: C.text }]}>
                            Selecione um arquivo XML de NF-e para importar fornecedor e produtos automaticamente.
                        </Text>
                        <TouchableOpacity style={styles.btnPrimario} onPress={selecionarXml}>
                            <Ionicons name="folder-open-outline" size={22} color="#FFF" />
                            <Text style={styles.btnTexto}>Selecionar XML</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* ── CARREGANDO / CONFIRMANDO ── */}
                {(etapa === 'carregando' || etapa === 'confirmando') && (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={[styles.instrucao, { color: C.text }]}>
                            {etapa === 'carregando' ? 'Lendo XML...' : 'Salvando dados...'}
                        </Text>
                    </View>
                )}

                {/* ── ERRO ── */}
                {etapa === 'erro' && (
                    <View style={styles.centerContent}>
                        <Ionicons name="close-circle" size={60} color="#FF4D4D" />
                        <Text style={[styles.erroTexto]}>{erroMsg}</Text>
                        <TouchableOpacity style={styles.btnSecundario} onPress={reiniciar}>
                            <Text style={styles.btnSecundarioTexto}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* ── SUCESSO ── */}
                {etapa === 'sucesso' && resultado && (
                    <View style={styles.centerContent}>
                        <Ionicons name="checkmark-circle" size={70} color="#00C566" />
                        <Text style={[styles.sucessoTitulo, { color: C.text }]}>Importação concluída!</Text>
                        <View style={styles.resultadoBox}>
                            <ResultadoRow label="Fornecedores novos" valor={resultado.fornecedoresNovos} />
                            <ResultadoRow label="Produtos cadastrados" valor={resultado.produtosNovos} />
                            <ResultadoRow label="Produtos atualizados" valor={resultado.produtosAtualizados} />
                        </View>
                        <TouchableOpacity style={styles.btnPrimario} onPress={reiniciar}>
                            <Ionicons name="add-circle-outline" size={22} color="#FFF" />
                            <Text style={styles.btnTexto}>Nova importação</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* ── PRÉVIA ── */}
                {etapa === 'previa' && previa && (
                    <ScrollView contentContainerStyle={styles.previaContainer}>

                        {/* Card fornecedor */}
                        <View style={styles.card}>
                            <View style={styles.cardHeaderRow}>
                                <Text style={styles.cardTitulo}>FORNECEDOR</Text>
                                <BadgeStatus
                                    label={previa.fornecedorJaCadastrado ? 'Já cadastrado' : 'Novo'}
                                    cor={previa.fornecedorJaCadastrado ? '#FFB800' : '#00C566'}
                                />
                            </View>
                            <InfoRow label="CNPJ" valor={formatarCnpj(previa.cnpjFornecedor)} />
                            <InfoRow label="Razão Social" valor={previa.razaoSocial} />
                            {previa.nomeFantasia ? <InfoRow label="Fantasia" valor={previa.nomeFantasia} /> : null}
                            <InfoRow label="Cidade / UF" valor={`${previa.cidade} / ${previa.uf}`} />
                        </View>

                        {/* Card nota */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitulo}>DADOS DA NOTA</Text>
                            <InfoRow label="Número" valor={`${previa.numeroNota} — Série ${previa.serie}`} />
                            <InfoRow label="Valor Total" valor={`R$ ${Number(previa.valorTotalNota).toFixed(2)}`} />
                            <InfoRow label="Chave" valor={previa.chaveAcesso} small />
                        </View>

                        {/* Itens */}
                        <Text style={styles.secaoTitulo}>
                            PRODUTOS ({previa.itens.length})
                        </Text>

                        {previa.itens.map((item, idx) => (
                            <View key={idx} style={styles.itemCard}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemDescricao} numberOfLines={2}>{item.descricao}</Text>
                                    <BadgeStatus
                                        label={item.jaExisteNoBanco ? 'Existente' : 'Novo'}
                                        cor={item.jaExisteNoBanco ? '#007AFF' : '#00C566'}
                                    />
                                </View>
                                <View style={styles.itemGrade}>
                                    <MiniInfo label="Código" valor={item.codigoProdutoFornecedor} />
                                    <MiniInfo label="NCM" valor={item.ncm} />
                                    <MiniInfo label="Unid." valor={item.unidadeComercial} />
                                    <MiniInfo label="Qtd." valor={String(item.quantidade)} />
                                    <MiniInfo label="V.Unit." valor={`R$${Number(item.valorUnitario).toFixed(2)}`} />
                                    <MiniInfo label="Total" valor={`R$${Number(item.valorTotal).toFixed(2)}`} />
                                </View>
                            </View>
                        ))}

                        {/* Botões de ação */}
                        <View style={styles.acoes}>
                            <TouchableOpacity style={styles.btnSecundario} onPress={reiniciar}>
                                <Text style={styles.btnSecundarioTexto}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimario} onPress={confirmarImportacao}>
                                <Ionicons name="save-outline" size={20} color="#FFF" />
                                <Text style={styles.btnTexto}>Confirmar importação</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                )}

            </SafeAreaView>
        </View>
    );
}

// ─── Sub-componentes ─────────────────────────────────────────────
const InfoRow = ({ label, valor, small }: { label: string; valor: string; small?: boolean }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValor, small && { fontSize: 9 }]} numberOfLines={small ? 2 : 1}>
            {valor}
        </Text>
    </View>
);

const MiniInfo = ({ label, valor }: { label: string; valor: string }) => (
    <View style={styles.miniInfo}>
        <Text style={styles.miniLabel}>{label}</Text>
        <Text style={styles.miniValor}>{valor}</Text>
    </View>
);

const BadgeStatus = ({ label, cor }: { label: string; cor: string }) => (
    <View style={[styles.badge, { borderColor: cor }]}>
        <Text style={[styles.badgeTexto, { color: cor }]}>{label}</Text>
    </View>
);

const ResultadoRow = ({ label, valor }: { label: string; valor: number }) => (
    <View style={styles.resultadoRow}>
        <Text style={styles.resultadoLabel}>{label}</Text>
        <Text style={styles.resultadoValor}>{valor}</Text>
    </View>
);

const formatarCnpj = (cnpj: string) => {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
};

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 10, gap: 12, borderBottomWidth: 1, borderBottomColor: '#1E2F4D' },
    headerTitle: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 20 },
    instrucao: { fontSize: 15, textAlign: 'center', color: '#94A3B8', lineHeight: 22 },
    erroTexto: { color: '#FF4D4D', fontSize: 14, textAlign: 'center', marginVertical: 8 },
    sucessoTitulo: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },

    btnPrimario: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, marginTop: 8 },
    btnTexto: { color: '#FFF', fontWeight: '700', fontSize: 15 },
    btnSecundario: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, borderWidth: 1, borderColor: '#1E2F4D' },
    btnSecundarioTexto: { color: '#94A3B8', fontWeight: '600', fontSize: 15 },

    previaContainer: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1E2F4D' },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitulo: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    secaoTitulo: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10, marginTop: 8 },

    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    infoLabel: { color: '#475569', fontSize: 12, flex: 1 },
    infoValor: { color: '#F1F5F9', fontSize: 12, fontWeight: '600', flex: 2, textAlign: 'right' },

    itemCard: { backgroundColor: '#0A1428', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1E293B' },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    itemDescricao: { color: '#F1F5F9', fontSize: 13, fontWeight: '700', flex: 1, marginRight: 8 },
    itemGrade: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    miniInfo: { minWidth: '28%' },
    miniLabel: { color: '#475569', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
    miniValor: { color: '#CBD5E1', fontSize: 12, fontWeight: '600', marginTop: 2 },

    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
    badgeTexto: { fontSize: 10, fontWeight: '700' },

    acoes: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', marginTop: 20 },

    resultadoBox: { backgroundColor: '#0F172A', borderRadius: 16, padding: 20, width: '100%', marginVertical: 16, borderWidth: 1, borderColor: '#1E2F4D' },
    resultadoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
    resultadoLabel: { color: '#94A3B8', fontSize: 14 },
    resultadoValor: { color: '#00C566', fontSize: 16, fontWeight: '800' },
});