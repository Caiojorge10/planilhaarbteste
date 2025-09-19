#!/bin/bash
echo "Instalando dependências..."
npm install

echo "Gerando cliente Prisma..."
npx prisma generate

echo "Aplicando migrações..."
npx prisma db push

echo "Compilando TypeScript..."
npm run build

echo "Deploy concluído!"
