import { Router } from 'express';
import type { GoalController } from '../controllers/goal.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

export const createGoalRoutes = (goalController: GoalController): Router => {
  const router = Router();

  router.use(authMiddleware);

  /**
   * @swagger
   * /api/goals:
   *   post:
   *     summary: Create a new goal with optional tasks
   *     tags: [Goals]
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
   *               - target
   *             properties:
   *               title:
   *                 type: string
   *                 example: Complete 50 tasks this month
   *               description:
   *                 type: string
   *                 example: Increase productivity by completing more tasks
   *               target:
   *                 type: integer
   *                 example: 50
   *               deadline:
   *                 type: string
   *                 format: date-time
   *                 example: 2024-12-31T23:59:59Z
   *               tasks:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - title
   *                   properties:
   *                     title:
   *                       type: string
   *                       example: Write weekly report
   *                     description:
   *                       type: string
   *                       example: Detailed report of weekly activities
   *                     priority:
   *                       type: string
   *                       enum: [LOW, MEDIUM, HIGH, URGENT]
   *                       example: HIGH
   *                     dueDate:
   *                       type: string
   *                       format: date-time
   *     responses:
   *       201:
   *         description: Goal created successfully
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   */
  router.post('/', goalController.create);

  /**
   * @swagger
   * /api/goals:
   *   get:
   *     summary: List all goals with their tasks
   *     tags: [Goals]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of goals with tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: object
   *                   properties:
   *                     goals:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                           title:
   *                             type: string
   *                           description:
   *                             type: string
   *                           target:
   *                             type: integer
   *                           current:
   *                             type: integer
   *                           deadline:
   *                             type: string
   *                             format: date-time
   *                           isCompleted:
   *                             type: boolean
   *                           tasks:
   *                             type: array
   *                             items:
   *                               $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized
   */
  router.get('/', goalController.list);

  /**
   * @swagger
   * /api/goals/{id}:
   *   put:
   *     summary: Update a goal
   *     tags: [Goals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Goal ID
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
   *               target:
   *                 type: integer
   *               current:
   *                 type: integer
   *               deadline:
   *                 type: string
   *                 format: date-time
   *               isCompleted:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Goal updated successfully
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Goal not found
   */
  router.put('/:id', goalController.update);

  /**
   * @swagger
   * /api/goals/{id}:
   *   delete:
   *     summary: Delete a goal
   *     tags: [Goals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Goal ID
   *     responses:
   *       200:
   *         description: Goal deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Goal not found
   */
  router.delete('/:id', goalController.delete);

  /**
   * @swagger
   * /api/goals/{id}/tasks:
   *   post:
   *     summary: Add existing tasks to a goal
   *     tags: [Goals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Goal ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - taskIds
   *             properties:
   *               taskIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: uuid
   *                 example: ["123e4567-e89b-12d3-a456-426614174000", "223e4567-e89b-12d3-a456-426614174001"]
   *     responses:
   *       200:
   *         description: Tasks added to goal successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: object
   *                   properties:
   *                     goal:
   *                       $ref: '#/components/schemas/Goal'
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Goal not found
   */
  router.post('/:id/tasks', goalController.addTasks);

  /**
   * @swagger
   * /api/goals/{id}/tasks:
   *   delete:
   *     summary: Remove tasks from a goal
   *     tags: [Goals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Goal ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - taskIds
   *             properties:
   *               taskIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: uuid
   *                 example: ["123e4567-e89b-12d3-a456-426614174000"]
   *     responses:
   *       200:
   *         description: Tasks removed from goal successfully
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Goal not found
   */
  router.delete('/:id/tasks', goalController.removeTasks);

  return router;
};
