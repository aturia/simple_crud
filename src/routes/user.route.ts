import { Router } from "express";
import prisma from "../prisma";
import { validate } from "../middleware/validate";
import { getUserParamsSchema } from "../schemas/user.schemas";
import client from 'prom-client';

const router = Router();
const userCrudCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'code'],
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD người dùng
 */


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo mới người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name },
    });
    userCrudCounter.inc({ method: req.method, route: '/users', code: 200 });
    res.json(user);
  } catch (error) {
    userCrudCounter.inc({ method: req.method, route: '/users', code: 500 });
    res.status(500).json({ error });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Lỗi server
 */
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  userCrudCounter.inc({ method: req.method, route: '/users/all', code: 200 });
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin 1 người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/:id", validate(getUserParamsSchema), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  userCrudCounter.inc({ method: req.method, route: `/users/id`, code: 200 });
  res.json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { name, email },
  });
  userCrudCounter.inc({ method: req.method, route: '/users', code: 200 });
  res.json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.delete("/:id", async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  userCrudCounter.inc({ method: req.method, route: '/users/delete', code: 200 });
  res.json({ message: "User deleted" });
});

export default router;
