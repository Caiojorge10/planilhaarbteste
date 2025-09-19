import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updatePassword() {
  console.log('🔑 Atualizando senha do usuário original...')
  
  try {
    const hashedPassword = await bcrypt.hash('123456', 10)
    
    const usuario = await prisma.usuario.update({
      where: { id: 1 },
      data: { senha: hashedPassword }
    })
    
    console.log(`✅ Senha atualizada para o usuário: ${usuario.email}`)
    console.log('🔑 Nova senha: 123456')
    
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePassword()
