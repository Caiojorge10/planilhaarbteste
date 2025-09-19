import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function transferData() {
  console.log('🔄 Iniciando transferência de dados...')
  
  try {
    const fromUserId = 1
    const toUserId = 3
    
    console.log(`📊 Transferindo dados do usuário ${fromUserId} para ${toUserId}...`)
    
    // Transferir casas
    const casas = await prisma.casa.updateMany({
      where: { usuarioId: fromUserId },
      data: { usuarioId: toUserId }
    })
    console.log(`✅ ${casas.count} casas transferidas`)
    
    // Transferir arbitragens
    const arbitragens = await prisma.arbitragem.updateMany({
      where: { usuarioId: fromUserId },
      data: { usuarioId: toUserId }
    })
    console.log(`✅ ${arbitragens.count} arbitragens transferidas`)
    
    // Transferir freespins
    const freespins = await prisma.freeSpin.updateMany({
      where: { usuarioId: fromUserId },
      data: { usuarioId: toUserId }
    })
    console.log(`✅ ${freespins.count} freespins transferidas`)
    
    // Transferir freebets
    const freebets = await prisma.freebet.updateMany({
      where: { usuarioId: fromUserId },
      data: { usuarioId: toUserId }
    })
    console.log(`✅ ${freebets.count} freebets transferidas`)
    
    // Transferir ganhos
    const ganhos = await prisma.ganho.updateMany({
      where: { usuarioId: fromUserId },
      data: { usuarioId: toUserId }
    })
    console.log(`✅ ${ganhos.count} ganhos transferidas`)
    
    // Transferir movimentações
    const movimentacoes = await prisma.movimentacao.updateMany({
      where: { usuarioId: fromUserId },
      data: { usuarioId: toUserId }
    })
    console.log(`✅ ${movimentacoes.count} movimentações transferidas`)
    
    // Transferir perdas
    const percas = await prisma.perca.updateMany({
      where: { usuarioId: fromUserId },
      data: { usuarioId: toUserId }
    })
    console.log(`✅ ${percas.count} perdas transferidas`)
    
    console.log('🎉 Transferência concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante a transferência:', error)
  } finally {
    await prisma.$disconnect()
  }
}

transferData()
