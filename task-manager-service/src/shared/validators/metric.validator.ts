import { z } from 'zod';

export const createMetricSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  value: z.number(),
  unit: z.string().max(50).optional(),
  date: z.string().datetime().optional(),
});

export const metricFiltersSchema = z.object({
  name: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateMetricInput = z.infer<typeof createMetricSchema>;
export type MetricFiltersInput = z.infer<typeof metricFiltersSchema>;
