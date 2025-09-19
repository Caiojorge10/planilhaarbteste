#!/bin/bash

echo "🚀 Importando dados via API do Render..."

# URL do backend
BACKEND_URL="https://planilhaarbteste.onrender.com"

echo "📊 Verificando backend..."
if curl -s "$BACKEND_URL/api/health" | grep -q "OK"; then
    echo "✅ Backend está online!"
else
    echo "❌ Backend não está respondendo"
    exit 1
fi

echo ""
echo "📋 OPÇÕES PARA IMPORTAR DADOS:"
echo ""
echo "1️⃣  VIA PAINEL DO RENDER (RECOMENDADO):"
echo "   - Acesse: https://dashboard.render.com"
echo "   - Vá para o serviço PostgreSQL"
echo "   - Clique em 'Connect' > 'External Connection'"
echo "   - Use um cliente PostgreSQL (pgAdmin, DBeaver, etc.)"
echo "   - Execute o arquivo: importar_dados_postgresql_final.sql"
echo ""
echo "2️⃣  VIA TERMINAL (se tiver psql instalado):"
echo "   - Instale: brew install postgresql"
echo "   - Conecte: psql 'sua_string_de_conexao'"
echo "   - Execute: \\i importar_dados_postgresql_final.sql"
echo ""
echo "3️⃣  VIA SCRIPT NODE.JS (criar endpoint de importação):"
echo "   - Posso criar um endpoint no backend para importar"
echo "   - Mais complexo, mas automático"
echo ""
echo "💡 RECOMENDAÇÃO: Use a opção 1 (painel do Render)"
echo ""
echo "📁 Arquivos prontos para importação:"
ls -la *.sql
echo ""
echo "🤔 Qual opção você prefere?"
