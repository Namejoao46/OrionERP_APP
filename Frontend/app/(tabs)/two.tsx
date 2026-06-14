import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, Image,
  Alert, ActionSheetIOS, Modal, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConfig } from '@/context/ConfigContext';
import Colors from '../../constants/Colors';
import { BASE_URL } from '../login';

const API_URL = `${BASE_URL}/mensagens`;

interface Mensagem {
  id: string;
  conteudo?: string;
  souEu: boolean;
  tipoMensagem: 'TEXTO' | 'FOTO' | 'ARQUIVO' | 'VIDEO' | 'AUDIO';
  uriLocal?: string;
  nomeArquivo?: string;
  arquivoId?: number;
}

export default function ChatScreen() {
  const { theme } = useConfig();
  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;
  const flatListRef = useRef<FlatList>(null);

  const [meuUsuario, setMeuUsuario] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [textoInput, setTextoInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [modalAnexo, setModalAnexo] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const init = async () => {
      const login = await AsyncStorage.getItem('@UserLogin') ?? 'admin';
      const dest = login === 'admin' ? 'admin2' : 'admin';
      setMeuUsuario(login);
      setDestinatario(dest);
    };
    init();
  }, []);

  const carregarConversa = useCallback(async () => {
    if (!meuUsuario || !destinatario) return;
    try {
      const resp = await fetch(
        `${API_URL}/conversa?usuario1=${meuUsuario}&usuario2=${destinatario}`
      );
      if (!resp.ok) return;
      const dados = await resp.json();

      const mapeadas: Mensagem[] = dados.map((m: any) => ({
        id:           String(m.id),
        conteudo:     m.conteudo,
        souEu:        m.remetente === meuUsuario,
        tipoMensagem: m.tipoMensagem ?? 'TEXTO',
        nomeArquivo:  m.nomeArquivo,
        arquivoId:    m.id,
      }));

      setMensagens(mapeadas);
    } catch (e) {
      console.log('[Chat] Erro ao carregar conversa:', e);
    } finally {
      setCarregando(false);
    }
  }, [meuUsuario, destinatario]);

  useEffect(() => {
    carregarConversa();
  }, [carregarConversa]);

  const adicionarMensagemLocal = (msg: Mensagem) => {
    setMensagens(prev => [...prev, msg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const enviarTexto = async () => {
    if (textoInput.trim() === '') return;
    const texto = textoInput;
    setTextoInput('');

    adicionarMensagemLocal({
      id: Date.now().toString(),
      conteudo: texto,
      souEu: true,
      tipoMensagem: 'TEXTO',
    });

    try {
      const form = new FormData();
      form.append('remetente', meuUsuario);
      form.append('destinatario', destinatario);
      form.append('conteudo', texto);
      await fetch(`${API_URL}/enviar`, { method: 'POST', body: form });
    } catch (e) {
      console.log('[Chat] Erro ao enviar texto:', e);
    }
  };

  const enviarArquivo = async (uri: string, nome: string, tipo: string) => {
    setEnviando(true);
    const isFoto = tipo.startsWith('image/');

    adicionarMensagemLocal({
      id: Date.now().toString(),
      souEu: true,
      tipoMensagem: isFoto ? 'FOTO' : 'ARQUIVO',
      uriLocal: uri,
      nomeArquivo: nome,
    });

    try {
      const form = new FormData();
      form.append('remetente', meuUsuario);
      form.append('destinatario', destinatario);
      form.append('arquivo', { uri, name: nome, type: tipo } as any);
      await fetch(`${API_URL}/enviar/arquivo`, { method: 'POST', body: form });
    } catch (e) {
      console.log('[Chat] Erro ao enviar arquivo:', e);
    } finally {
      setEnviando(false);
    }
  };

  const abrirGaleria = async () => {
    setModalAnexo(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão negada', 'Precisa de acesso à galeria.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const a = result.assets[0];
      enviarArquivo(a.uri, a.fileName ?? `foto_${Date.now()}.jpg`, a.mimeType ?? 'image/jpeg');
    }
  };

  const abrirCamera = async () => {
    setModalAnexo(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão negada', 'Precisa de acesso à câmera.'); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const a = result.assets[0];
      enviarArquivo(a.uri, a.fileName ?? `foto_${Date.now()}.jpg`, a.mimeType ?? 'image/jpeg');
    }
  };

  const abrirDocumento = async () => {
    setModalAnexo(false);
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (!result.canceled && result.assets[0]) {
      const a = result.assets[0];
      enviarArquivo(a.uri, a.name, a.mimeType ?? 'application/octet-stream');
    }
  };

  const abrirAnexo = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancelar', 'Câmera', 'Galeria', 'Arquivo'], cancelButtonIndex: 0 },
        (i) => { if (i === 1) abrirCamera(); if (i === 2) abrirGaleria(); if (i === 3) abrirDocumento(); }
      );
    } else {
      setModalAnexo(true);
    }
  };

  const nomeDestinatario = destinatario === 'admin' ? 'Leandro' : 'João Paulo';

  const renderMensagem = ({ item }: { item: Mensagem }) => (
    <View style={[styles.balaoContainer, item.souEu ? styles.minhaMensagemContainer : styles.outraMensagemContainer]}>
      <View style={[styles.balao, item.souEu ? styles.minhaMensagem : styles.outraMensagem]}>
        {item.tipoMensagem === 'FOTO' && item.uriLocal ? (
          <Image source={{ uri: item.uriLocal }} style={styles.imagemBalao} resizeMode="cover" />
        ) : item.tipoMensagem === 'FOTO' && item.arquivoId ? (
          <Image source={{ uri: `${API_URL}/arquivo/${item.arquivoId}` }} style={styles.imagemBalao} resizeMode="cover" />
        ) : item.tipoMensagem === 'ARQUIVO' ? (
          <View style={styles.arquivoBalao}>
            <Ionicons name="document-attach" size={22} color="#FFF" />
            <Text style={styles.arquivoNome} numberOfLines={1}>{item.nomeArquivo}</Text>
          </View>
        ) : (
          <Text style={styles.mensagemTexto}>{item.conteudo}</Text>
        )}
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <View style={styles.header}>
        <Ionicons name="chatbubbles-outline" size={28} color="#00D1FF" />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>
            Conversa com {nomeDestinatario}
          </Text>
          <Text style={styles.headerSubtitle}>Logado como: {meuUsuario}</Text>
        </View>
        <TouchableOpacity onPress={carregarConversa} style={{ padding: 8 }}>
          <Ionicons name="refresh" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={mensagens}
        keyExtractor={item => item.id}
        renderItem={renderMensagem}
        contentContainerStyle={styles.listaMensagens}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <Text style={styles.semMensagens}>Nenhuma mensagem ainda. Diga olá! 👋</Text>
        }
      />

      {enviando && (
        <View style={styles.enviandoBar}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.enviandoTexto}>Enviando arquivo...</Text>
        </View>
      )}

      <View style={[styles.inputBar, { borderTopColor: theme === 'dark' ? '#1E2F4D' : '#CBD5E1' }]}>
        <TouchableOpacity style={styles.anexoButton} onPress={abrirAnexo}>
          <Ionicons name="attach" size={26} color="#00D1FF" />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: currentColors.text }]}
          placeholder="Escreva sua mensagem..."
          placeholderTextColor="#4E5D78"
          value={textoInput}
          onChangeText={setTextoInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={enviarTexto}>
          <Ionicons name="send" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalAnexo} transparent animationType="slide" onRequestClose={() => setModalAnexo(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalAnexo(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitulo}>Enviar</Text>
            <TouchableOpacity style={styles.modalOpcao} onPress={abrirCamera}>
              <Ionicons name="camera" size={26} color="#007AFF" /><Text style={styles.modalOpcaoTexto}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOpcao} onPress={abrirGaleria}>
              <Ionicons name="image" size={26} color="#007AFF" /><Text style={styles.modalOpcaoTexto}>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOpcao} onPress={abrirDocumento}>
              <Ionicons name="document" size={26} color="#007AFF" /><Text style={styles.modalOpcaoTexto}>Arquivo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelar} onPress={() => setModalAnexo(false)}>
              <Text style={styles.modalCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:                { flex: 1 },
  header:                   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#1E2F4D' },
  headerInfo:               { flex: 1, marginLeft: 15 },
  headerTitle:              { fontSize: 16, fontWeight: 'bold' },
  headerSubtitle:           { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  listaMensagens:           { padding: 20, paddingBottom: 10 },
  semMensagens:             { color: '#4E5D78', textAlign: 'center', marginTop: 40, fontSize: 14 },
  balaoContainer:           { flexDirection: 'row', marginBottom: 15, width: '100%' },
  minhaMensagemContainer:   { justifyContent: 'flex-end' },
  outraMensagemContainer:   { justifyContent: 'flex-start' },
  balao:                    { padding: 12, borderRadius: 18, maxWidth: '80%' },
  minhaMensagem:            { backgroundColor: '#007AFF', borderBottomRightRadius: 2 },
  outraMensagem:            { backgroundColor: '#1E2F4D', borderBottomLeftRadius: 2 },
  mensagemTexto:            { color: '#FFF', fontSize: 15 },
  imagemBalao:              { width: 200, height: 200, borderRadius: 12 },
  arquivoBalao:             { flexDirection: 'row', alignItems: 'center', gap: 8 },
  arquivoNome:              { color: '#FFF', fontSize: 13, maxWidth: 160 },
  enviandoBar:              { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 6, gap: 8 },
  enviandoTexto:            { color: '#94A3B8', fontSize: 12 },
  inputBar:                 { flexDirection: 'row', padding: 10, alignItems: 'center', borderTopWidth: 1 },
  anexoButton:              { padding: 8 },
  input:                    { flex: 1, minHeight: 45, maxHeight: 100, fontSize: 15, paddingHorizontal: 10 },
  sendButton:               { backgroundColor: '#007AFF', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  modalOverlay:             { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet:               { backgroundColor: '#0F172A', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitulo:              { color: '#94A3B8', fontSize: 13, fontWeight: '700', marginBottom: 20, textAlign: 'center', letterSpacing: 1 },
  modalOpcao:               { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 16, borderBottomWidth: 1, borderBottomColor: '#1E2F4D' },
  modalOpcaoTexto:          { color: '#FFF', fontSize: 17 },
  modalCancelar:            { marginTop: 16, alignItems: 'center' },
  modalCancelarTexto:       { color: '#FF4D4D', fontSize: 17, fontWeight: '600' },
});