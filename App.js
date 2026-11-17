import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('painel');
  const [chavePix, setChavePix] = useState('seu-email-ou-cnpj@pix.com');
  
  // Estados de Controle de Caixa e Vendas
  const [caixaTotal, setCaixaTotal] = useState(1250.00);
  const [vendasHoje, setVendasHoje] = useState(340.00);
  
  // Controle de Senha para Atacado / Preço de Custo
  const [modoAdminAtacado, setModoAdminAtacado] = useState(false);
  const [senhaAdmin, setSenhaAdmin] = useState('');

  const verificarSenhaAdmin = () => {
    if (senhaAdmin === '1234') { // Senha padrão para teste
      setModoAdminAtacado(true);
      Alert.alert('Sucesso', 'Modo Atacado e Custos Desbloqueados!');
    } else {
      Alert.alert('Erro', 'Senha incorreta!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Naturais Brasil & Mix Cearazinho</Text>
        <Text style={styles.headerSubtitle}>Gestão Comercial & Crediário Próprio</Text>
      </View>

      {/* Menu de Abas */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuScroll}>
        <TouchableOpacity style={[styles.menuButton, abaAtiva === 'painel' && styles.menuButtonActive]} onPress={() => setAbaAtiva('painel')}>
          <Text style={[styles.menuText, abaAtiva === 'painel' && styles.menuTextActive]}>📊 Painel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, abaAtiva === 'produtos' && styles.menuButtonActive]} onPress={() => setAbaAtiva('produtos')}>
          <Text style={[styles.menuText, abaAtiva === 'produtos' && styles.menuTextActive]}>📦 Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, abaAtiva === 'clientes' && styles.menuButtonActive]} onPress={() => setAbaAtiva('clientes')}>
          <Text style={[styles.menuText, abaAtiva === 'clientes' && styles.menuTextActive]}>👥 Clientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, abaAtiva === 'cobranca' && styles.menuButtonActive]} onPress={() => setAbaAtiva('cobranca')}>
          <Text style={[styles.menuText, abaAtiva === 'cobranca' && styles.menuTextActive]}>💰 Cobranças & Pix</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Conteúdo Principal */}
      <ScrollView style={styles.content}>
        
        {/* ABA PAINEL / CAIXA */}
        {abaAtiva === 'painel' && (
          <View>
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text style={styles.statLabel}>Entrada no Caixa</Text>
                  <Text style={styles.statValue}>R$ {caixaTotal.toFixed(2)}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text style={styles.statLabel}>Vendas Hoje</Text>
                  <Text style={[styles.statValue, { color: '#2e7d32' }]}>R$ {vendasHoje.toFixed(2)}</Text>
                </Card.Content>
              </Card>
            </View>

            {/* Controle de Acesso Restrito (Atacado / Preços) */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>🔒 Área Restrita (Atacado / Custos)</Text>
                {modoAdminAtacado ? (
                  <Text style={{ color: '#2e7d32', fontWeight: 'bold' }}>🔓 Preços de Atacado e Lucro Liberados na Tela de Produtos.</Text>
                ) : (
                  <View>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Digite a senha do Admin" 
                      secureTextEntry 
                      value={senhaAdmin}
                      onChangeText={setSenhaAdmin}
                    />
                    <Button mode="contained" buttonColor="#d32f2f" onPress={verificarSenhaAdmin} style={{ marginTop: 8 }}>
                      Desbloquear Atacado
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>
        )}

        {/* ABA PRODUTOS (Adicionar, Remover, Varejo e Atacado) */}
        {abaAtiva === 'produtos' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>📦 Cadastro e Gestão de Produtos</Text>
              <Text style={styles.cardDesc}>Gerencie o catálogo de suplementos, cama, mesa, banho e utilidades.</Text>
              
              <View style={styles.productItem}>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>Kit Cama Casal Mafratex</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Varejo: R$ 120,00</Text>
                  {modoAdminAtacado && <Text style={{ fontSize: 12, color: '#d32f2f' }}>Atacado / Custo: R$ 85,00 🔒</Text>}
                </View>
                <Button mode="outlined" textColor="#d32f2f" onPress={() => Alert.alert('Remover', 'Produto excluído com sucesso!')}>
                  Excluir
                </Button>
              </View>

              <Button mode="contained" buttonColor="#2e7d32" style={{ marginTop: 16 }} onPress={() => Alert.alert('Novo Produto', 'Tela de cadastro aberta.')}>
                + Adicionar Novo Produto
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* ABA CLIENTES E CREDIÁRIO */}
        {abaAtiva === 'clientes' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>👥 Controle de Clientes e Crediário</Text>
              <Text style={styles.cardDesc}>Adicione novos clientes, acompanhe parcelas pendentes ou remova cadastros (Apenas Admin).</Text>

              <View style={styles.productItem}>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>João da Silva (Marajó)</Text>
                  <Text style={{ fontSize: 12, color: '#d32f2f' }}>Status: Parcela em Atraso (R$ 50,00)</Text>
                </View>
                <Button mode="contained" buttonColor="#1976d2" onPress={() => Alert.alert('Cobrança', 'Mensagem de cobrança enviada para o WhatsApp do cliente!')}>
                  Cobrar WhatsApp
                </Button>
              </View>

              <Button mode="contained" buttonColor="#2e7d32" style={{ marginTop: 16 }} onPress={() => Alert.alert('Novo Cliente', 'Cliente cadastrado com sucesso!')}>
                + Cadastrar Novo Cliente
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* ABA COBRANÇA E PIX */}
        {abaAtiva === 'cobranca' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>💰 Configuração da Chave Pix & Baixas</Text>
              <Text style={styles.cardDesc}>Cadastre sua chave Pix oficial para gerar os links automáticos de cobrança.</Text>

              <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 8 }}>Sua Chave Pix Vinculada:</Text>
              <TextInput 
                style={styles.input} 
                value={chavePix}
                onChangeText={setChavePix}
              />

              <Button mode="contained" buttonColor="#2e7d32" style={{ marginTop: 12 }} onPress={() => Alert.alert('Salvo', 'Chave Pix atualizada com sucesso!')}>
                Salvar Chave Pix
              </Button>

              <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>💵 Baixa Manual (Dinheiro / Espécie):</Text>
                <Button mode="contained" buttonColor="#e65100" onPress={() => Alert.alert('Baixa efetuada', 'Débito quitado em espécie e lançado no caixa!')}>
                  Dar Baixa Manual (Dinheiro)
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    backgroundColor: '#1b5e20',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#c8e6c9',
    fontSize: 12,
    marginTop: 2,
  },
  menuScroll: {
    backgroundColor: '#fff',
    maxHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
    height: 36,
  },
  menuButtonActive: {
    backgroundColor: '#2e7d32',
  },
  menuText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 6,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  }
});
