#!/bin/bash

echo "📦 Dividindo script em partes menores para importação..."

# Extrair apenas as tabelas (estrutura)
grep -E "CREATE TABLE|INSERT INTO" importar_dados_postgresql_final.sql > estrutura_completa.sql

# Extrair apenas os dados por tabela
grep "INSERT INTO.*Casa" importar_dados_postgresql_final.sql > dados_casas.sql
grep "INSERT INTO.*Arbitragem" importar_dados_postgresql_final.sql > dados_arbitragens.sql
grep "INSERT INTO.*Movimentacao" importar_dados_postgresql_final.sql > dados_movimentacoes.sql
grep "INSERT INTO.*Freespin" importar_dados_postgresql_final.sql > dados_freespins.sql
grep "INSERT INTO.*Ganho" importar_dados_postgresql_final.sql > dados_ganhos.sql
grep "INSERT INTO.*Perca" importar_dados_postgresql_final.sql > dados_percas.sql
grep "INSERT INTO.*Usuario" importar_dados_postgresql_final.sql > dados_usuarios.sql

echo "✅ Scripts criados:"
echo "📁 estrutura_completa.sql - Estrutura das tabelas"
echo "📁 dados_casas.sql - $(wc -l < dados_casas.sql) registros de casas"
echo "📁 dados_arbitragens.sql - $(wc -l < dados_arbitragens.sql) registros de arbitragens"
echo "📁 dados_movimentacoes.sql - $(wc -l < dados_movimentacoes.sql) registros de movimentações"
echo "📁 dados_freespins.sql - $(wc -l < dados_freespins.sql) registros de freespins"
echo "📁 dados_ganhos.sql - $(wc -l < dados_ganhos.sql) registros de ganhos"
echo "📁 dados_percas.sql - $(wc -l < dados_percas.sql) registros de perdas"
echo "📁 dados_usuarios.sql - $(wc -l < dados_usuarios.sql) registros de usuários"
echo ""
echo "💡 Agora você pode importar por partes no PgHero!"
