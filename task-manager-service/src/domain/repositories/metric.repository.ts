import type {
  MetricSummary,
  MetricFilters,
  ProductivityTrend,
} from '../entities/metric.entity';

export interface IMetricRepository {
  getMetricsSummary(
    userId: string,
    filters?: MetricFilters
  ): Promise<MetricSummary>;
  getProductivityTrend(
    userId: string,
    filters?: MetricFilters
  ): Promise<ProductivityTrend>;
}
