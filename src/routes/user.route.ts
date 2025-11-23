import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// READ ALL
router.get("/", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(user);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { name, email },
  });
  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "User deleted" });
});

export default router;
