const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')

const db = new sqlite3.Database('./prisma/dev.db')

const tables = ['Casa', 'Arbitragem', 'Movimentacao', 'Freebet', 'FreeSpin', 'Ganho', 'Perca', 'Usuario']

async function exportTable(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

async function exportAllTables() {
  try {
    console.log('🔄 Iniciando exportação de todas as tabelas...')
    
    const backupDir = path.join(__dirname, 'backup_completo')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }
    
    for (const table of tables) {
      console.log(`📊 Exportando tabela: ${table}`)
      const data = await exportTable(table)
      
      const fileName = `backup_${table.toLowerCase()}.json`
      const filePath = path.join(backupDir, fileName)
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      console.log(`✅ ${table}: ${data.length} registros exportados para ${fileName}`)
    }
    
    console.log('🎉 Exportação completa finalizada!')
    console.log(`📁 Arquivos salvos em: ${backupDir}`)
    
  } catch (error) {
    console.error('❌ Erro na exportação:', error)
  } finally {
    db.close()
  }
}

exportAllTables()
