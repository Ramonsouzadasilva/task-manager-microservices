import { PrismaService } from '../../infrastructure/database/prisma.service';
import { PrismaMetricRepository } from '../../infrastructure/repositories/prisma-metric.repository';
import { GetMetricsSummaryUseCase } from '../../domain/usecases/metric/get-metrics-summary.usecase';
import { GetProductivityTrendUseCase } from '../../domain/usecases/metric/get-productivity-trend.usecase';
import { MetricController } from '../../presentation/controllers/metric.controller';

export const makeMetricController = (): MetricController => {
  const prisma = PrismaService.getInstance();
  const metricRepository = new PrismaMetricRepository(prisma);

  const getMetricsSummaryUseCase = new GetMetricsSummaryUseCase(
    metricRepository
  );
  const getProductivityTrendUseCase = new GetProductivityTrendUseCase(
    metricRepository
  );

  return new MetricController(
    getMetricsSummaryUseCase,
    getProductivityTrendUseCase
  );
};
