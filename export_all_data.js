const { PrismaClient } = require('./generated/prisma/index.js')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportAllData() {
  try {
    console.log('🔄 Iniciando exportação de todos os dados...')
    
    // Exportar todas as tabelas
    const data = {
      casas: await prisma.casa.findMany(),
      arbitragens: await prisma.arbitragem.findMany(),
      movimentacoes: await prisma.movimentacao.findMany(),
      freebets: await prisma.freebet.findMany(),
      freespins: await prisma.freespin.findMany(),
      ganhos: await prisma.ganho.findMany(),
      percas: await prisma.perca.findMany(),
      usuarios: await prisma.usuario.findMany()
    }
    
    // Criar pasta de backup se não existir
    const backupDir = path.join(__dirname, 'backup_completo')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }
    
    // Exportar cada tabela individualmente
    for (const [tableName, tableData] of Object.entries(data)) {
      const fileName = `backup_${tableName}.json`
      const filePath = path.join(backupDir, fileName)
      
      fs.writeFileSync(filePath, JSON.stringify(tableData, null, 2))
      console.log(`✅ ${tableName}: ${tableData.length} registros exportados para ${fileName}`)
    }
    
    // Exportar dados completos
    const allDataFile = path.join(backupDir, 'backup_completo_todos_dados.json')
    fs.writeFileSync(allDataFile, JSON.stringify(data, null, 2))
    console.log(`✅ Dados completos exportados para backup_completo_todos_dados.json`)
    
    console.log('🎉 Exportação completa finalizada!')
    console.log(`📁 Arquivos salvos em: ${backupDir}`)
    
  } catch (error) {
    console.error('❌ Erro na exportação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportAllData()
