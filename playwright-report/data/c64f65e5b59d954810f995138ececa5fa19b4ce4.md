# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e7]: RT
      - generic [ref=e8]: Admin Dashboard
      - generic [ref=e9]: Acesso exclusivo para super administradores
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Email
          - textbox "Email" [ref=e14]:
            - /placeholder: admin@theretech.com
        - generic [ref=e15]:
          - generic [ref=e16]: Senha
          - textbox "Senha" [ref=e17]:
            - /placeholder: ••••••••
        - button "Entrar" [ref=e18]
      - generic [ref=e19]:
        - text: Não é admin?
        - link "Acessar portal do desenvolvedor" [ref=e20] [cursor=pointer]:
          - /url: /painel/login
  - alert [ref=e21]
```