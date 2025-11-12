import type { IMetricRepository } from '../../repositories/metric.repository';
import type {
  ProductivityTrend,
  MetricFilters,
} from '../../entities/metric.entity';

export class GetProductivityTrendUseCase {
  constructor(private readonly metricRepository: IMetricRepository) {}

  execute = async (
    userId: string,
    filters?: MetricFilters
  ): Promise<ProductivityTrend> => {
    return await this.metricRepository.getProductivityTrend(userId, filters);
  };
}
