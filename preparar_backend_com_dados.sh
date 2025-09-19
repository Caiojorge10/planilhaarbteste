#!/bin/bash

echo "🚀 Preparando backend com dados para deploy no Render..."

# 1. Copiar dados SQLite para o projeto
echo "📁 Copiando banco SQLite..."
cp prisma/dev.db ./dev.db

# 2. Criar script de seed com os dados
echo "🌱 Criando script de seed..."
cat > src/seedWithData.ts << 'SEED_EOF'
import { PrismaClient } from '@prisma/client'
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
    const casas = await dbAll('SELECT * FROM Casa')
    const arbitragens = await dbAll('SELECT * FROM Arbitragem')
    const movimentacoes = await dbAll('SELECT * FROM Movimentacao')
    const freespins = await dbAll('SELECT * FROM FreeSpin')
    const ganhos = await dbAll('SELECT * FROM Ganho')
    const percas = await dbAll('SELECT * FROM Perca')
    const usuarios = await dbAll('SELECT * FROM Usuario')
    
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
SEED_EOF

# 3. Instalar sqlite3
echo "📦 Instalando sqlite3..."
npm install sqlite3 @types/sqlite3

# 4. Atualizar package.json
echo "📝 Atualizando package.json..."
cat >> package.json << 'PACKAGE_EOF'
  },
  "scripts": {
    "seed": "ts-node src/seedWithData.ts",
    "deploy": "npm install && npx prisma generate --schema=./prisma/schema.prisma && npx prisma db push --schema=./prisma/schema.prisma && npm run seed && npm run build"
  }
PACKAGE_EOF

echo "✅ Backend preparado com dados!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Apague os serviços atuais no Render"
echo "2. Crie um novo serviço PostgreSQL"
echo "3. Crie um novo serviço Web Service"
echo "4. Configure o Build Command: npm run deploy"
echo "5. Deploy!"
echo ""
echo "💡 O script de deploy vai:"
echo "   - Instalar dependências"
echo "   - Gerar Prisma Client"
echo "   - Aplicar migrações"
echo "   - Importar dados do SQLite"
echo "   - Compilar o projeto"
