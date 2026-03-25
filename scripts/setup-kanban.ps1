param(
  [string]$Repo = "beatrizamante/topicos-especiais"
)

$ErrorActionPreference = "Stop"

function Ensure-GhAuth {
  $status = gh auth status 2>$null
  if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI nao autenticado. Rode: gh auth login"
  }
}

function Ensure-Label {
  param(
    [string]$Name,
    [string]$Color,
    [string]$Description
  )

  gh label create $Name --repo $Repo --color $Color --description $Description --force | Out-Null
}

function Create-Issue {
  param(
    [string]$Title,
    [string]$Body,
    [string[]]$Labels
  )

  $labelArg = ($Labels -join ",")
  gh issue create --repo $Repo --title $Title --body $Body --label $labelArg | Out-Null
}

Ensure-GhAuth

# Labels base
$labels = @(
  @{ name = "feature"; color = "1D76DB"; desc = "Nova funcionalidade" },
  @{ name = "docs"; color = "0E8A16"; desc = "Documentacao" },
  @{ name = "backend"; color = "B60205"; desc = "Backend/API" },
  @{ name = "frontend"; color = "5319E7"; desc = "Frontend/UI" },
  @{ name = "test"; color = "FBCA04"; desc = "Testes e qualidade" },
  @{ name = "devops"; color = "0052CC"; desc = "Infra e automacao" },
  @{ name = "auth"; color = "D93F0B"; desc = "Autenticacao e seguranca" },
  @{ name = "prisma"; color = "006B75"; desc = "Banco e ORM" },
  @{ name = "ci-cd"; color = "C2E0C6"; desc = "Pipeline e deploy" },
  @{ name = "priority:high"; color = "B60205"; desc = "Alta prioridade" },
  @{ name = "priority:medium"; color = "FBCA04"; desc = "Media prioridade" },
  @{ name = "priority:low"; color = "0E8A16"; desc = "Baixa prioridade" }
)

foreach ($l in $labels) {
  Ensure-Label -Name $l.name -Color $l.color -Description $l.desc
}

# Issues mapeadas do checklist
Create-Issue -Title "ID3 - Documentar evidencias de uso de IA (RA1)" -Body @"
Checklist:
- [ ] IA utilizada para gerar/revisar PRD e SDD
- [ ] Evidencias de uso de IA documentadas (prints ou historico)

Criterio de aceite:
- Evidencias anexadas no repositorio (docs) e referenciadas no README.
"@ -Labels @("docs", "priority:medium")

Create-Issue -Title "ID4 - Criar Kanban e mapear historias como Issues (RA1)" -Body @"
Checklist:
- [ ] Kanban criado no GitHub Projects
- [ ] Historias de usuario mapeadas como Issues
- [ ] Colunas configuradas (To Do, In Progress, Done)
- [ ] Labels criados (feature, bug, docs, etc.)

Criterio de aceite:
- Projeto criado e todas as issues deste backlog adicionadas ao board.
"@ -Labels @("docs", "devops", "priority:high")

Create-Issue -Title "ID5 - Inicializar projeto NestJS no backend (RA2)" -Body @"
Checklist:
- [ ] Projeto NestJS criado em backend/
- [ ] package.json com dependencias (NestJS, Prisma, JWT, etc.)
- [ ] tsconfig.json configurado
- [ ] Estrutura de modulos seguindo o SDD
"@ -Labels @("backend", "feature", "priority:high")

Create-Issue -Title "ID6 - Configurar Prisma ORM e migrations (RA2)" -Body @"
Checklist:
- [ ] schema.prisma implementado conforme SDD
- [ ] Migrations geradas e aplicadas
- [ ] PrismaService criado como modulo global
- [ ] Seed script para dados iniciais
"@ -Labels @("backend", "prisma", "feature", "priority:high")

Create-Issue -Title "ID7 - Implementar CRUD completo de dominio (RA2)" -Body @"
Checklist:
- [ ] CRUD de Usuarios
- [ ] CRUD de Ficcoes Interativas
- [ ] CRUD de Escritores
- [ ] CRUD de Avaliacoes
- [ ] Paginacao nas listagens
"@ -Labels @("backend", "feature", "priority:high")

Create-Issue -Title "ID8 - Implementar autenticacao JWT (RA2)" -Body @"
Checklist:
- [ ] Registro de usuario com hash bcrypt
- [ ] Login retornando token JWT
- [ ] Guard JWT protegendo rotas
- [ ] Estrategia Passport-JWT implementada
- [ ] Validacao de autoria nos endpoints protegidos
"@ -Labels @("backend", "auth", "feature", "priority:high")

Create-Issue -Title "ID9 - Validacao e tratamento de erros (RA2)" -Body @"
Checklist:
- [ ] DTOs com class-validator para cada endpoint
- [ ] ValidationPipe global configurado
- [ ] Tratamento de erros com codigos HTTP adequados
- [ ] Mensagens de erro claras e padronizadas
"@ -Labels @("backend", "feature", "priority:medium")

Create-Issue -Title "ID10 - Criar testes unitarios com cobertura minima (RA3)" -Body @"
Checklist:
- [ ] Testes unitarios nos Services
- [ ] Prisma Client mockado
- [ ] Cenarios de sucesso e erro
- [ ] Cobertura minima de 70%
"@ -Labels @("test", "backend", "priority:high")

Create-Issue -Title "ID11 - Criar testes E2E e fluxo completo (RA3)" -Body @"
Checklist:
- [ ] Testes e2e nos Controllers principais
- [ ] Fluxo completo testado (registro -> login -> CRUD)
- [ ] Banco de teste isolado
- [ ] Comandos de teste documentados no README
"@ -Labels @("test", "backend", "priority:high")

Create-Issue -Title "ID12 - Criar frontend React com paginas base (RA4)" -Body @"
Checklist:
- [ ] Projeto React criado em frontend/
- [ ] Paginas principais implementadas
- [ ] Componentes reutilizaveis
- [ ] Roteamento configurado
"@ -Labels @("frontend", "feature", "priority:medium")

Create-Issue -Title "ID13 - Integrar consumo da API no frontend (RA4)" -Body @"
Checklist:
- [ ] Servico HTTP configurado
- [ ] Token JWT enviado nos headers
- [ ] Tratamento de erros da API
- [ ] Loading states nas requisicoes
"@ -Labels @("frontend", "feature", "priority:medium")

Create-Issue -Title "ID14 - Finalizar integracao frontend-backend (RA4)" -Body @"
Checklist:
- [ ] CORS configurado no backend
- [ ] Frontend consumindo endpoints da API
- [ ] Fluxo completo funcionando
"@ -Labels @("frontend", "backend", "feature", "priority:high")

Create-Issue -Title "ID15 - Criar pipeline CI no GitHub Actions (RA5)" -Body @"
Checklist:
- [ ] Workflow .github/workflows/ci.yml criado
- [ ] Testes em push/PR
- [ ] Prisma generate no pipeline
- [ ] Build verificado no pipeline
"@ -Labels @("devops", "ci-cd", "feature", "priority:medium")

Create-Issue -Title "ID16 - Deploy backend no Render com PostgreSQL (RA5)" -Body @"
Checklist:
- [ ] Backend deployado no Render
- [ ] PostgreSQL provisionado
- [ ] Variaveis de ambiente configuradas
- [ ] Swagger acessivel em producao
"@ -Labels @("devops", "backend", "ci-cd", "priority:medium")

Create-Issue -Title "ID17 - Deploy frontend na Vercel (RA5)" -Body @"
Checklist:
- [ ] Frontend deployado na Vercel
- [ ] VITE_API_URL apontando para producao
- [ ] Build automatico via push no main
- [ ] Aplicacao funcional em producao
"@ -Labels @("devops", "frontend", "ci-cd", "priority:medium")

Write-Host "Concluido: labels e issues criadas no repositorio $Repo"
