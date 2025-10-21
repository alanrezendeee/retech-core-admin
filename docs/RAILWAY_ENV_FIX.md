# 🚨 FIX: 404 em Produção - Login

## Problema Identificado

O frontend em produção (`https://core.theretech.com.br`) está tentando acessar:
```
https://core.theretech.com.br/api/auth/login
```

Mas a API está disponível em:
```
https://api-core.theretech.com.br/auth/login
```

## Causa

A variável `NEXT_PUBLIC_API_URL` está configurada como `/api` no Railway, fazendo o frontend tentar usar um path relativo ao invés do domínio completo da API.

## Solução

### 1. **No Railway - retech-core-admin (Frontend)**

Acesse: https://railway.app/project/61a85c6b-ad6b-45a6-acb2-793d2cfadd63/service/b9c5ffce-0e68-4e64-b496-5c3b963cbfb2/variables

**Atualize a variável:**
```bash
NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br
```

### 2. **Redeploy**

Após atualizar a variável, faça um novo deploy:
- O Railway vai automaticamente rebuildar com a nova variável
- Ou force um redeploy no painel

### 3. **Verificação**

Após o deploy, acesse:
```
https://core.theretech.com.br/admin/login
```

E verifique no Network tab do DevTools que as requisições estão indo para:
```
https://api-core.theretech.com.br/auth/login ✅
```

---

## Ambiente Local vs Produção

### **Local (Dev):**
```bash
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:8080
```
- Usa proxy do Next.js (`/api` → `http://localhost:8080`)
- Configurado em `next.config.ts`

### **Produção (Railway):**
```bash
NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br
NEXT_PUBLIC_APP_URL=https://core.theretech.com.br
```
- Frontend aponta diretamente para o domínio da API
- Sem proxy, comunicação direta

---

## CORS

Certifique-se que a API permite requisições de `https://core.theretech.com.br`:

```go
// internal/middleware/cors.go
allowedOrigins := []string{
    "http://localhost:3000",
    "https://core.theretech.com.br",
}
```

✅ Já está configurado corretamente!

---

## Checklist

- [ ] Atualizar `NEXT_PUBLIC_API_URL` no Railway
- [ ] Forçar redeploy do frontend
- [ ] Testar login em produção
- [ ] Verificar Network tab (deve chamar api-core.theretech.com.br)
- [ ] Confirmar que não há mais 404

---

**Data:** 2025-10-21  
**Status:** 🔧 Aguardando correção no Railway

