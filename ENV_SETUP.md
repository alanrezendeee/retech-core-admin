# 🔐 Configuração de Variáveis de Ambiente

## 📋 Variáveis Necessárias

### **NEXT_PUBLIC_API_URL**

Define a URL base da API que o frontend vai consumir.

---

## 🏠 **Desenvolvimento Local**

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_API_URL=/api
```

**Como funciona:**
- O Next.js usa `rewrites` no `next.config.ts` para fazer proxy
- Requisições para `/api/*` são redirecionadas para `http://localhost:8080/*`
- Não precisa configurar CORS complexo em desenvolvimento

---

## 🚀 **Produção (Railway)**

No Railway, configure a variável de ambiente:

```bash
NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br
```

### **Como configurar no Railway:**

#### **Via Dashboard:**

1. Acesse seu projeto no Railway
2. Vá em **Variables**
3. Clique em **New Variable**
4. Adicione:
   ```
   Name:  NEXT_PUBLIC_API_URL
   Value: https://api-core.theretech.com.br
   ```
5. Clique em **Add**
6. **Redeploy** o frontend

#### **Via CLI (railway.json):**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api-core.theretech.com.br"
  }
}
```

---

## 🔍 **Verificar Configuração**

### **No código (client.ts):**

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  // ↑ Se NEXT_PUBLIC_API_URL não estiver definida, usa '/api' (local)
});
```

### **Comportamento:**

| Ambiente | NEXT_PUBLIC_API_URL | Requisição | URL Final |
|----------|---------------------|------------|-----------|
| **Local** | `/api` | `/auth/login` | `http://localhost:8080/auth/login` (via proxy) |
| **Produção** | `https://api-core.theretech.com.br` | `/auth/login` | `https://api-core.theretech.com.br/auth/login` |

---

## ⚠️ **Problemas Comuns**

### **1. Erro 404 em Produção:**

**Causa:** Variável `NEXT_PUBLIC_API_URL` não configurada

**Solução:**
```bash
# No Railway, adicionar:
NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br

# Redeploy
```

---

### **2. CORS Error em Produção:**

**Causa:** API não está permitindo `https://core.theretech.com.br`

**Solução:** Verificar CORS no backend Go (`router.go`):
```go
origin := c.Request.Header.Get("Origin")
if origin == "https://core.theretech.com.br" || origin == "http://localhost:3000" {
    c.Header("Access-Control-Allow-Origin", origin)
}
```

---

### **3. Variável não é lida:**

**Causa:** Variáveis `NEXT_PUBLIC_*` só são lidas no **build time**

**Solução:**
1. Configurar variável no Railway
2. **Redeploy** o frontend (não basta reiniciar!)
3. Verificar nos logs do build:
   ```
   ▲ Next.js 14.x.x
   - env NEXT_PUBLIC_API_URL
   ```

---

## 🧪 **Testar Localmente**

### **1. Com proxy (recomendado):**

```bash
# .env.local
NEXT_PUBLIC_API_URL=/api

# Terminal 1: Backend
cd retech-core
docker-compose -f build/docker-compose.yml up

# Terminal 2: Frontend
cd retech-core-admin
npm run dev

# Acessar
http://localhost:3000
```

**Requisições vão para:** `http://localhost:8080` (via proxy)

---

### **2. Sem proxy (simular produção):**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080

# Mesmo fluxo acima
```

**Requisições vão para:** `http://localhost:8080` (direto)

---

## 📝 **Checklist de Deploy**

Antes de fazer deploy em produção:

- [ ] Backend rodando em `https://api-core.theretech.com.br`
- [ ] Backend permite CORS de `https://core.theretech.com.br`
- [ ] Frontend tem variável `NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br`
- [ ] Frontend foi **rebuilded** após adicionar variável
- [ ] Testar login em produção
- [ ] Verificar Network tab do navegador (deve apontar para API correta)

---

## 🔧 **Debug em Produção**

### **1. Verificar qual URL está sendo usada:**

Abra DevTools → Network → Tente fazer login

**Esperado:**
```
Request URL: https://api-core.theretech.com.br/auth/login
Status: 200 OK
```

**Se estiver assim (ERRADO):**
```
Request URL: https://core.theretech.com.br/api/auth/login
Status: 404 Not Found
```

**Causa:** Frontend ainda está usando `/api` (variável não configurada)

---

### **2. Logs do Railway:**

```bash
# Ver variáveis de ambiente no build
railway logs --deployment DEPLOYMENT_ID

# Procurar por:
NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br
```

---

## ✅ **Solução Rápida para o Erro Atual**

```bash
# 1. No Railway (frontend):
#    Variables → Add New Variable
NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br

# 2. Redeploy do frontend
#    Dashboard → Deploy → Trigger Deploy

# 3. Aguardar build (~2-3 min)

# 4. Testar
https://core.theretech.com.br/admin/login

# 5. Verificar Network tab
#    Request URL deve ser: https://api-core.theretech.com.br/auth/login
```

---

**Resumo:** Configure `NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br` no Railway e redeploy! 🚀

