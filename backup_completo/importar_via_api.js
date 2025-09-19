const fs = require('fs')

// URL do backend no Render
const BACKEND_URL = 'https://planilhaarbteste.onrender.com'

// Função para fazer requisições
async function makeRequest(endpoint, method = 'GET', data = null) {
  const url = `${BACKEND_URL}${endpoint}`
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  
  if (data) {
    options.body = JSON.stringify(data)
  }
  
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    return { success: response.ok, data: result, status: response.status }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Função para importar dados
async function importarDados() {
  console.log('🚀 Iniciando importação via API...')
  
  // 1. Primeiro, criar um usuário
  console.log('👤 Criando usuário...')
  const usuario = {
    nome: 'Usuario Importado',
    email: 'importado@teste.com',
    senha: '123456'
  }
  
  const userResult = await makeRequest('/api/auth/register', 'POST', usuario)
  if (!userResult.success) {
    console.log('❌ Erro ao criar usuário:', userResult.error)
    return
  }
  console.log('✅ Usuário criado!')
  
  // 2. Fazer login para obter token
  console.log('🔐 Fazendo login...')
  const loginResult = await makeRequest('/api/auth/login', 'POST', {
    email: usuario.email,
    senha: usuario.senha
  })
  
  if (!loginResult.success) {
    console.log('❌ Erro no login:', loginResult.error)
    return
  }
  
  const token = loginResult.data.token
  console.log('✅ Login realizado!')
  
  // 3. Importar casas
  console.log('🏠 Importando casas...')
  const casas = JSON.parse(fs.readFileSync('casas.csv', 'utf8').split('\n').slice(1).map(line => {
    const [id, nome, pais, licenca, avaliacao, status, bonusBoasVindas, bonusRecarga, tempoSaque, metodosPagamento, telefone, email, site, observacoes, usuarioId] = line.split('|')
    return {
      nome: nome || 'Casa ' + id,
      pais: pais || 'Brasil',
      licenca: licenca || '',
      avaliacao: parseFloat(avaliacao) || 0,
      status: status || 'ativa',
      bonusBoasVindas: bonusBoasVindas || '',
      bonusRecarga: bonusRecarga || '',
      tempoSaque: tempoSaque || '',
      metodosPagamento: metodosPagamento || '',
      telefone: telefone || '',
      email: email || '',
      site: site || '',
      observacoes: observacoes || ''
    }
  }).filter(casa => casa.nome).slice(0, 5)) // Importar apenas 5 casas para teste
  
  for (const casa of casas) {
    const result = await makeRequest('/api/casas', 'POST', casa)
    if (result.success) {
      console.log(`✅ Casa importada: ${casa.nome}`)
    } else {
      console.log(`❌ Erro ao importar casa ${casa.nome}:`, result.error)
    }
  }
  
  console.log('🎉 Importação concluída!')
}

// Executar importação
importarDados().catch(console.error)
