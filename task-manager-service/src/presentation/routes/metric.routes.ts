import { Router } from 'express';
import type { MetricController } from '../controllers/metric.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

export const createMetricRoutes = (
  metricController: MetricController
): Router => {
  const router = Router();

  router.use(authMiddleware);

  /**
   * @swagger
   * /api/metrics/summary:
   *   get:
   *     summary: Get user metrics summary (calculated in real-time)
   *     description: Returns comprehensive metrics about tasks and goals including completion rates, productivity stats, and distributions
   *     tags: [Metrics]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: period
   *         schema:
   *           type: string
   *           enum: [today, week, month, year, custom]
   *         description: Time period for metrics calculation (default is month)
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Start date for custom period (ISO 8601 format)
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: End date for custom period (ISO 8601 format)
   *     responses:
   *       200:
   *         description: Metrics summary calculated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/MetricSummary'
   *             example:
   *               success: true
   *               data:
   *                 userId: "uuid"
   *                 period:
   *                   startDate: "2025-01-01T00:00:00Z"
   *                   endDate: "2025-01-31T23:59:59Z"
   *                 tasks:
   *                   total: 150
   *                   completed: 120
   *                   inProgress: 20
   *                   pending: 8
   *                   cancelled: 2
   *                   completedToday: 5
   *                   completedThisWeek: 35
   *                   completedThisMonth: 120
   *                 goals:
   *                   total: 10
   *                   completed: 7
   *                   inProgress: 3
   *                   completionRate: 70.0
   *                 productivity:
   *                   averageTasksPerDay: 4.5
   *                   averageCompletionTime: 18.5
   *                   streakDays: 15
   *                 byPriority:
   *                   urgent: 10
   *                   high: 40
   *                   medium: 70
   *                   low: 30
   *                 byFrequency:
   *                   daily: 50
   *                   weekly: 30
   *                   monthly: 20
   *                   oneTime: 50
   *       400:
   *         description: Invalid filter parameters
   *       401:
   *         description: Unauthorized
   */
  router.get('/summary', metricController.getSummary);

  /**
   * @swagger
   * /api/metrics/productivity-trend:
   *   get:
   *     summary: Get productivity trend analysis
   *     description: Returns daily productivity data with averages and best performing day
   *     tags: [Metrics]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: period
   *         schema:
   *           type: string
   *           enum: [today, week, month, year, custom]
   *         description: Time period for trend analysis
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Start date for custom period
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: End date for custom period
   *     responses:
   *       200:
   *         description: Productivity trend calculated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/ProductivityTrend'
   *             example:
   *               success: true
   *               data:
   *                 daily:
   *                   - date: "2025-01-15"
   *                     completed: 5
   *                     created: 7
   *                   - date: "2025-01-16"
   *                     completed: 8
   *                     created: 6
   *                 weeklyAverage: 6.2
   *                 monthlyAverage: 27.5
   *                 bestDay:
   *                   date: "2025-01-16"
   *                   count: 8
   *       400:
   *         description: Invalid filter parameters
   *       401:
   *         description: Unauthorized
   */
  router.get('/productivity-trend', metricController.getProductivityTrend);

  return router;
};
