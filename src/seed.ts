import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Criar casas de exemplo
  const bet365 = await prisma.casa.create({
    data: {
      nome: 'Bet365',
      pais: 'Reino Unido',
      licenca: 'Gibraltar',
      avaliacao: 4.8,
      status: 'ativa',
      bonusBoasVindas: '100% até R$ 500',
      bonusRecarga: '50% até R$ 200',
      tempoSaque: '24-48h',
      metodosPagamento: 'PIX, Cartão, Transferência',
      telefone: '+44 800 032 8888',
      email: 'support@bet365.com',
      site: 'www.bet365.com',
      observacoes: 'Uma das maiores casas do mundo, excelente para arbitragem'
    }
  });

  const betano = await prisma.casa.create({
    data: {
      nome: 'Betano',
      pais: 'Brasil',
      licenca: 'Ceará',
      avaliacao: 4.5,
      status: 'ativa',
      bonusBoasVindas: '100% até R$ 300',
      bonusRecarga: '30% até R$ 100',
      tempoSaque: '24h',
      metodosPagamento: 'PIX, Cartão',
      telefone: '0800 777 7777',
      email: 'suporte@betano.com',
      site: 'www.betano.com',
      observacoes: 'Casa brasileira confiável, saques rápidos'
    }
  });

  const pixbet = await prisma.casa.create({
    data: {
      nome: 'Pixbet',
      pais: 'Brasil',
      licenca: 'Ceará',
      avaliacao: 4.0,
      status: 'ativa',
      bonusBoasVindas: '100% até R$ 500',
      bonusRecarga: '50% até R$ 200',
      tempoSaque: '24h',
      metodosPagamento: 'PIX, Cartão',
      telefone: '0800 888 8888',
      email: 'suporte@pixbet.com',
      site: 'www.pixbet.com',
      observacoes: 'Foco em PIX, interface simples'
    }
  });

  // Criar arbitragem de exemplo
  await prisma.arbitragem.create({
    data: {
      evento: 'Flamengo vs Palmeiras',
      esporte: 'Futebol',
      casa1Id: bet365.id,
      casa2Id: betano.id,
      odd1: 2.10,
      odd2: 1.95,
      stake1: 1000,
      stake2: 1077,
      lucroEsperado: 245.50,
      status: 'concluida'
    }
  });

  // Criar freebet de exemplo
  await prisma.freebet.create({
    data: {
      casaId: bet365.id,
      valor: 100,
      tipo: 'boas_vindas',
      status: 'usado',
      dataObtencao: new Date('2024-01-10'),
      dataExpiracao: new Date('2024-02-10'),
      valorExtraido: 85.50,
      estrategia: 'Arbitragem com Betano'
    }
  });

  console.log('✅ Dados de exemplo criados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 