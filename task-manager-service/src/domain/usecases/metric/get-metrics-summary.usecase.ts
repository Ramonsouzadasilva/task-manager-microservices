import type { IMetricRepository } from '../../repositories/metric.repository';
import type {
  MetricSummary,
  MetricFilters,
} from '../../entities/metric.entity';

export class GetMetricsSummaryUseCase {
  constructor(private readonly metricRepository: IMetricRepository) {}

  execute = async (
    userId: string,
    filters?: MetricFilters
  ): Promise<MetricSummary> => {
    return await this.metricRepository.getMetricsSummary(userId, filters);
  };
}
