# 🔧 FIX: Erro 404 em Produção

## 🐛 **Problema:**

```
❌ https://core.theretech.com.br/api/auth/login
   → 404 Not Found
```

---

## ✅ **Solução:**

### **1. Acessar Railway Dashboard**

```
https://railway.app
→ Seu projeto (retech-core-admin)
→ Aba "Variables"
```

---

### **2. Adicionar Variável de Ambiente**

```
Clique em: "+ New Variable"

Name:  NEXT_PUBLIC_API_URL
Value: https://api-core.theretech.com.br

Clique em: "Add"
```

---

### **3. Redeploy**

```
Aba "Deployments"
→ Clique em "Deploy" (botão roxo no topo direito)
→ Ou: Settings → "Trigger Deploy"
```

**⚠️ IMPORTANTE:** Apenas reiniciar **NÃO** funciona! Precisa fazer **redeploy** completo para ler a nova variável de ambiente.

---

### **4. Aguardar Build (~2-3 minutos)**

```
Logs vão mostrar:
✓ Compiled successfully
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages
```

---

### **5. Testar**

```
Acessar: https://core.theretech.com.br/admin/login

Tentar fazer login
```

**Verificar Network tab (F12):**
```
✅ Request URL: https://api-core.theretech.com.br/auth/login
✅ Status: 200 OK
```

---

## 🎯 **Como Funciona:**

### **Antes (ERRADO):**

```
Frontend: https://core.theretech.com.br
↓
Tenta acessar: /api/auth/login
↓
URL final: https://core.theretech.com.br/api/auth/login
                                        ↑
                                    ❌ 404 (não existe)
```

### **Depois (CORRETO):**

```
Frontend: https://core.theretech.com.br
↓
Usa NEXT_PUBLIC_API_URL: https://api-core.theretech.com.br
↓
URL final: https://api-core.theretech.com.br/auth/login
                                              ↑
                                          ✅ 200 OK
```

---

## 📋 **Screenshot do Railway:**

```
┌─────────────────────────────────────────────┐
│  retech-core-admin                          │
├─────────────────────────────────────────────┤
│  Variables                                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ + New Variable                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  NEXT_PUBLIC_API_URL                        │
│  https://api-core.theretech.com.br          │
│  [Edit] [Delete]                            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ⚡ **Comando Rápido (Railway CLI):**

```bash
# Se você usa Railway CLI:
railway variables set NEXT_PUBLIC_API_URL=https://api-core.theretech.com.br

# Redeploy
railway up --detach
```

---

## 🔍 **Verificar se Funcionou:**

### **1. Abrir DevTools (F12)**

### **2. Aba Network**

### **3. Fazer login**

### **4. Verificar requisição:**

```
Request URL: https://api-core.theretech.com.br/auth/login
Request Method: POST
Status Code: 200 OK
```

**Se ainda estiver com `/api`:**
```
Request URL: https://core.theretech.com.br/api/auth/login
                                        ↑
                                    ❌ ERRADO
```

**Causa:** Build não foi feito ou variável não foi salva corretamente.

**Solução:** Deletar deploy anterior e fazer deploy novo.

---

## ✅ **Checklist:**

- [ ] Variável `NEXT_PUBLIC_API_URL` adicionada no Railway
- [ ] Valor: `https://api-core.theretech.com.br` (SEM barra no final)
- [ ] Redeploy feito (não apenas restart)
- [ ] Build completado com sucesso
- [ ] Login testado em produção
- [ ] Network tab mostra URL correta
- [ ] Resposta 200 OK

---

**Pronto! Agora o frontend vai acessar a API corretamente! 🎉**

