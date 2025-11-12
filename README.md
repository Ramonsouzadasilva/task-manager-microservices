# Microservices - Auth & Task Manager

Arquitetura de microserviços completa seguindo Clean Architecture e princípios SOLID, com autenticação JWT (refresh tokens) e gerenciamento de tarefas, e criação de metas.

## Tecnologias

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis 7.2
- **Message Broker**: RabbitMQ 4
- **ORM**: Prisma
- **Validation**: Zod
- **Documentation**: Swagger
- **Container**: Docker

## Arquitetura

microservices/
├── auth-service/ # Serviço de autenticação
│ ├── src/
│ │ ├── domain/
│ │ ├── application/
│ │ ├── infrastructure/
│ │ ├── presentation/
│ │ └── main/ # Setup e factories
│ └── prisma/
│
├── task-manager-service/ # Serviço de tarefas e metas
│ ├── src/
│ │ ├── domain/
│ │ ├── application/
│ │ ├── infrastructure/
│ │ ├── presentation/
│ │ └── main/
│ └── prisma/
│
└── docker-compose.yml

## Princípios Aplicados

- **SOLID**
- **Clean Architecture**
- **Design Patterns**

## Funcionalidades

### Auth Service

- Registro de usuário
- Login com JWT
- Refresh Token
- Logout
- Rate limiting
- Cache de tokens no Redis

### Task Manager Service

- CRUD de tarefas
- Tarefas diárias e semanais
- Metas e métricas
- Paginação
- Filtros avançados
- Estatísticas

## Como Executar

### 1. Iniciar infraestrutura Docker

docker-compose up -d

## Endpoints

## Documentação

- Auth Service: http://localhost:3001/api-docs
- Task Manager: http://localhost:3002/api-docs

## Boas Práticas

- ✅ Clean Architecture
- ✅ SOLID
- ✅ Error Handling centralizado
- ✅ Validação com Zod
- ✅ Rate Limiting
- ✅ Paginação
- ✅ Cache com Redis
- ✅ Message Queue com RabbitMQ
- ✅ Docker para desenvolvimento
- ✅ Dependency Injection via Factories
