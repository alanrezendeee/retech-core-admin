# 🔧 FIX: Variáveis NEXT_PUBLIC_* no Docker Build

## ❌ Problema Identificado

O Dockerfile estava fazendo build do Next.js **SEM** as variáveis `NEXT_PUBLIC_*`, resultando em:

```javascript
// No navegador (produção):
process.env.NEXT_PUBLIC_API_URL === '/api'  // ❌ Hardcoded do código!
```

Ao invés de:

```javascript
// O que deveria ser:
process.env.NEXT_PUBLIC_API_URL === 'https://api-core.theretech.com.br'  // ✅ Do Railway!
```

---

## 🔍 Causa Raiz

No Next.js, variáveis `NEXT_PUBLIC_*` são **embutidas no código JavaScript durante o build**!

Elas **NÃO** são variáveis de runtime, são substituídas por seus valores literais durante a compilação.

**Exemplo:**
```typescript
// Código fonte:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Após build (se variável = 'https://api.com'):
const apiUrl = 'https://api.com';  // ← Valor hardcoded!
```

**O problema:** O Dockerfile não estava passando essas variáveis para o **build stage**!

---

## ✅ Solução Implementada

Atualizamos o `Dockerfile.railway` para receber as variáveis como **ARG** e disponibilizá-las como **ENV** durante o build:

```dockerfile
# Rebuild do código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# ⚠️ IMPORTANTE: Variáveis NEXT_PUBLIC_* precisam estar disponíveis no BUILD
# Elas são injetadas pelo Railway automaticamente via ARG
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_URL

# Tornar as ARGs disponíveis como ENV durante o build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build da aplicação (agora com as variáveis corretas)
RUN yarn build
```

---

## 🎯 Como Funciona?

### **1. Railway passa as variáveis como `--build-arg`**

Quando o Railway faz o build, ele automaticamente passa as variáveis de ambiente como build args:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br \
  --build-arg NEXT_PUBLIC_APP_NAME="Retech Core" \
  --build-arg NEXT_PUBLIC_APP_URL=https://core.theretech.com.br \
  -f Dockerfile.railway .
```

### **2. Dockerfile recebe via `ARG`**

```dockerfile
ARG NEXT_PUBLIC_API_URL  # ← Recebe do Railway
```

### **3. Dockerfile converte `ARG` → `ENV`**

```dockerfile
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL  # ← Disponível no build
```

### **4. Next.js embute os valores durante `yarn build`**

```dockerfile
RUN yarn build  # ← Next.js lê as ENV e embute no código
```

### **5. Resultado final no JavaScript**

```javascript
// lib/api/client.ts (após build)
const api = axios.create({
  baseURL: 'https://api-core.theretech.com.br',  // ✅ Valor correto!
});
```

---

## 🚀 Deploy e Teste

### **1. Commit e Push**

```bash
cd /Users/alanleitederezende/source/theretech/projetos-producao/retech-core-admin

git add Dockerfile.railway
git commit -m "fix: adicionar NEXT_PUBLIC_* vars ao Docker build stage"
git push origin main
```

### **2. Railway fará rebuild automático**

O Railway detectará o novo Dockerfile e fará rebuild automaticamente.

**Logs que você deve ver:**
```
[builder] ARG NEXT_PUBLIC_API_URL
[builder] ARG NEXT_PUBLIC_APP_NAME
[builder] ARG NEXT_PUBLIC_APP_URL
[builder] ENV NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br
[builder] Building...
[builder] ✓ Compiled successfully
```

### **3. Verificar no navegador**

Após deploy, acesse: `https://core.theretech.com.br/admin/login`

Abra o console (F12) e digite:
```javascript
console.log(window.location.origin);  // https://core.theretech.com.br
```

Teste o login → Network tab deve mostrar:
```
✅ Request URL: https://api-core.theretech.com.br/auth/login
✅ Status: 200 OK
```

---

## 📋 Checklist de Verificação

Após o deploy:

- [ ] Build completou sem erros
- [ ] Logs mostram as variáveis sendo setadas
- [ ] Login funciona em produção
- [ ] Network tab mostra chamadas para `api-core.theretech.com.br`
- [ ] Console não mostra erros 404
- [ ] Dashboard carrega corretamente
- [ ] Activity Logs funcionando com dados reais

---

## 🎓 Lições Aprendidas

### **1. Next.js Build-time vs Runtime**

| Tipo de Variável | Quando é usada | Onde está disponível |
|------------------|----------------|----------------------|
| `NEXT_PUBLIC_*` | **Build-time** | Código JavaScript embutido |
| Outras ENV | **Runtime** | Apenas server-side (SSR, API routes) |

### **2. Docker Multi-stage Build**

```dockerfile
FROM ... AS builder     # ← Precisa das NEXT_PUBLIC_* aqui!
  RUN yarn build        # ← Build acontece aqui

FROM ... AS runner      # ← Runtime não precisa das NEXT_PUBLIC_*
  CMD ["node", "server.js"]
```

### **3. ARG vs ENV no Dockerfile**

```dockerfile
ARG MYVAR              # Build-time only (disponível durante docker build)
ENV MYVAR=$MYVAR       # Runtime + Build (disponível durante build E runtime)
```

Para variáveis `NEXT_PUBLIC_*`, precisamos de **AMBOS**:
- `ARG` para receber do Railway
- `ENV` para disponibilizar ao Next.js durante o build

---

## 🆘 Troubleshooting

### **Problema: Ainda chamando `/api`**

**Causa:** Build usou cache antigo.

**Solução:** Force rebuild sem cache:
```bash
# No Railway: Settings → Delete Build Cache
# Depois: Redeploy
```

### **Problema: Variáveis não aparecem nos logs**

**Causa:** Railway não está passando as variáveis.

**Solução:** Verificar se as variáveis estão setadas em:
```
Railway → Service → Variables → NEXT_PUBLIC_API_URL
```

### **Problema: 404 ainda acontecendo**

**Causa:** CORS bloqueando.

**Solução:** Verificar backend permite `core.theretech.com.br`:
```go
// retech-core/internal/http/router.go
allowedOrigins := []string{
    "https://core.theretech.com.br",  // ✅ Deve estar aqui
}
```

---

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Docker ARG vs ENV](https://docs.docker.com/engine/reference/builder/#arg)
- [Railway Build Args](https://docs.railway.app/deploy/builds#build-arguments)

---

**Data:** 2025-10-21  
**Status:** ✅ CORRIGIDO  
**Impacto:** 🔴 CRÍTICO (Bloqueador para produção)

