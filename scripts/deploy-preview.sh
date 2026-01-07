#!/bin/bash

# Script para fazer deploy preview com domínio notes.dailybits.tech
# Uso: ./scripts/deploy-preview.sh

set -e

echo "🚀 Deploy Preview - notes.dailybits.tech"
echo "=========================================="
echo ""

# Verificar se está na branch correta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/saml-sso-authentication" ]; then
    echo "⚠️  Você está na branch: $CURRENT_BRANCH"
    echo "   Este script é para a branch: feature/saml-sso-authentication"
    read -p "   Continuar mesmo assim? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não está instalado."
    echo "   Instale com: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI encontrado"
echo ""

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Você não está logado no Vercel."
    echo "   Executando: vercel login"
    vercel login
fi

echo "✅ Autenticado no Vercel"
echo ""

# Verificar variáveis de ambiente
echo "📋 Verificando variáveis de ambiente..."
echo ""
echo "⚠️  IMPORTANTE: Configure as seguintes variáveis no Vercel Dashboard:"
echo "   - OCI_IDP_METADATA_URL"
echo "   - SAML_SP_BASE_URL=https://notes.dailybits.tech"
echo "   - SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata"
echo "   - SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback"
echo "   - SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout"
echo "   - OCI_UPLOAD_URL"
echo ""
read -p "   Variáveis configuradas? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Configure as variáveis primeiro no Vercel Dashboard"
    echo "   Vercel Dashboard > Settings > Environment Variables > Preview"
    exit 1
fi

echo ""
echo "🚀 Iniciando deploy preview..."
echo ""

# Fazer deploy
vercel --preview --yes

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Verifique o deployment no Vercel Dashboard"
echo "   2. Acesse: https://notes.dailybits.tech"
echo "   3. Verifique Metadata: https://notes.dailybits.tech/api/saml/metadata"
echo "   4. Registre a aplicação no CORP-IDCS com as URLs acima"
echo "   5. Teste o fluxo completo de autenticação"
echo ""

