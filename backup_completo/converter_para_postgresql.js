const fs = require('fs')
const path = require('path')

// Função para escapar strings para SQL
function escapeString(str) {
  if (str === null || str === undefined) return 'NULL'
  return `'${String(str).replace(/'/g, "''")}'`
}

// Função para converter CSV para SQL
function csvToSql(csvFile, tableName, columns) {
  const csvContent = fs.readFileSync(csvFile, 'utf8')
  const lines = csvContent.trim().split('\n')
  
  if (lines.length === 0) return ''
  
  const sqlStatements = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Parse CSV line (simplified - assumes no commas in data)
    const values = line.split('|')
    
    if (values.length !== columns.length) {
      console.log(`⚠️  Linha ${i + 1} tem ${values.length} colunas, esperado ${columns.length}`)
      continue
    }
    
    const sqlValues = values.map((value, index) => {
      const column = columns[index]
      const trimmedValue = value.trim()
      
      // Handle different data types
      if (trimmedValue === '' || trimmedValue === 'null') return 'NULL'
      
      if (column.type === 'INTEGER' || column.type === 'REAL') {
        return trimmedValue
      } else if (column.type === 'TEXT' || column.type === 'VARCHAR') {
        return escapeString(trimmedValue)
      } else {
        return escapeString(trimmedValue)
      }
    })
    
    sqlStatements.push(`INSERT INTO "${tableName}" (${columns.map(c => `"${c.name}"`).join(', ')}) VALUES (${sqlValues.join(', ')});`)
  }
  
  return sqlStatements.join('\n')
}

// Definir estrutura das tabelas
const tableSchemas = {
  'casas.csv': {
    tableName: 'Casa',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'nome', type: 'TEXT' },
      { name: 'pais', type: 'TEXT' },
      { name: 'licenca', type: 'TEXT' },
      { name: 'avaliacao', type: 'REAL' },
      { name: 'status', type: 'TEXT' },
      { name: 'bonusBoasVindas', type: 'TEXT' },
      { name: 'bonusRecarga', type: 'TEXT' },
      { name: 'tempoSaque', type: 'TEXT' },
      { name: 'metodosPagamento', type: 'TEXT' },
      { name: 'telefone', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'site', type: 'TEXT' },
      { name: 'observacoes', type: 'TEXT' },
      { name: 'usuarioId', type: 'INTEGER' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'updatedAt', type: 'TEXT' }
    ]
  },
  'arbitragens.csv': {
    tableName: 'Arbitragem',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'evento', type: 'TEXT' },
      { name: 'esporte', type: 'TEXT' },
      { name: 'tipo', type: 'TEXT' },
      { name: 'casa1Id', type: 'INTEGER' },
      { name: 'casa2Id', type: 'INTEGER' },
      { name: 'casa3Id', type: 'INTEGER' },
      { name: 'casa4Id', type: 'INTEGER' },
      { name: 'casa5Id', type: 'INTEGER' },
      { name: 'odd1', type: 'REAL' },
      { name: 'odd2', type: 'REAL' },
      { name: 'odd3', type: 'REAL' },
      { name: 'odd4', type: 'REAL' },
      { name: 'odd5', type: 'REAL' },
      { name: 'stake1', type: 'REAL' },
      { name: 'stake2', type: 'REAL' },
      { name: 'stake3', type: 'REAL' },
      { name: 'stake4', type: 'REAL' },
      { name: 'stake5', type: 'REAL' },
      { name: 'lucroEsperado', type: 'REAL' },
      { name: 'valorTotalInvestir', type: 'REAL' },
      { name: 'resultado1', type: 'TEXT' },
      { name: 'resultado2', type: 'TEXT' },
      { name: 'resultado3', type: 'TEXT' },
      { name: 'resultado4', type: 'TEXT' },
      { name: 'resultado5', type: 'TEXT' },
      { name: 'ladoVencedor', type: 'TEXT' },
      { name: 'lucroReal', type: 'REAL' },
      { name: 'status', type: 'TEXT' },
      { name: 'freebet1', type: 'INTEGER' },
      { name: 'freebet2', type: 'INTEGER' },
      { name: 'freebet3', type: 'INTEGER' },
      { name: 'freebet4', type: 'INTEGER' },
      { name: 'freebet5', type: 'INTEGER' },
      { name: 'data', type: 'TEXT' },
      { name: 'usuarioId', type: 'INTEGER' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'updatedAt', type: 'TEXT' }
    ]
  },
  'movimentacoes.csv': {
    tableName: 'Movimentacao',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'tipo', type: 'TEXT' },
      { name: 'valor', type: 'REAL' },
      { name: 'descricao', type: 'TEXT' },
      { name: 'data', type: 'TEXT' },
      { name: 'casaId', type: 'INTEGER' },
      { name: 'usuarioId', type: 'INTEGER' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'updatedAt', type: 'TEXT' }
    ]
  },
  'freespins.csv': {
    tableName: 'Freespin',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'valorGanho', type: 'REAL' },
      { name: 'data', type: 'TEXT' },
      { name: 'casaId', type: 'INTEGER' },
      { name: 'usuarioId', type: 'INTEGER' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'updatedAt', type: 'TEXT' }
    ]
  },
  'ganhos.csv': {
    tableName: 'Ganho',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'valor', type: 'REAL' },
      { name: 'data', type: 'TEXT' },
      { name: 'casaId', type: 'INTEGER' },
      { name: 'usuarioId', type: 'INTEGER' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'updatedAt', type: 'TEXT' }
    ]
  },
  'percas.csv': {
    tableName: 'Perca',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'valor', type: 'REAL' },
      { name: 'data', type: 'TEXT' },
      { name: 'casaId', type: 'INTEGER' },
      { name: 'usuarioId', type: 'INTEGER' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'updatedAt', type: 'TEXT' }
    ]
  },
  'usuarios.csv': {
    tableName: 'Usuario',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'nome', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'senha', type: 'TEXT' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'updatedAt', type: 'TEXT' }
    ]
  }
}

// Converter todos os arquivos
console.log('🔄 Convertendo arquivos CSV para SQL PostgreSQL...')

let allSql = `-- Script de importação para PostgreSQL
-- Gerado automaticamente a partir dos dados SQLite
-- Data: ${new Date().toISOString()}

-- Desabilitar verificações de chave estrangeira temporariamente
SET session_replication_role = replica;

`

for (const [csvFile, schema] of Object.entries(tableSchemas)) {
  if (fs.existsSync(csvFile)) {
    console.log(`📊 Convertendo ${csvFile}...`)
    const sql = csvToSql(csvFile, schema.tableName, schema.columns)
    allSql += `\n-- ${schema.tableName}\n${sql}\n`
    console.log(`✅ ${schema.tableName}: ${sql.split('INSERT INTO').length - 1} registros`)
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${csvFile}`)
  }
}

allSql += `\n-- Reabilitar verificações de chave estrangeira
SET session_replication_role = DEFAULT;

-- Verificar contagem de registros
SELECT 'Casa' as tabela, COUNT(*) as total FROM "Casa"
UNION ALL SELECT 'Arbitragem', COUNT(*) FROM "Arbitragem"
UNION ALL SELECT 'Movimentacao', COUNT(*) FROM "Movimentacao"
UNION ALL SELECT 'Freespin', COUNT(*) FROM "Freespin"
UNION ALL SELECT 'Ganho', COUNT(*) FROM "Ganho"
UNION ALL SELECT 'Perca', COUNT(*) FROM "Perca"
UNION ALL SELECT 'Usuario', COUNT(*) FROM "Usuario";
`

// Salvar arquivo SQL
fs.writeFileSync('importar_dados_postgresql.sql', allSql)
console.log('✅ Arquivo SQL criado: importar_dados_postgresql.sql')
console.log('🎉 Conversão concluída!')
