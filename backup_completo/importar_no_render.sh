#!/bin/bash

echo "🚀 Importando dados para o Render..."

# URL do backend no Render
BACKEND_URL="https://planilhaarbteste.onrender.com"

echo "📊 Verificando se o backend está online..."
if curl -s "$BACKEND_URL/api/health" | grep -q "OK"; then
    echo "✅ Backend está online!"
else
    echo "❌ Backend não está respondendo. Verifique se está rodando."
    exit 1
fi

echo "📁 Arquivos de backup disponíveis:"
ls -la *.sql *.csv

echo ""
echo "📋 Para importar os dados, você tem as seguintes opções:"
echo ""
echo "1️⃣  USAR O SCRIPT SQL COMPLETO:"
echo "   - Arquivo: importar_dados_postgresql_final.sql (550 KB)"
echo "   - Contém: Estrutura + Dados completos"
echo ""
echo "2️⃣  USAR ARQUIVOS CSV INDIVIDUAIS:"
echo "   - casas.csv (113 registros)"
echo "   - arbitragens.csv (654 registros)" 
echo "   - movimentacoes.csv (2.896 registros)"
echo "   - freespins.csv (138 registros)"
echo "   - ganhos.csv (118 registros)"
echo "   - percas.csv (73 registros)"
echo "   - usuarios.csv (1 registro)"
echo ""
echo "3️⃣  USAR BACKUP SQLITE ORIGINAL:"
echo "   - Arquivo: backup_completo_sqlite.sql (562 KB)"
echo "   - Contém: Dados originais do SQLite"
echo ""
echo "💡 RECOMENDAÇÃO: Use a opção 1 (script PostgreSQL completo)"
echo ""
echo "🔧 PRÓXIMOS PASSOS:"
echo "1. Acesse o painel do Render"
echo "2. Vá para o seu serviço PostgreSQL"
echo "3. Use o console SQL ou conecte via cliente PostgreSQL"
echo "4. Execute o arquivo: importar_dados_postgresql_final.sql"
echo ""
echo "📞 Se precisar de ajuda com a importação, me avise!"
