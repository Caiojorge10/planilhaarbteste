#!/bin/bash

echo "🔧 Configurando PgHero para importar dados..."

echo "📦 Instalando PgHero..."
if command -v brew &> /dev/null; then
    echo "✅ Homebrew encontrado, instalando via brew..."
    brew install pghero
else
    echo "⚠️  Homebrew não encontrado, instalando via gem..."
    gem install pghero
fi

echo ""
echo "🚀 Para usar o PgHero:"
echo ""
echo "1️⃣  Obter string de conexão do Render:"
echo "   - Acesse: https://dashboard.render.com"
echo "   - Vá para o serviço PostgreSQL"
echo "   - Clique em 'Connect' > 'External Connection'"
echo "   - Copie a string de conexão"
echo ""
echo "2️⃣  Iniciar PgHero:"
echo "   pghero config:add DATABASE_URL='sua_string_de_conexao'"
echo "   pghero web"
echo ""
echo "3️⃣  Abrir no navegador:"
echo "   http://localhost:8080"
echo ""
echo "4️⃣  Executar script:"
echo "   - Vá em 'Queries' ou 'Console'"
echo "   - Cole o conteúdo de: importar_dados_postgresql_final.sql"
echo "   - Execute o script"
echo ""
echo "📁 Arquivo pronto para importação:"
echo "   importar_dados_postgresql_final.sql (550 KB)"
echo ""
echo "💡 Dica: O PgHero vai mostrar o progresso da importação!"
