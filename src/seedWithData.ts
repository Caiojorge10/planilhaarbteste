import { PrismaClient } from '@prisma/client'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'

const prisma = new PrismaClient()

// Conectar ao SQLite
const db = new sqlite3.Database('./dev.db')
const dbAll = promisify(db.all.bind(db))

// Definir tipos para os dados do SQLite
interface SQLiteCasa {
  id: number
  nome: string
  pais: string
  licenca: string | null
  avaliacao: number | null
  status: string
  bonusBoasVindas: string | null
  bonusRecarga: string | null
  tempoSaque: string | null
  metodosPagamento: string | null
  telefone: string | null
  email: string | null
  site: string | null
  observacoes: string | null
  usuarioId: number
  createdAt: string
  updatedAt: string
}

interface SQLiteArbitragem {
  id: number
  evento: string
  esporte: string
  tipo: string
  casa1Id: number | null
  casa2Id: number | null
  casa3Id: number | null
  casa4Id: number | null
  casa5Id: number | null
  odd1: number | null
  odd2: number | null
  odd3: number | null
  odd4: number | null
  odd5: number | null
  stake1: number | null
  stake2: number | null
  stake3: number | null
  stake4: number | null
  stake5: number | null
  lucroEsperado: number | null
  valorTotalInvestir: number | null
  resultado1: string | null
  resultado2: string | null
  resultado3: string | null
  resultado4: string | null
  resultado5: string | null
  ladoVencedor: string | null
  lucroReal: number | null
  status: string
  freebet1: number | null
  freebet2: number | null
  freebet3: number | null
  freebet4: number | null
  freebet5: number | null
  data: string
  usuarioId: number
  createdAt: string
  updatedAt: string
}

interface SQLiteMovimentacao {
  id: number
  tipo: string
  valor: number
  descricao: string | null
  data: string
  casaId: number | null
  usuarioId: number
  createdAt: string
  updatedAt: string
}

interface SQLiteFreespin {
  id: number
  valorGanho: number
  data: string
  casaId: number | null
  usuarioId: number
  createdAt: string
  updatedAt: string
}

interface SQLiteGanho {
  id: number
  valor: number
  data: string
  casaId: number | null
  usuarioId: number
  createdAt: string
  updatedAt: string
}

interface SQLitePerca {
  id: number
  valor: number
  data: string
  casaId: number | null
  usuarioId: number
  createdAt: string
  updatedAt: string
}

interface SQLiteUsuario {
  id: number
  nome: string
  email: string
  senha: string
  createdAt: string
  updatedAt: string
}

async function seedWithData() {
  try {
    console.log('🔄 Iniciando seed com dados do SQLite...')
    
    // Importar dados do SQLite com tipos explícitos
    const casas = await dbAll('SELECT * FROM Casa') as SQLiteCasa[]
    const arbitragens = await dbAll('SELECT * FROM Arbitragem') as SQLiteArbitragem[]
    const movimentacoes = await dbAll('SELECT * FROM Movimentacao') as SQLiteMovimentacao[]
    const freespins = await dbAll('SELECT * FROM FreeSpin') as SQLiteFreespin[]
    const ganhos = await dbAll('SELECT * FROM Ganho') as SQLiteGanho[]
    const percas = await dbAll('SELECT * FROM Perca') as SQLitePerca[]
    const usuarios = await dbAll('SELECT * FROM Usuario') as SQLiteUsuario[]
    
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
          id: user.id,
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
          id: casa.id,
          nome: casa.nome,
          pais: casa.pais,
          licenca: casa.licenca,
          avaliacao: casa.avaliacao,
          status: casa.status,
          bonusBoasVindas: casa.bonusBoasVindas,
          bonusRecarga: casa.bonusRecarga,
          tempoSaque: casa.tempoSaque,
          metodosPagamento: casa.metodosPagamento,
          telefone: casa.telefone,
          email: casa.email,
          site: casa.site,
          observacoes: casa.observacoes,
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
          id: arb.id,
          evento: arb.evento,
          esporte: arb.esporte,
          tipo: arb.tipo,
          casa1Id: arb.casa1Id,
          casa2Id: arb.casa2Id,
          casa3Id: arb.casa3Id,
          casa4Id: arb.casa4Id,
          casa5Id: arb.casa5Id,
          odd1: arb.odd1,
          odd2: arb.odd2,
          odd3: arb.odd3,
          odd4: arb.odd4,
          odd5: arb.odd5,
          stake1: arb.stake1,
          stake2: arb.stake2,
          stake3: arb.stake3,
          stake4: arb.stake4,
          stake5: arb.stake5,
          lucroEsperado: arb.lucroEsperado,
          valorTotalInvestir: arb.valorTotalInvestir,
          resultado1: arb.resultado1,
          resultado2: arb.resultado2,
          resultado3: arb.resultado3,
          resultado4: arb.resultado4,
          resultado5: arb.resultado5,
          ladoVencedor: arb.ladoVencedor,
          lucroReal: arb.lucroReal,
          status: arb.status,
          freebet1: arb.freebet1,
          freebet2: arb.freebet2,
          freebet3: arb.freebet3,
          freebet4: arb.freebet4,
          freebet5: arb.freebet5,
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
          id: mov.id,
          tipo: mov.tipo,
          valor: mov.valor,
          descricao: mov.descricao,
          data: new Date(mov.data),
          casaId: mov.casaId,
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
          id: fs.id,
          valorGanho: fs.valorGanho,
          data: new Date(fs.data),
          casaId: fs.casaId,
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
          id: ganho.id,
          valor: ganho.valor,
          data: new Date(ganho.data),
          casaId: ganho.casaId,
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
          id: perca.id,
          valor: perca.valor,
          data: new Date(perca.data),
          casaId: perca.casaId,
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
