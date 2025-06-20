"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
const app = (0, express_1.default)();
const prisma = new prisma_1.PrismaClient();
const PORT = process.env.PORT || 3000;
// Configuração do CORS para múltiplas origens
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// Middleware
app.use(express_1.default.json());
// Rotas para Casas
app.get('/api/casas', async (req, res) => {
    try {
        const casas = await prisma.casa.findMany();
        res.json(casas);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar casas', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.post('/api/casas', async (req, res) => {
    try {
        const casa = await prisma.casa.create({
            data: req.body
        });
        res.status(201).json(casa);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar casa', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.put('/api/casas/:id', async (req, res) => {
    try {
        const casa = await prisma.casa.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json(casa);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar casa', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.delete('/api/casas/:id', async (req, res) => {
    try {
        await prisma.casa.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar casa', details: (error instanceof Error ? error.message : String(error)) });
    }
});
// Rotas para Arbitragens
app.get('/api/arbitragens', authMiddleware_1.default, async (req, res) => {
    try {
        const arbitragens = await prisma.arbitragem.findMany({
            where: { usuarioId: req.usuarioId },
            include: {
                casa1: true,
                casa2: true,
                casa3: true,
                casa4: true
            }
        });
        res.json(arbitragens);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar arbitragens', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.post('/api/arbitragens', authMiddleware_1.default, async (req, res) => {
    try {
        const data = {
            ...req.body,
            usuarioId: req.usuarioId,
            data: new Date() // Sempre usar a data atual para arbitragens
        };
        const arbitragem = await prisma.arbitragem.create({
            data: data,
            include: {
                casa1: true,
                casa2: true,
                casa3: true,
                casa4: true
            }
        });
        // Criar movimentações de aposta para cada casa envolvida
        const movimentacoes = [];
        if (arbitragem.casa1Id && arbitragem.stake1) {
            movimentacoes.push(prisma.movimentacao.create({
                data: {
                    usuarioId: req.usuarioId,
                    casaId: arbitragem.casa1Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake1,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 1`
                }
            }));
        }
        if (arbitragem.casa2Id && arbitragem.stake2) {
            movimentacoes.push(prisma.movimentacao.create({
                data: {
                    usuarioId: req.usuarioId,
                    casaId: arbitragem.casa2Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake2,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 2`
                }
            }));
        }
        if (arbitragem.casa3Id && arbitragem.stake3) {
            movimentacoes.push(prisma.movimentacao.create({
                data: {
                    usuarioId: req.usuarioId,
                    casaId: arbitragem.casa3Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake3,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 3`
                }
            }));
        }
        if (arbitragem.casa4Id && arbitragem.stake4) {
            movimentacoes.push(prisma.movimentacao.create({
                data: {
                    usuarioId: req.usuarioId,
                    casaId: arbitragem.casa4Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake4,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 4`
                }
            }));
        }
        await Promise.all(movimentacoes);
        res.status(201).json(arbitragem);
    }
    catch (error) {
        console.error('Erro ao criar arbitragem:', error);
        res.status(500).json({ error: 'Erro ao criar arbitragem', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.put('/api/arbitragens/:id', async (req, res) => {
    try {
        const arbitragem = await prisma.arbitragem.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
            include: {
                casa1: true,
                casa2: true,
                casa3: true,
                casa4: true
            }
        });
        res.json(arbitragem);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar arbitragem', details: (error instanceof Error ? error.message : String(error)) });
    }
});
// Endpoint para finalizar arbitragem com lado vencedor
app.post('/api/arbitragens/:id/finalizar', (async (req, res) => {
    try {
        const { ladoVencedor } = req.body;
        const arbitragemId = parseInt(req.params.id);
        if (!ladoVencedor || !['casa1', 'casa2', 'casa3', 'casa4'].includes(ladoVencedor)) {
            return res.status(400).json({ error: 'Lado vencedor deve ser "casa1", "casa2", "casa3" ou "casa4"' });
        }
        // Buscar a arbitragem
        const arbitragem = await prisma.arbitragem.findUnique({
            where: { id: arbitragemId },
            include: {
                casa1: true,
                casa2: true,
                casa3: true,
                casa4: true
            }
        });
        if (!arbitragem) {
            return res.status(404).json({ error: 'Arbitragem não encontrada' });
        }
        // Verificar se o lado vencedor é válido para o tipo de arbitragem
        const tipoArbitragem = arbitragem.tipo;
        const ladosValidos = {
            '2_resultados': ['casa1', 'casa2'],
            '3_resultados': ['casa1', 'casa2', 'casa3'],
            '4_resultados': ['casa1', 'casa2', 'casa3', 'casa4']
        };
        if (!ladosValidos[tipoArbitragem]?.includes(ladoVencedor)) {
            return res.status(400).json({
                error: `Lado vencedor inválido para arbitragem de ${tipoArbitragem}`
            });
        }
        // Atualizar arbitragem com lado vencedor e status
        const arbitragemAtualizada = await prisma.arbitragem.update({
            where: { id: arbitragemId },
            data: {
                ladoVencedor,
                status: 'executada'
            },
            include: {
                casa1: true,
                casa2: true,
                casa3: true,
                casa4: true
            }
        });
        // Criar movimentação de prêmio para a casa vencedora
        let premio = 0;
        let casaPremiadaId = null;
        if (ladoVencedor === 'casa1' && arbitragem.casa1Id && arbitragem.stake1 && arbitragem.odd1) {
            premio = arbitragem.stake1 * arbitragem.odd1;
            casaPremiadaId = arbitragem.casa1Id;
        }
        if (ladoVencedor === 'casa2' && arbitragem.casa2Id && arbitragem.stake2 && arbitragem.odd2) {
            premio = arbitragem.stake2 * arbitragem.odd2;
            casaPremiadaId = arbitragem.casa2Id;
        }
        if (ladoVencedor === 'casa3' && arbitragem.casa3Id && arbitragem.stake3 && arbitragem.odd3) {
            premio = arbitragem.stake3 * arbitragem.odd3;
            casaPremiadaId = arbitragem.casa3Id;
        }
        if (ladoVencedor === 'casa4' && arbitragem.casa4Id && arbitragem.stake4 && arbitragem.odd4) {
            premio = arbitragem.stake4 * arbitragem.odd4;
            casaPremiadaId = arbitragem.casa4Id;
        }
        if (casaPremiadaId && premio > 0) {
            await prisma.movimentacao.create({
                data: {
                    usuarioId: req.usuarioId,
                    casaId: casaPremiadaId,
                    tipo: 'premio',
                    valor: premio,
                    observacao: `Prêmio arbitragem #${arbitragem.id} (${ladoVencedor})`
                }
            });
        }
        res.json({
            arbitragem: arbitragemAtualizada
        });
    }
    catch (error) {
        console.error('Erro ao finalizar arbitragem:', error);
        res.status(500).json({ error: 'Erro ao finalizar arbitragem', details: (error instanceof Error ? error.message : String(error)) });
    }
}));
app.delete('/api/arbitragens/:id', async (req, res) => {
    try {
        await prisma.arbitragem.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar arbitragem', details: (error instanceof Error ? error.message : String(error)) });
    }
});
// Rotas para Freebets
app.get('/api/freebets', authMiddleware_1.default, async (req, res) => {
    try {
        const freebets = await prisma.freebet.findMany({
            where: { usuarioId: req.usuarioId },
            include: { casa: true }
        });
        res.json(freebets);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar freebets', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.post('/api/freebets', authMiddleware_1.default, async (req, res) => {
    try {
        const data = {
            ...req.body,
            usuarioId: req.usuarioId,
            dataObtencao: new Date(req.body.dataObtencao),
            dataExpiracao: new Date(req.body.dataExpiracao)
        };
        const freebet = await prisma.freebet.create({
            data: data,
            include: { casa: true }
        });
        res.status(201).json(freebet);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar freebet', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.put('/api/freebets/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const freebet = await prisma.freebet.update({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId },
            data: req.body,
            include: { casa: true }
        });
        res.json(freebet);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar freebet', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.delete('/api/freebets/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.freebet.delete({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar freebet', details: (error instanceof Error ? error.message : String(error)) });
    }
});
// Rotas para FreeSpins (Rodadas Grátis)
app.get('/api/freespins', authMiddleware_1.default, async (req, res) => {
    try {
        const freespins = await prisma.freeSpin.findMany({
            where: { usuarioId: req.usuarioId },
            include: { casa: true }
        });
        res.json(freespins);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar rodadas grátis', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.post('/api/freespins', authMiddleware_1.default, async (req, res) => {
    try {
        const { casaId, valorGanho } = req.body;
        const freespin = await prisma.freeSpin.create({
            data: {
                usuarioId: req.usuarioId,
                casaId: Number(casaId),
                valorGanho: Number(valorGanho),
            },
            include: { casa: true }
        });
        // Lançar movimentação de prêmio
        await prisma.movimentacao.create({
            data: {
                usuarioId: req.usuarioId,
                casaId: Number(casaId),
                tipo: 'premio',
                valor: Number(valorGanho),
                observacao: `Prêmio de rodada grátis #${freespin.id}`
            }
        });
        res.status(201).json(freespin);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar rodada grátis', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.put('/api/freespins/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const freespin = await prisma.freeSpin.update({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId },
            data: req.body,
            include: { casa: true }
        });
        res.json(freespin);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar rodada grátis', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.delete('/api/freespins/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.freeSpin.delete({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar rodada grátis', details: (error instanceof Error ? error.message : String(error)) });
    }
});
// Rotas para Movimentações
app.get('/api/movimentacoes', authMiddleware_1.default, async (req, res) => {
    try {
        const movimentacoes = await prisma.movimentacao.findMany({
            where: { usuarioId: req.usuarioId },
            include: { casa: true }
        });
        res.json(movimentacoes);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar movimentações', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.get('/api/movimentacoes/:id', authMiddleware_1.default, (async (req, res) => {
    try {
        const movimentacao = await prisma.movimentacao.findUnique({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId },
            include: { casa: true }
        });
        if (!movimentacao)
            return res.status(404).json({ error: 'Movimentação não encontrada' });
        res.json(movimentacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar movimentação', details: (error instanceof Error ? error.message : String(error)) });
    }
}));
app.post('/api/movimentacoes', authMiddleware_1.default, async (req, res) => {
    try {
        const data = {
            ...req.body,
            usuarioId: req.usuarioId,
            data: req.body.data ? new Date(req.body.data) : new Date()
        };
        const movimentacao = await prisma.movimentacao.create({
            data,
            include: { casa: true }
        });
        res.status(201).json(movimentacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar movimentação', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.put('/api/movimentacoes/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const movimentacao = await prisma.movimentacao.update({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId },
            data: req.body,
            include: { casa: true }
        });
        res.json(movimentacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar movimentação', details: (error instanceof Error ? error.message : String(error)) });
    }
});
app.delete('/api/movimentacoes/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.movimentacao.delete({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar movimentação', details: (error instanceof Error ? error.message : String(error)) });
    }
});
// Endpoint para consultar saldo de uma casa
app.get('/api/casas/:id/saldo', authMiddleware_1.default, async (req, res) => {
    try {
        const casaId = parseInt(req.params.id);
        const usuarioId = req.usuarioId;
        // Saldo apenas pelas movimentações do usuário autenticado
        const movimentacoes = await prisma.movimentacao.findMany({ where: { casaId, usuarioId } });
        const saldo = movimentacoes.reduce((acc, mov) => {
            if (mov.tipo === 'deposito' || mov.tipo === 'premio')
                return acc + mov.valor;
            if (mov.tipo === 'saque' || mov.tipo === 'aposta')
                return acc - mov.valor;
            return acc;
        }, 0);
        res.json({ casaId, saldo });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao calcular saldo', details: (error instanceof Error ? error.message : String(error)) });
    }
});
// Endpoint para exclusão múltipla de movimentações
app.delete('/api/movimentacoes/batch', authMiddleware_1.default, (async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Envie um array de IDs para exclusão.' });
        }
        await prisma.movimentacao.deleteMany({
            where: { id: { in: ids }, usuarioId: req.usuarioId }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar movimentações em lote', details: (error instanceof Error ? error.message : String(error)) });
    }
}));
// Rotas de autenticação
app.post('/api/auth/register', (async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
        }
        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }
        const senhaHasheada = await bcrypt_1.default.hash(senha, 10);
        const usuario = await prisma.usuario.create({
            data: { nome, email, senhaHasheada }
        });
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.', details: (error instanceof Error ? error.message : String(error)) });
    }
}));
app.post('/api/auth/login', (async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }
        const senhaValida = await bcrypt_1.default.compare(senha, usuario.senhaHasheada);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '7d' });
        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.', details: (error instanceof Error ? error.message : String(error)) });
    }
}));
// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API funcionando!' });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
