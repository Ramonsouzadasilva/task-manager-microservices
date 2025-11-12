import { Router } from 'express';
import type { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  router.use(authMiddleware);

  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 example: Complete project documentation
   *               description:
   *                 type: string
   *                 example: Write comprehensive API documentation
   *               priority:
   *                 type: string
   *                 enum: [LOW, MEDIUM, HIGH]
   *                 example: HIGH
   *               status:
   *                 type: string
   *                 enum: [TODO, IN_PROGRESS, DONE]
   *                 example: TODO
   *               dueDate:
   *                 type: string
   *                 format: date-time
   *                 example: 2024-12-31T23:59:59Z
   *               recurrence:
   *                 type: string
   *                 enum: [DAILY, WEEKLY, MONTHLY]
   *                 example: DAILY
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [work, documentation]
   *     responses:
   *       201:
   *         description: Task created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 title:
   *                   type: string
   *                 description:
   *                   type: string
   *                 priority:
   *                   type: string
   *                 status:
   *                   type: string
   *                 dueDate:
   *                   type: string
   *                   format: date-time
   *                 recurrence:
   *                   type: string
   *                 tags:
   *                   type: array
   *                   items:
   *                     type: string
   *                 userId:
   *                   type: string
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   */
  router.post('/', taskController.create);

  /**
   * @swagger
   * /api/tasks:
   *   get:
   *     summary: List tasks with filters and pagination
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Items per page
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [TODO, IN_PROGRESS, DONE]
   *         description: Filter by status
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH]
   *         description: Filter by priority
   *       - in: query
   *         name: recurrence
   *         schema:
   *           type: string
   *           enum: [DAILY, WEEKLY, MONTHLY]
   *         description: Filter by recurrence
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter tasks from this date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter tasks until this date
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search in title and description
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       401:
   *         description: Unauthorized
   */
  router.get('/', taskController.list);

  /**
   * @swagger
   * /api/tasks/stats:
   *   get:
   *     summary: Get task statistics
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Task statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 total:
   *                   type: integer
   *                 byStatus:
   *                   type: object
   *                   properties:
   *                     TODO:
   *                       type: integer
   *                     IN_PROGRESS:
   *                       type: integer
   *                     DONE:
   *                       type: integer
   *                 byPriority:
   *                   type: object
   *                   properties:
   *                     LOW:
   *                       type: integer
   *                     MEDIUM:
   *                       type: integer
   *                     HIGH:
   *                       type: integer
   *                 completionRate:
   *                   type: number
   *                   format: float
   *       401:
   *         description: Unauthorized
   */
  router.get('/stats', taskController.stats);

  /**
   * @swagger
   * /api/tasks/{id}:
   *   get:
   *     summary: Get a specific task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *     responses:
   *       200:
   *         description: Task details
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Task not found
   */
  router.get('/:id', taskController.get);

  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     summary: Update a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               priority:
   *                 type: string
   *                 enum: [LOW, MEDIUM, HIGH]
   *               status:
   *                 type: string
   *                 enum: [TODO, IN_PROGRESS, DONE]
   *               dueDate:
   *                 type: string
   *                 format: date-time
   *               recurrence:
   *                 type: string
   *                 enum: [DAILY, WEEKLY, MONTHLY]
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Task updated successfully
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Task not found
   */
  router.put('/:id', taskController.update);

  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *     responses:
   *       204:
   *         description: Task deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', taskController.delete);

  return router;
};
