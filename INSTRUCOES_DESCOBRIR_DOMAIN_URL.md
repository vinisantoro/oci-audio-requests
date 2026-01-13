# Como Descobrir a URL do OCI Domain

Você forneceu o OCID do Domain: `ocid1.domain.oc1..aaaaaaaab77apuidncb43h7tgvbhinpqzichb3a5l2yvenjfantfuscykbeq`

Agora precisamos descobrir a URL do Domain. Siga estes passos:

## Método 1: Via OCI Console (Recomendado)

1. Acesse o [OCI Console](https://cloud.oracle.com/)
2. Faça login com suas credenciais
3. Vá para **Identity & Security > Domains**
4. Procure pelo Domain com OCID: `ocid1.domain.oc1..aaaaaaaab77apuidncb43h7tgvbhinpqzichb7tgvbhinpqzichb3a5l2yvenjfantfuscykbeq`
5. Clique no Domain para abrir os detalhes
6. Na página de detalhes, procure por:
   - **"Domain URL"**
   - **"Hostname"**
   - **"Service URL"**
   - Ou qualquer campo que mostre uma URL HTTPS

A URL geralmente tem um destes formatos:
- `https://<domain-id>.identity.oraclecloud.com`
- `https://<tenant-name>.idcs.oci.oraclecloud.com`
- `https://<region>.identity.oraclecloud.com/<domain-id>`

## Método 2: Via OCI CLI

Se você tem o OCI CLI configurado:

```bash
oci iam domain get --domain-id ocid1.domain.oc1..aaaaaaaab77apuidncb43h7tgvbhinpqzichb3a5l2yvenjfantfuscykbeq
```

Procure no output por campos como `url`, `hostname`, ou `serviceUrl`.

## Método 3: Tentar Padrões Comuns

Se você conhece o nome do seu tenant ou região, pode tentar:

- `https://<tenant-name>.idcs.oci.oraclecloud.com`
- `https://identity.oraclecloud.com/v1/domains/<domain-id>`

## ⚠️ Importante

Depois de descobrir a URL, você precisa:

1. **Atualizar `.env.local`** com a URL correta
2. **Configurar na Vercel** a variável `OCI_DOMAIN_URL` com a URL correta
3. **Verificar** se a URL está acessível (deve retornar uma página de login ou similar)

## 📝 Exemplo

Se você descobrir que a URL é `https://mycompany.idcs.oci.oraclecloud.com`, então:

- No `.env.local`: `OCI_DOMAIN_URL=https://mycompany.idcs.oci.oraclecloud.com`
- Na Vercel: Configure `OCI_DOMAIN_URL` com o mesmo valor

---

**Por favor, me informe a URL do Domain assim que descobrir para que eu possa atualizar os arquivos de configuração.**
