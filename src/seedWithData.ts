import { PrismaClient } from '../generated/prisma'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'

const prisma = new PrismaClient()

// Conectar ao SQLite
const db = new sqlite3.Database('./dev.db')
const dbAll = promisify(db.all.bind(db))

async function main() {
  console.log('🌱 Iniciando importação de dados...')
  
  try {
    // Buscar dados do SQLite
    const casas = await dbAll('SELECT * FROM Casa') as any[]
    const arbitragens = await dbAll('SELECT * FROM Arbitragem') as any[]
    const freespins = await dbAll('SELECT * FROM FreeSpin') as any[]
    const freebets = await dbAll('SELECT * FROM Freebet') as any[]
    const ganhos = await dbAll('SELECT * FROM Ganho') as any[]
    const movimentacoes = await dbAll('SELECT * FROM Movimentacao') as any[]
    const percas = await dbAll('SELECT * FROM Perca') as any[]
    
    console.log(`📊 Dados encontrados:`)
    console.log(`   - Casas: ${casas.length}`)
    console.log(`   - Arbitragens: ${arbitragens.length}`)
    console.log(`   - Freespins: ${freespins.length}`)
    console.log(`   - Freebets: ${freebets.length}`)
    console.log(`   - Ganhos: ${ganhos.length}`)
    console.log(`   - Movimentações: ${movimentacoes.length}`)
    console.log(`   - Perdas: ${percas.length}`)
    
    // Importar casas
    console.log('🏠 Importando casas...')
    for (const casa of casas) {
      await prisma.casa.create({
        data: {
          nome: casa.nome,
          usuarioId: casa.usuarioId,
          createdAt: new Date(casa.createdAt),
          updatedAt: new Date(casa.updatedAt)
        }
      })
    }
    
    // Importar arbitragens
    console.log('⚡ Importando arbitragens...')
    for (const arb of arbitragens) {
      await prisma.arbitragem.create({
        data: {
          tipo: arb.tipo,
          casa1Id: arb.casa1Id || null,
          casa2Id: arb.casa2Id || null,
          casa3Id: arb.casa3Id || null,
          casa4Id: arb.casa4Id || null,
          casa5Id: arb.casa5Id || null,
          odd1: arb.odd1 || null,
          odd2: arb.odd2 || null,
          odd3: arb.odd3 || null,
          odd4: arb.odd4 || null,
          odd5: arb.odd5 || null,
          stake1: arb.stake1 || null,
          stake2: arb.stake2 || null,
          stake3: arb.stake3 || null,
          stake4: arb.stake4 || null,
          stake5: arb.stake5 || null,
          freebet1: arb.freebet1 || false,
          freebet2: arb.freebet2 || false,
          freebet3: arb.freebet3 || false,
          freebet4: arb.freebet4 || false,
          freebet5: arb.freebet5 || false,
          ladoVencedor: arb.ladoVencedor || null,
          lucroReal: arb.lucroReal || null,
          usuarioId: arb.usuarioId,
          createdAt: new Date(arb.createdAt),
          updatedAt: new Date(arb.updatedAt)
        }
      })
    }
    
    // Importar freespins
    console.log('🎰 Importando freespins...')
    for (const fs of freespins) {
      await prisma.freeSpin.create({
        data: {
          valor: fs.valor,
          data: new Date(fs.data),
          casaId: fs.casaId,
          usuarioId: fs.usuarioId,
          createdAt: new Date(fs.createdAt),
          updatedAt: new Date(fs.updatedAt)
        }
      })
      
      // Criar movimentação de prêmio
      await prisma.movimentacao.create({
        data: {
          casaId: fs.casaId,
          tipo: 'premio',
          valor: fs.valorGanho,
          observacao: `Prêmio de rodada grátis #${fs.id}`,
          data: new Date(fs.data),
          usuarioId: fs.usuarioId,
          createdAt: new Date(fs.createdAt),
          updatedAt: new Date(fs.updatedAt)
        }
      })
    }
    
    // Importar freebets
    console.log('🎁 Importando freebets...')
    for (const fb of freebets) {
      await prisma.freebet.create({
        data: {
          valor: fb.valor,
          data: new Date(fb.data),
          casaId: fb.casaId,
          usuarioId: fb.usuarioId,
          createdAt: new Date(fb.createdAt),
          updatedAt: new Date(fb.updatedAt)
        }
      })
    }
    
    // Importar ganhos
    console.log('💰 Importando ganhos...')
    for (const ganho of ganhos) {
      await prisma.ganho.create({
        data: {
          valor: ganho.valor,
          data: new Date(ganho.data),
          casaId: ganho.casaId,
          usuarioId: ganho.usuarioId,
          createdAt: new Date(ganho.createdAt),
          updatedAt: new Date(ganho.updatedAt)
        }
      })
    }
    
    // Importar movimentações
    console.log('📊 Importando movimentações...')
    for (const mov of movimentacoes) {
      await prisma.movimentacao.create({
        data: {
          tipo: mov.tipo,
          valor: mov.valor,
          data: new Date(mov.data),
          observacao: mov.observacao || null,
          casaId: mov.casaId,
          usuarioId: mov.usuarioId,
          createdAt: new Date(mov.createdAt),
          updatedAt: new Date(mov.updatedAt)
        }
      })
    }
    
    // Importar perdas
    console.log('💸 Importando perdas...')
    for (const perca of percas) {
      await prisma.perca.create({
        data: {
          valor: perca.valor,
          data: new Date(perca.data),
          casaId: perca.casaId,
          usuarioId: perca.usuarioId,
          createdAt: new Date(perca.createdAt),
          updatedAt: new Date(perca.updatedAt)
        }
      })
    }
    
    console.log('✅ Importação concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    db.close()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })