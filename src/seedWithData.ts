import { PrismaClient } from '../generated/prisma'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Conectar ao SQLite
const db = new sqlite3.Database('./dev.db')
const dbAll = promisify(db.all.bind(db))

// Função para parsear datas com segurança
function parseDate(dateString: any): Date {
  if (!dateString) return new Date()
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.warn(`⚠️ Data inválida: "${dateString}". Usando data atual.`)
    return new Date()
  }
  return date
}

async function main() {
  console.log('🌱 Iniciando importação de dados...')
  
  try {
    // Criar usuário padrão se não existir
    let usuarioId = 1
    const usuarioExistente = await prisma.usuario.findFirst()
    if (!usuarioExistente) {
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome: 'Usuário Padrão',
          email: 'usuario@exemplo.com',
          senha: await bcrypt.hash('senha123', 10)
        }
      })
      usuarioId = novoUsuario.id
      console.log(`👤 Usuário padrão criado com ID: ${usuarioId}`)
    } else {
      usuarioId = usuarioExistente.id
      console.log(`👤 Usando usuário existente com ID: ${usuarioId}`)
    }
    
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
          nome: casa.nome || 'Casa sem nome',
          usuarioId: usuarioId
        }
      })
    }
    
    // Importar arbitragens
    console.log('⚡ Importando arbitragens...')
    for (const arb of arbitragens) {
      await prisma.arbitragem.create({
        data: {
          tipo: arb.tipo || '2_resultados',
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
          freebet1: Boolean(arb.freebet1) || false,
          freebet2: Boolean(arb.freebet2) || false,
          freebet3: Boolean(arb.freebet3) || false,
          freebet4: Boolean(arb.freebet4) || false,
          freebet5: Boolean(arb.freebet5) || false,
          ladoVencedor: arb.ladoVencedor || null,
          lucroReal: arb.lucroReal || null,
          usuarioId: usuarioId
        }
      })
    }
    
    // Importar freespins
    console.log('🎰 Importando freespins...')
    for (const fs of freespins) {
      await prisma.freeSpin.create({
        data: {
          valor: fs.valor || 0,
          data: parseDate(fs.data),
          casaId: fs.casaId || 1,
          usuarioId: usuarioId
        }
      })
      
      // Criar movimentação de prêmio se houver valorGanho
      if (fs.valorGanho && fs.valorGanho > 0) {
        await prisma.movimentacao.create({
          data: {
            casaId: fs.casaId || 1,
            tipo: 'premio',
            valor: fs.valorGanho,
            observacao: `Prêmio de rodada grátis`,
            data: parseDate(fs.data),
            usuarioId: usuarioId
          }
        })
      }
    }
    
    // Importar freebets
    console.log('🎁 Importando freebets...')
    for (const fb of freebets) {
      await prisma.freebet.create({
        data: {
          valor: fb.valor || 0,
          data: parseDate(fb.data),
          casaId: fb.casaId || 1,
          usuarioId: usuarioId
        }
      })
    }
    
    // Importar ganhos
    console.log('💰 Importando ganhos...')
    for (const ganho of ganhos) {
      await prisma.ganho.create({
        data: {
          valor: ganho.valor || 0,
          data: parseDate(ganho.data),
          casaId: ganho.casaId || 1,
          usuarioId: usuarioId
        }
      })
    }
    
    // Importar movimentações
    console.log('📊 Importando movimentações...')
    for (const mov of movimentacoes) {
      await prisma.movimentacao.create({
        data: {
          tipo: mov.tipo || 'deposito',
          valor: mov.valor || 0,
          data: parseDate(mov.data),
          observacao: mov.observacao || null,
          casaId: mov.casaId || 1,
          usuarioId: usuarioId
        }
      })
    }
    
    // Importar perdas
    console.log('💸 Importando perdas...')
    for (const perca of percas) {
      await prisma.perca.create({
        data: {
          valor: perca.valor || 0,
          data: parseDate(perca.data),
          casaId: perca.casaId || 1,
          usuarioId: usuarioId
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