const fs = require('fs')

// Ler o backup SQLite
const sqliteBackup = fs.readFileSync('backup_completo_sqlite.sql', 'utf8')

// Converter para PostgreSQL
let postgresqlScript = `-- Script de importação para PostgreSQL
-- Convertido automaticamente do backup SQLite
-- Data: ${new Date().toISOString()}

-- Desabilitar verificações de chave estrangeira temporariamente
SET session_replication_role = replica;

`

// Converter comandos SQLite para PostgreSQL
let convertedScript = sqliteBackup
  // Remover comandos específicos do SQLite
  .replace(/PRAGMA foreign_keys=OFF;/g, '')
  .replace(/BEGIN TRANSACTION;/g, '')
  .replace(/COMMIT;/g, '')
  
  // Converter tipos de dados
  .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
  .replace(/INTEGER UNSIGNED/g, 'INTEGER')
  .replace(/DATETIME/g, 'TIMESTAMP')
  .replace(/TEXT/g, 'VARCHAR')
  
  // Converter aspas duplas para aspas simples em strings
  .replace(/"([^"]*)"/g, (match, content) => {
    // Se for um nome de coluna ou tabela, manter aspas duplas
    if (content.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      return `"${content}"`
    }
    // Se for um valor, usar aspas simples
    return `'${content.replace(/'/g, "''")}'`
  })
  
  // Converter INSERT statements
  .replace(/INSERT INTO "([^"]+)" VALUES/g, 'INSERT INTO "$1" VALUES')
  
  // Remover linhas vazias
  .split('\n')
  .filter(line => line.trim() !== '')
  .join('\n')

postgresqlScript += convertedScript

postgresqlScript += `

-- Reabilitar verificações de chave estrangeira
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

// Salvar script PostgreSQL
fs.writeFileSync('importar_dados_postgresql_final.sql', postgresqlScript)
console.log('✅ Script PostgreSQL criado: importar_dados_postgresql_final.sql')
console.log('📊 Tamanho do arquivo:', Math.round(fs.statSync('importar_dados_postgresql_final.sql').size / 1024), 'KB')
