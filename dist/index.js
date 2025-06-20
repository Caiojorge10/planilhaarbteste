"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
// Criar routers para rotas protegidas
const casasRouter = express_1.default.Router();
const arbitragensRouter = express_1.default.Router();
const freebetsRouter = express_1.default.Router();
const freespinsRouter = express_1.default.Router();
const movimentacoesRouter = express_1.default.Router();
// Usar os routers
app.use('/api/casas', casasRouter);
app.use('/api/arbitragens', arbitragensRouter);
app.use('/api/freebets', freebetsRouter);
app.use('/api/freespins', freespinsRouter);
app.use('/api/movimentacoes', movimentacoesRouter);
// Rotas para Casas
casasRouter.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const casas = await prisma.casa.findMany({ where: { usuarioId: req.usuarioId } });
        res.json(casas);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar casas' });
    }
});
casasRouter.post('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const casa = await prisma.casa.create({
            data: { ...req.body, usuarioId: req.usuarioId }
        });
        res.status(201).json(casa);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar casa' });
    }
});
casasRouter.put('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const casa = await prisma.casa.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json(casa);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar casa' });
    }
});
casasRouter.delete('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.casa.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar casa' });
    }
});
casasRouter.get('/:id/saldo', authMiddleware_1.default, async (req, res) => {
    try {
        const casaId = parseInt(req.params.id);
        // Saldo apenas pelas movimentações
        const movimentacoes = await prisma.movimentacao.findMany({ where: { casaId } });
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
        res.status(500).json({ error: 'Erro ao calcular saldo' });
    }
});
// Rotas para Arbitragens
arbitragensRouter.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
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
        res.status(500).json({ error: 'Erro ao buscar arbitragens' });
    }
});
arbitragensRouter.post('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const data = {
            ...req.body,
            data: new Date(),
            usuarioId: req.usuarioId
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
                    casaId: arbitragem.casa1Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake1,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 1`,
                    usuarioId: req.usuarioId
                }
            }));
        }
        if (arbitragem.casa2Id && arbitragem.stake2) {
            movimentacoes.push(prisma.movimentacao.create({
                data: {
                    casaId: arbitragem.casa2Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake2,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 2`,
                    usuarioId: req.usuarioId
                }
            }));
        }
        if (arbitragem.casa3Id && arbitragem.stake3) {
            movimentacoes.push(prisma.movimentacao.create({
                data: {
                    casaId: arbitragem.casa3Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake3,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 3`,
                    usuarioId: req.usuarioId
                }
            }));
        }
        if (arbitragem.casa4Id && arbitragem.stake4) {
            movimentacoes.push(prisma.movimentacao.create({
                data: {
                    casaId: arbitragem.casa4Id,
                    tipo: 'aposta',
                    valor: arbitragem.stake4,
                    observacao: `Aposta arbitragem #${arbitragem.id} - Casa 4`,
                    usuarioId: req.usuarioId
                }
            }));
        }
        await Promise.all(movimentacoes);
        res.status(201).json(arbitragem);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({ error: 'Erro ao criar arbitragem', details: errorMessage });
    }
});
arbitragensRouter.put('/:id', authMiddleware_1.default, async (req, res) => {
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
        res.status(500).json({ error: 'Erro ao atualizar arbitragem' });
    }
});
// Endpoint para finalizar arbitragem com lado vencedor
arbitragensRouter.post('/:id/finalizar', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const { ladoVencedor } = req.body;
        const arbitragemId = parseInt(req.params.id);
        if (!ladoVencedor || !['casa1', 'casa2', 'casa3', 'casa4'].includes(ladoVencedor)) {
            res.status(400).json({ error: 'Lado vencedor deve ser "casa1", "casa2", "casa3" ou "casa4"' });
            return;
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
            res.status(404).json({ error: 'Arbitragem não encontrada' });
            return;
        }
        // Verificar se o lado vencedor é válido para o tipo de arbitragem
        const tipoArbitragem = arbitragem.tipo;
        const ladosValidos = {
            '2_resultados': ['casa1', 'casa2'],
            '3_resultados': ['casa1', 'casa2', 'casa3'],
            '4_resultados': ['casa1', 'casa2', 'casa3', 'casa4']
        };
        if (!ladosValidos[tipoArbitragem]?.includes(ladoVencedor)) {
            res.status(400).json({
                error: `Lado vencedor inválido para arbitragem de ${tipoArbitragem}`
            });
            return;
        }
        // Calcule valorTotalInvestir como soma das stakes
        const valorTotalInvestir = (arbitragem.stake1 || 0) +
            (arbitragem.stake2 || 0) +
            (arbitragem.stake3 || 0) +
            (arbitragem.stake4 || 0);
        // Calcule o lucro real do lado vencedor usando a soma das stakes
        let lucroReal = 0;
        if (ladoVencedor === 'casa1' && arbitragem.stake1 && arbitragem.odd1)
            lucroReal = (arbitragem.stake1 * arbitragem.odd1) - valorTotalInvestir;
        else if (ladoVencedor === 'casa2' && arbitragem.stake2 && arbitragem.odd2)
            lucroReal = (arbitragem.stake2 * arbitragem.odd2) - valorTotalInvestir;
        else if (ladoVencedor === 'casa3' && arbitragem.stake3 && arbitragem.odd3)
            lucroReal = (arbitragem.stake3 * arbitragem.odd3) - valorTotalInvestir;
        else if (ladoVencedor === 'casa4' && arbitragem.stake4 && arbitragem.odd4)
            lucroReal = (arbitragem.stake4 * arbitragem.odd4) - valorTotalInvestir;
        // Atualizar arbitragem com lado vencedor, status, lucroEsperado e valorTotalInvestir
        const arbitragemAtualizada = await prisma.arbitragem.update({
            where: { id: arbitragemId },
            data: {
                ladoVencedor,
                status: 'executada',
                lucroEsperado: lucroReal,
                valorTotalInvestir
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
                    casaId: casaPremiadaId,
                    tipo: 'premio',
                    valor: premio,
                    observacao: `Prêmio arbitragem #${arbitragem.id} (${ladoVencedor})`,
                    usuarioId: req.usuarioId
                }
            });
        }
        res.json({
            arbitragem: arbitragemAtualizada
        });
    }
    catch (error) {
        console.error('Erro ao finalizar arbitragem:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({ error: 'Erro ao finalizar arbitragem', details: errorMessage });
    }
});
arbitragensRouter.delete('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.arbitragem.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar arbitragem' });
    }
});
// Rotas para Freebets
freebetsRouter.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const freebets = await prisma.freebet.findMany({
            where: { usuarioId: req.usuarioId },
            include: { casa: true }
        });
        res.json(freebets);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar freebets' });
    }
});
freebetsRouter.post('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const data = {
            ...req.body,
            dataObtencao: new Date(req.body.dataObtencao),
            dataExpiracao: new Date(req.body.dataExpiracao),
            usuarioId: req.usuarioId
        };
        const freebet = await prisma.freebet.create({
            data: data,
            include: { casa: true }
        });
        res.status(201).json(freebet);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({ error: 'Erro ao criar freebet', details: errorMessage });
    }
});
freebetsRouter.put('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const freebet = await prisma.freebet.update({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId },
            data: req.body,
            include: { casa: true }
        });
        res.json(freebet);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar freebet' });
    }
});
freebetsRouter.delete('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.freebet.delete({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar freebet' });
    }
});
// Rotas para FreeSpins
freespinsRouter.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const freespins = await prisma.freeSpin.findMany({
            where: { usuarioId: req.usuarioId },
            include: { casa: true }
        });
        res.json(freespins);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar rodadas grátis' });
    }
});
freespinsRouter.post('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const { casaId, valorGanho } = req.body;
        const freespin = await prisma.freeSpin.create({
            data: {
                casaId: Number(casaId),
                valorGanho: Number(valorGanho),
                usuarioId: req.usuarioId
            },
            include: { casa: true }
        });
        await prisma.movimentacao.create({
            data: {
                casaId: Number(casaId),
                tipo: 'premio',
                valor: Number(valorGanho),
                observacao: `Prêmio de rodada grátis #${freespin.id}`,
                usuarioId: req.usuarioId
            }
        });
        res.status(201).json(freespin);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({ error: 'Erro ao criar rodada grátis', details: errorMessage });
    }
});
freespinsRouter.put('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const freespin = await prisma.freeSpin.update({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId },
            data: req.body,
            include: { casa: true }
        });
        res.json(freespin);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar rodada grátis' });
    }
});
freespinsRouter.delete('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.freeSpin.delete({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar rodada grátis' });
    }
});
// Rotas para Movimentações
movimentacoesRouter.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const movimentacoes = await prisma.movimentacao.findMany({
            where: { usuarioId: req.usuarioId },
            include: { casa: true }
        });
        res.json(movimentacoes);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar movimentações' });
    }
});
movimentacoesRouter.get('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const movimentacao = await prisma.movimentacao.findUnique({
            where: { id: parseInt(req.params.id), usuarioId: req.usuarioId },
            include: { casa: true }
        });
        if (!movimentacao) {
            res.status(404).json({ error: 'Movimentação não encontrada' });
            return;
        }
        res.json(movimentacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar movimentação' });
    }
});
movimentacoesRouter.post('/', authMiddleware_1.default, async (req, res) => {
    try {
        if (!req.usuarioId) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }
        const data = {
            ...req.body,
            data: req.body.data ? new Date(req.body.data) : new Date(),
            usuarioId: req.usuarioId
        };
        const movimentacao = await prisma.movimentacao.create({
            data,
            include: { casa: true }
        });
        res.status(201).json(movimentacao);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({ error: 'Erro ao criar movimentação', details: errorMessage });
    }
});
movimentacoesRouter.put('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        const movimentacao = await prisma.movimentacao.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
            include: { casa: true }
        });
        res.json(movimentacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar movimentação' });
    }
});
movimentacoesRouter.delete('/:id', authMiddleware_1.default, async (req, res) => {
    try {
        await prisma.movimentacao.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar movimentação' });
    }
});
movimentacoesRouter.delete('/batch', authMiddleware_1.default, async (req, res) => {
    console.log('DELETE /api/movimentacoes/batch body:', req.body);
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ error: 'Envie um array de IDs para exclusão.' });
            return;
        }
        await prisma.movimentacao.deleteMany({
            where: { id: { in: ids } }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar movimentações em lote' });
    }
});
// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API funcionando!' });
});
// Cadastro de usuário
app.post('/api/auth/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
        return;
    }
    try {
        const existing = await prisma.usuario.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ error: 'E-mail já cadastrado.' });
            return;
        }
        const hash = await bcryptjs_1.default.hash(senha, 10);
        const usuario = await prisma.usuario.create({
            data: { nome, email, senha: hash }
        });
        res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});
// Login de usuário
app.post('/api/auth/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        return;
    }
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            res.status(401).json({ error: 'Usuário ou senha inválidos.' });
            return;
        }
        const match = await bcryptjs_1.default.compare(senha, usuario.senha);
        if (!match) {
            res.status(401).json({ error: 'Usuário ou senha inválidos.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '7d' });
        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
