#!/bin/bash

echo "🔧 Configurando Prisma Client..."

# Gerar Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate --schema=./prisma/schema.prod.prisma

# Verificar se foi gerado
if [ -d "node_modules/.prisma/client" ]; then
    echo "✅ Prisma Client gerado com sucesso!"
else
    echo "❌ Erro ao gerar Prisma Client!"
    exit 1
fi

# Aplicar migrações
echo "🗄️ Aplicando migrações..."
npx prisma db push --schema=./prisma/schema.prod.prisma

echo "✅ Setup concluído!"
