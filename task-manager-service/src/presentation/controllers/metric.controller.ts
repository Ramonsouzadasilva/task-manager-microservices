import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../shared/middlewares/auth.middleware';
import type { GetMetricsSummaryUseCase } from '../../domain/usecases/metric/get-metrics-summary.usecase';
import type { GetProductivityTrendUseCase } from '../../domain/usecases/metric/get-productivity-trend.usecase';
import { z } from 'zod';

const metricFiltersSchema = z.object({
  period: z.enum(['today', 'week', 'month', 'year', 'custom']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export class MetricController {
  constructor(
    private readonly getMetricsSummaryUseCase: GetMetricsSummaryUseCase,
    private readonly getProductivityTrendUseCase: GetProductivityTrendUseCase
  ) {}

  getSummary = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = metricFiltersSchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid filters',
          errors: validation.error.errors,
        });
        return;
      }

      const filters = validation.data;
      const parsedFilters = {
        period: filters.period,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      };

      const metrics = await this.getMetricsSummaryUseCase.execute(
        req.userId!,
        parsedFilters
      );

      res.status(200).json({
        status: 'success',
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductivityTrend = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = metricFiltersSchema.safeParse(req.query);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid filters',
          errors: validation.error.errors,
        });
        return;
      }

      const filters = validation.data;
      const parsedFilters = {
        period: filters.period,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      };

      const trend = await this.getProductivityTrendUseCase.execute(
        req.userId!,
        parsedFilters
      );

      res.status(200).json({
        status: 'success',
        data: trend,
      });
    } catch (error) {
      next(error);
    }
  };
}
