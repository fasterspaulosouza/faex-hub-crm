# FAEX HUB CRM — Backend API

API backend do sistema **FAEX HUB**, uma plataforma de CRM e colaboração social construída com NestJS e Prisma.

---

## O que é este projeto?

O FAEX HUB CRM é um sistema de gerenciamento de relacionamentos (CRM) com recursos de rede social interna. Ele permite:

- Gerenciar usuários com diferentes funções e permissões
- Autenticação segura com suporte a MFA (autenticação em dois fatores)
- Feed social com publicações, comentários e curtidas
- Base de conhecimento compartilhada
- Controle de acesso granular por módulo e grupo

---

## Tecnologias principais

| Tecnologia | Uso |
|---|---|
| [NestJS](https://nestjs.com/) | Framework principal (Node.js + TypeScript) |
| [Prisma](https://www.prisma.io/) | ORM para banco de dados |
| [MySQL](https://www.mysql.com/) | Banco de dados relacional |
| [JWT](https://jwt.io/) | Autenticação via tokens |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Hash de senhas |
| [otplib](https://github.com/yeojz/otplib) | Geração de códigos TOTP para MFA |
| [Swagger](https://swagger.io/) | Documentação automática da API |
| [Nodemailer + Brevo](https://nodemailer.com/) | Envio de e-mails transacionais |
| [AWS S3](https://aws.amazon.com/s3/) | Armazenamento de arquivos |

---

## Estrutura de pastas

```
faex-hub-crm/
├── src/
│   ├── app/                    # Módulos de funcionalidades
│   │   ├── auth/               # Login, cadastro, recuperação de senha
│   │   ├── usuarios/           # Gerenciamento de usuários
│   │   ├── mfa/                # Autenticação em dois fatores (2FA)
│   │   ├── grupos-acesso/      # Grupos e permissões de acesso
│   │   ├── modulos/            # Módulos do sistema
│   │   ├── amizades/           # Sistema de conexões entre usuários
│   │   ├── publicacoes/        # Feed social (posts, comentários, curtidas)
│   │   └── conhecimento/       # Base de conhecimento
│   ├── common/                 # Utilitários compartilhados
│   │   ├── decorators/         # Decorators customizados (@Usuario, @Permissao...)
│   │   ├── guards/             # Guards de autenticação e permissão
│   │   ├── interceptors/       # Interceptors de log
│   │   ├── middlewares/        # Captura de IP
│   │   ├── modules/            # Serviços de Prisma e Token
│   │   └── external/           # Templates e serviço de e-mail
│   ├── utils/                  # Funções utilitárias
│   ├── app.module.ts           # Módulo raiz
│   └── main.ts                 # Inicialização do servidor
├── prisma/
│   ├── schema.prisma           # Esquema do banco de dados
│   ├── migrations/             # Histórico de migrações
│   └── seeds/                  # Dados iniciais para o banco
└── test/                       # Testes unitários e E2E
```

---

## Como o projeto funciona

### Arquitetura

O projeto segue o padrão modular do NestJS. Cada funcionalidade é um módulo independente com:

```
Controller  →  recebe as requisições HTTP
Service     →  contém a lógica de negócio
Prisma      →  acessa o banco de dados
```

### Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação. Existem três tipos de token:

- `LOGIN` — token padrão após login (validade: 24h)
- `FORGET` — token para redefinição de senha (validade: 30min)
- `MFA_PENDENTE` — token temporário durante verificação MFA (validade: 5min)

O fluxo de login é:
1. Usuário envia e-mail e senha
2. Se MFA estiver ativo, recebe um token temporário e deve informar o código TOTP
3. Após validação, recebe o token de acesso definitivo

### Controle de Acesso

O sistema possui dois níveis de permissão:

- **Por grupo:** o usuário pertence a um grupo que define permissões coletivas
- **Individual:** permissões específicas atribuídas diretamente ao usuário

Níveis de permissão disponíveis: `NENHUM`, `LEITURA`, `ESCRITA`, `EXCLUSAO`

Funções de usuário: `ADMIN`, `USUARIO`, `PROFESSOR`, `ALUNO`, `PARCEIRO`, `ORGANIZACAO`

---

## Configuração e execução

### Pré-requisitos

- Node.js 18+
- MySQL rodando localmente (porta 3306)
- Arquivo `.env` configurado (veja `.env.example` se disponível)

### Variáveis de ambiente necessárias

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET="sua-chave-secreta"
MAIL_HOST="relay.brevo.com"
MAIL_PORT=587
MAIL_USER="seu-usuario"
MAIL_PASS="sua-senha"
PORT=3000
```

### Instalação

```bash
# Instalar dependências
npm install

# Aplicar o schema no banco de dados
npm run prisma:push

# Popular o banco com dados iniciais
npm run prisma:seed

# Iniciar em modo de desenvolvimento
npm run dev
```

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo watch (desenvolvimento) |
| `npm run build` | Compila o projeto |
| `npm run start:prod` | Inicia em produção |
| `npm run prisma:push` | Aplica o schema no banco sem migração |
| `npm run prisma:migrate` | Cria e aplica migrações |
| `npm run prisma:studio` | Abre o Prisma Studio (UI do banco) |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes end-to-end |

---

## Documentação da API

Com o servidor rodando, acesse a documentação interativa (Swagger) em:

```
http://localhost:3000/swagger
```

Uma coleção do Postman também está disponível na raiz do projeto: `faex-hub-crm.postman_collection.json`

---

## Banco de dados

O schema Prisma define os seguintes modelos principais:

| Modelo | Descrição |
|---|---|
| `Usuario` | Usuário do sistema |
| `UsuarioMfa` | Configuração de 2FA do usuário |
| `UsuarioRecuperacao` | Tokens de recuperação de senha |
| `GrupoAcesso` | Grupos de permissão |
| `Modulo` | Módulos do sistema |
| `Amizade` | Relacionamentos entre usuários |
| `Publicacao` | Posts do feed social |
| `PublicacaoComentario` | Comentários em publicações |
| `PublicacaoCurtida` | Curtidas em publicações |
| `PublicacaoConhecimento` | Artigos da base de conhecimento |

---

## Segurança

- Senhas armazenadas com **bcrypt** (hash + salt)
- Rate limiting: 10 requisições por 60 segundos (global)
- CORS configurado para origens autorizadas
- Verificação de e-mail no cadastro
- Bloqueio após tentativas falhas de MFA

---

## Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de código
npm run test:cov
```
