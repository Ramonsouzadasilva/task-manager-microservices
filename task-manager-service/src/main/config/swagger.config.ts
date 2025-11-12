import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager Service API',
      version: '1.0.0',
      description:
        'Task manager microservice with daily/weekly tasks, goals and metrics tracking',
      contact: {
        name: 'API Support',
        email: 'support@taskmanager.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3002}`,
        description: 'Development server',
      },
      {
        url: 'https://api.taskmanager.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from Auth Service',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            statusCode: {
              type: 'integer',
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
            },
            frequency: {
              type: 'string',
              enum: ['DAILY', 'WEEKLY', 'MONTHLY'],
              nullable: true,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            userId: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Goal: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
              nullable: true,
            },
            target: {
              type: 'integer',
            },
            current: {
              type: 'integer',
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            isCompleted: {
              type: 'boolean',
            },
            userId: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        MetricSummary: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID do usuário',
            },
            period: {
              type: 'object',
              properties: {
                startDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Data inicial do período',
                },
                endDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Data final do período',
                },
              },
            },
            tasks: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total de tarefas',
                },
                completed: {
                  type: 'integer',
                  description: 'Tarefas completadas',
                },
                inProgress: {
                  type: 'integer',
                  description: 'Tarefas em andamento',
                },
                pending: {
                  type: 'integer',
                  description: 'Tarefas pendentes',
                },
                cancelled: {
                  type: 'integer',
                  description: 'Tarefas canceladas',
                },
                completedToday: {
                  type: 'integer',
                  description: 'Tarefas completadas hoje',
                },
                completedThisWeek: {
                  type: 'integer',
                  description: 'Tarefas completadas esta semana',
                },
                completedThisMonth: {
                  type: 'integer',
                  description: 'Tarefas completadas este mês',
                },
              },
            },
            goals: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total de objetivos',
                },
                completed: {
                  type: 'integer',
                  description: 'Objetivos alcançados',
                },
                inProgress: {
                  type: 'integer',
                  description: 'Objetivos em andamento',
                },
                completionRate: {
                  type: 'number',
                  format: 'float',
                  description: 'Taxa de conclusão dos objetivos (%)',
                },
              },
            },
            productivity: {
              type: 'object',
              properties: {
                averageTasksPerDay: {
                  type: 'number',
                  format: 'float',
                  description: 'Média de tarefas por dia',
                },
                averageCompletionTime: {
                  type: 'number',
                  format: 'float',
                  description: 'Tempo médio de conclusão (horas)',
                },
                streakDays: {
                  type: 'integer',
                  description: 'Dias consecutivos com tarefas completadas',
                },
              },
            },
            byPriority: {
              type: 'object',
              properties: {
                urgent: {
                  type: 'integer',
                  description: 'Tarefas urgentes',
                },
                high: {
                  type: 'integer',
                  description: 'Tarefas de alta prioridade',
                },
                medium: {
                  type: 'integer',
                  description: 'Tarefas de média prioridade',
                },
                low: {
                  type: 'integer',
                  description: 'Tarefas de baixa prioridade',
                },
              },
            },
            byFrequency: {
              type: 'object',
              properties: {
                daily: {
                  type: 'integer',
                  description: 'Tarefas diárias',
                },
                weekly: {
                  type: 'integer',
                  description: 'Tarefas semanais',
                },
                monthly: {
                  type: 'integer',
                  description: 'Tarefas mensais',
                },
                oneTime: {
                  type: 'integer',
                  description: 'Tarefas únicas',
                },
              },
            },
          },
        },
        ProductivityTrend: {
          type: 'object',
          properties: {
            daily: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    format: 'date',
                    description: 'Data (YYYY-MM-DD)',
                  },
                  completed: {
                    type: 'integer',
                    description: 'Tarefas completadas no dia',
                  },
                  created: {
                    type: 'integer',
                    description: 'Tarefas criadas no dia',
                  },
                },
              },
            },
            weeklyAverage: {
              type: 'number',
              format: 'float',
              description: 'Média semanal de tarefas completadas',
            },
            monthlyAverage: {
              type: 'number',
              format: 'float',
              description: 'Média mensal de tarefas completadas',
            },
            bestDay: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  format: 'date',
                  description: 'Melhor dia (YYYY-MM-DD)',
                },
                count: {
                  type: 'integer',
                  description: 'Número de tarefas completadas',
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Tasks',
        description: 'Task management endpoints',
      },
      {
        name: 'Goals',
        description: 'Goal tracking endpoints',
      },
      {
        name: 'Metrics',
        description:
          'Metrics and analytics endpoints - Real-time calculated metrics based on tasks and goals',
      },
    ],
  },
  apis: ['./src/presentation/routes/*.ts', './src/presentation/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
