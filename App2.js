import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, Alert
} from 'react-native';

export default function App() {
  const [role, setRole] = useState('admin');
  const [showWholesale, setShowWholesale] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);

  const [produtos, setProdutos] = useState([
    { id: '1', nome: 'Suplemento Bio 30+', precoVarejo: 90, precoAtacado: 60, estoque: 150 },
    { id: '2', nome: 'Kit Cama, Mesa e Banho', precoVarejo: 250, precoAtacado: 180, estoque: 40 },
  ]);
  
  const [clientes, setClientes] = useState([
    { id: '1', nome: 'Ana Paula', telefone: '(91) 99999-1111', tipo: 'Crediário (3x)', status: 'Em dia' },
  ]);

  const [revendedores, setRevendedores] = useState([
    { id: '1', nome: 'Carlos Silva', regiao: 'Muaná - Centro' },
  ]);

  const [vendas, setVendas] = useState([]);
  const [financeiro, setFinanceiro] = useState({ entradas: 1250, saidas: 400 });

  const [nomeCliente, setNomeCliente] = useState('');
  const [telCliente, setTelCliente] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('À vista');
  
  const [nomeRev, setNomeRev] = useState('');
  const [regiaoRev, setRegiaoRev] = useState('');

  const [nomeProd, setNomeProd] = useState('');
  const [precoVarejo, setPrecoVarejo] = useState('');
  const [precoAtacado, setPrecoAtacado] = useState('');
  const [qtdEstoque, setQtdEstoque] = useState('');

  const liberarAtacado = () => {
    if (passcode === '2026') {
      setShowWholesale(true);
      setAccessGranted(true);
      Alert.alert('Sucesso', 'Modo Atacado Liberado!');
    } else {
      Alert.alert('Erro', 'Senha de autorização incorreta.');
    }
  };

  const registrarVenda = (produto) => {
    const precoFinal = showWholesale ? produto.precoAtacado : produto.precoVarejo;
    const novaVenda = {
      id: Date.now().toString(),
      produto: produto.nome,
      valor: precoFinal,
      tipo: showWholesale ? 'Atacado' : 'Varejo',
      data: new Date().toLocaleDateString()
    };
    setVendas([novaVenda, ...vendas]);
    setFinanceiro(prev => ({ ...prev, entradas: prev.entradas + precoFinal }));
    setProdutos(produtos.map(p => p.id === produto.id ? { ...p, estoque: p.estoque - 1 } : p));
    Alert.alert('Sucesso', `Venda de ${produto.nome} registrada por R$ ${precoFinal}!`);
  };

  const cadastrarCliente = () => {
    if (!nomeCliente) return Alert.alert('Aviso', 'Informe o nome do cliente.');
    setClientes([...clientes, { id: Date.now().toString(), nome: nomeCliente, telefone: telCliente, tipo: tipoPagamento, status: 'Em dia' }]);
    setNomeCliente(''); setTelCliente('');
    Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
  };

  const cadastrarRevendedor = () => {
    if (!nomeRev) return Alert.alert('Aviso', 'Informe o nome do revendedor.');
    setRevendedores([...revendedores, { id: Date.now().toString(), nome: nomeRev, regiao: regiaoRev }]);
    setNomeRev(''); setRegiaoRev('');
    Alert.alert('Sucesso', 'Revendedor cadastrado!');
  };

  const cadastrarProduto = () => {
    if (!nomeProd || !precoVarejo || !qtdEstoque) return Alert.alert('Aviso', 'Preencha os campos obrigatórios do produto.');
    setProdutos([...produtos, {
      id: Date.now().toString(),
      nome: nomeProd,
      precoVarejo: parseFloat(precoVarejo),
      precoAtacado: parseFloat(precoAtacado || precoVarejo),
      estoque: parseInt(qtdEstoque)
    }]);
    setNomeProd(''); setPrecoVarejo(''); setPrecoAtacado(''); setQtdEstoque('');
    Alert.alert('Sucesso', 'Produto adicionado ao estoque!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.roleSelector}>
        <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>PERFIL:</Text>
        <TouchableOpacity onPress={() => {setRole('admin'); setShowWholesale(false);}} style={[styles.roleBtn, role==='admin'&&styles.activeRole]}><Text style={styles.roleTxt}>Admin</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => {setRole('revendedor'); setShowWholesale(false);}} style={[styles.roleBtn, role==='revendedor'&&styles.activeRole]}><Text style={styles.roleTxt}>Revendedor</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => {setRole('cliente'); setShowWholesale(false);}} style={[styles.roleBtn, role==='cliente'&&styles.activeRole]}><Text style={styles.roleTxt}>Cliente</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Naturais Brasil & Mix</Text>
          <Text style={styles.subtitulo}>Painel: {role.toUpperCase()}</Text>
        </View>

        {role === 'admin' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📊 Controle Financeiro & Caixa</Text>
              <Text style={styles.txtFin}>Entradas Totais: R$ {financeiro.entradas.toFixed(2)}</Text>
              <Text style={styles.txtFin}>Saídas / Despesas: R$ {financeiro.saidas.toFixed(2)}</Text>
              <Text style={[styles.txtFin, {color: '#2E7D32', fontWeight: 'bold', marginTop: 5}]}>
                Saldo Líquido: R$ {(financeiro.entradas - financeiro.saidas).toFixed(2)}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔐 Liberação de Preço Atacado</Text>
              {!accessGranted ? (
                <>
                  <TextInput style={styles.input} placeholder="Digite a senha do Admin" secureTextEntry keyboardType="numeric" value={passcode} onChangeText={setPasscode} />
                  <TouchableOpacity style={styles.botaoAtacado} onPress={liberarAtacado}><Text style={styles.textoBotaoAmarelo}>Liberar Atacado</Text></TouchableOpacity>
                </>
              ) : (
                <Text style={{color: '#2E7D32', fontWeight: 'bold'}}>✔️ Modo Atacado Autorizado nesta Sessão</Text>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📦 Cadastro e Controle de Estoque</Text>
              <TextInput style={styles.input} placeholder="Nome do Produto / Item" value={nomeProd} onChangeText={setNomeProd} />
              <TextInput style={styles.input} placeholder="Preço Varejo (R$)" keyboardType="numeric" value={precoVarejo} onChangeText={setPrecoVarejo} />
              <TextInput style={styles.input} placeholder="Preço Atacado (R$)" keyboardType="numeric" value={precoAtacado} onChangeText={setPrecoAtacado} />
              <TextInput style={styles.input} placeholder="Quantidade em Estoque" keyboardType="numeric" value={qtdEstoque} onChangeText={setQtdEstoque} />
              <TouchableOpacity style={styles.botao} onPress={cadastrarProduto}><Text style={styles.textoBotao}>Cadastrar Produto</Text></TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🤝 Cadastrar Revendedor</Text>
              <TextInput style={styles.input} placeholder="Nome do Revendedor" value={nomeRev} onChangeText={setNomeRev} />
              <TextInput style={styles.input} placeholder="Região / Bairro" value={regiaoRev} onChangeText={setRegiaoRev} />
              <TouchableOpacity style={styles.botao} onPress={cadastrarRevendedor}><Text style={styles.textoBotao}>Salvar Revendedor</Text></TouchableOpacity>
            </View>
          </>
        )}

        {role === 'revendedor' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💼 Painel do Revendedor (Porta a Porta)</Text>
            <Text style={{color: '#555', marginBottom: 10}}>Cadastre novos clientes na rota e envie pedidos.</Text>
            <TextInput style={styles.input} placeholder="Nome do Cliente" value={nomeCliente} onChangeText={setNomeCliente} />
            <TextInput style={styles.input} placeholder="Telefone / WhatsApp" keyboardType="phone-pad" value={telCliente} onChangeText={setTelCliente} />
            <TextInput style={styles.input} placeholder="Forma (À vista, Crediário 1x a 10x)" value={tipoPagamento} onChangeText={setTipoPagamento} />
            <TouchableOpacity style={styles.botao} onPress={cadastrarCliente}><Text style={styles.textoBotao}>Cadastrar Cliente na Rota</Text></TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛍️ Catálogo de Produtos {showWholesale ? '[ATACADO]' : '[VAREJO]'}</Text>
          {produtos.map(p => (
            <View key={p.id} style={styles.prodItem}>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>{p.nome}</Text>
                <Text style={{color: '#666'}}>Disponível: {p.estoque} un.</Text>
                <Text style={{color: '#2E7D32', fontWeight: 'bold', marginTop: 3}}>
                  Preço: R$ {showWholesale ? p.precoAtacado : p.precoVarejo}
                </Text>
              </View>
              <TouchableOpacity style={styles.botaoVenda} onPress={() => registrarVenda(p)}>
                <Text style={styles.textoBotao}>Fazer Pedido</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 Clientes Cadastrados</Text>
          {clientes.map(c => (
            <View key={c.id} style={styles.listaItem}>
              <Text style={{fontWeight: 'bold'}}>{c.nome} ({c.telefone})</Text>
              <Text style={{color: '#555'}}>Condição: {c.tipo} — Status: {c.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📜 Histórico de Vendas Realizadas</Text>
          {vendas.length === 0 ? (
            <Text style={{color: '#888', fontStyle: 'italic'}}>Nenhuma venda registrada ainda.</Text>
          ) : (
            vendas.map(v => (
              <View key={v.id} style={styles.listaItem}>
                <Text style={{fontWeight: 'bold'}}>{v.produto} ({v.tipo})</Text>
                <Text style={{color: '#2E7D32'}}>Valor: R$ {v.valor} — Data: {v.data}</Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1E4A34' },
  container: { padding: 16, backgroundColor: '#F4F7F6', flexGrow: 1 },
  roleSelector: { flexDirection: 'row', padding: 8, backgroundColor: '#122E21', justifyContent: 'space-around', alignItems: 'center' },
  roleBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 6 },
  activeRole: { backgroundColor: '#81C784' },
  roleTxt: { fontWeight: 'bold', color: '#1E4A34', fontSize: 12 },
  header: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1E4A34' },
  subtitulo: { fontSize: 14, color: '#5C7665', marginTop: 2, fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#1E4A34' },
  input: { height: 45, borderColor: '#E1E8E5', borderWidth: 1.5, borderRadius: 8, marginBottom: 10, paddingHorizontal: 12, backgroundColor: '#FAFAFA' },
  botao: { backgroundColor: '#2E7D32', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  botaoAtacado: { backgroundColor: '#FFA000', height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  textoBotaoAmarelo: { color: '#333', fontWeight: 'bold', fontSize: 15 },
  prodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  botaoVenda: { backgroundColor: '#1E4A34', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  listaItem: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  txtFin: { fontSize: 14, color: '#333', marginBottom: 4 }
});
