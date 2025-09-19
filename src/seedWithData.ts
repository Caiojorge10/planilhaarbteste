import { PrismaClient } from '../generated/prisma'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'

const prisma = new PrismaClient()

// Conectar ao SQLite
const db = new sqlite3.Database('./dev.db')
const dbAll = promisify(db.all.bind(db))

async function seedWithData() {
  try {
    console.log('🔄 Iniciando seed com dados do SQLite...')
    
    // Importar dados do SQLite
    const casas = await dbAll('SELECT * FROM Casa') as any[]
    const arbitragens = await dbAll('SELECT * FROM Arbitragem') as any[]
    const movimentacoes = await dbAll('SELECT * FROM Movimentacao') as any[]
    const freespins = await dbAll('SELECT * FROM FreeSpin') as any[]
    const ganhos = await dbAll('SELECT * FROM Ganho') as any[]
    const percas = await dbAll('SELECT * FROM Perca') as any[]
    const usuarios = await dbAll('SELECT * FROM Usuario') as any[]
    
    console.log(`📊 Dados encontrados:`)
    console.log(`   - Casas: ${casas.length}`)
    console.log(`   - Arbitragens: ${arbitragens.length}`)
    console.log(`   - Movimentações: ${movimentacoes.length}`)
    console.log(`   - Freespins: ${freespins.length}`)
    console.log(`   - Ganhos: ${ganhos.length}`)
    console.log(`   - Perdas: ${percas.length}`)
    console.log(`   - Usuários: ${usuarios.length}`)
    
    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...')
    await prisma.movimentacao.deleteMany()
    await prisma.arbitragem.deleteMany()
    await prisma.freespin.deleteMany()
    await prisma.ganho.deleteMany()
    await prisma.perca.deleteMany()
    await prisma.casa.deleteMany()
    await prisma.usuario.deleteMany()
    
    // Importar usuários primeiro
    console.log('👤 Importando usuários...')
    for (const user of usuarios) {
      await prisma.usuario.create({
        data: {
          nome: user.nome,
          email: user.email,
          senha: user.senha,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      })
    }
    
    // Importar casas
    console.log('🏠 Importando casas...')
    for (const casa of casas) {
      await prisma.casa.create({
        data: {
          nome: casa.nome,
          pais: casa.pais,
          licenca: casa.licenca || null,
          avaliacao: casa.avaliacao || 0,
          status: casa.status || 'ativa',
          bonusBoasVindas: casa.bonusBoasVindas || null,
          bonusRecarga: casa.bonusRecarga || null,
          tempoSaque: casa.tempoSaque || null,
          metodosPagamento: casa.metodosPagamento || null,
          telefone: casa.telefone || null,
          email: casa.email || null,
          site: casa.site || null,
          observacoes: casa.observacoes || null,
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
          evento: arb.evento,
          esporte: arb.esporte,
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
          lucroEsperado: arb.lucroEsperado || null,
          valorTotalInvestir: arb.valorTotalInvestir || null,
          resultado1: arb.resultado1 || null,
          resultado2: arb.resultado2 || null,
          resultado3: arb.resultado3 || null,
          resultado4: arb.resultado4 || null,
          resultado5: arb.resultado5 || null,
          ladoVencedor: arb.ladoVencedor || null,
          lucroReal: arb.lucroReal || null,
          status: arb.status || 'pendente',
          freebet1: arb.freebet1 || null,
          freebet2: arb.freebet2 || null,
          freebet3: arb.freebet3 || null,
          freebet4: arb.freebet4 || null,
          freebet5: arb.freebet5 || null,
          data: new Date(arb.data),
          usuarioId: arb.usuarioId,
          createdAt: new Date(arb.createdAt),
          updatedAt: new Date(arb.updatedAt)
        }
      })
    }
    
    // Importar movimentações
    console.log('💰 Importando movimentações...')
    for (const mov of movimentacoes) {
      await prisma.movimentacao.create({
        data: {
          tipo: mov.tipo,
          valor: mov.valor,
          descricao: mov.descricao || null,
          data: new Date(mov.data),
          casaId: mov.casaId || null,
          usuarioId: mov.usuarioId,
          createdAt: new Date(mov.createdAt),
          updatedAt: new Date(mov.updatedAt)
        }
      })
    }
    
    // Importar freespins
    console.log('🎰 Importando freespins...')
    for (const fs of freespins) {
      await prisma.freespin.create({
        data: {
          valorGanho: fs.valorGanho,
          data: new Date(fs.data),
          casaId: fs.casaId || null,
          usuarioId: fs.usuarioId,
          createdAt: new Date(fs.createdAt),
          updatedAt: new Date(fs.updatedAt)
        }
      })
    }
    
    // Importar ganhos
    console.log('💚 Importando ganhos...')
    for (const ganho of ganhos) {
      await prisma.ganho.create({
        data: {
          valor: ganho.valor,
          data: new Date(ganho.data),
          casaId: ganho.casaId || null,
          usuarioId: ganho.usuarioId,
          createdAt: new Date(ganho.createdAt),
          updatedAt: new Date(ganho.updatedAt)
        }
      })
    }
    
    // Importar perdas
    console.log('💔 Importando perdas...')
    for (const perca of percas) {
      await prisma.perca.create({
        data: {
          valor: perca.valor,
          data: new Date(perca.data),
          casaId: perca.casaId || null,
          usuarioId: perca.usuarioId,
          createdAt: new Date(perca.createdAt),
          updatedAt: new Date(perca.updatedAt)
        }
      })
    }
    
    console.log('🎉 Seed concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro no seed:', error)
  } finally {
    await prisma.$disconnect()
    db.close()
  }
}

seedWithData()
