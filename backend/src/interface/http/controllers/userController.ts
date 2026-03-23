import { Request, Response } from "express";
import { z } from "zod";
import { UserDTO } from "../../../domain/models/User";

let users: UserDTO[] = [];
let nextId = 1;

const CreateUserInput = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const UpdateUserInput = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
});

const UserIdParam = z.object({
  id: z.coerce.number().int().nonnegative(),
});

export class UserController {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: List all users
   *     tags: [users]
   *     responses:
   *       200:
   *         description: List users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/user'
   */
  static list(req: Request, res: Response): void {
    res.json(users);
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create new user
   *     tags: [users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *                 minLength: 6
   *     responses:
   *       201:
   *         description: User created!
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/user'
   *       400:
   *         description: Invalid data
   */
  static create(req: Request, res: Response): void {
    const parseResult = CreateUserInput.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid input",
        details: parseResult.error.issues,
      });
      return;
    }

    const { name, email, password } = parseResult.data;

    const emailExists = users.find((u) => u.email === email);
    if (emailExists) {
      res.status(409).json({ error: "Email already registered." });
      return;
    }

    const newUser: UserDTO = {
      id: nextId++,
      name,
      email,
      password,
    };

    users.push(newUser);
    res.status(201).json(newUser);
  }

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Updated user by ID
   *     tags: [users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *                 minLength: 6
   *     responses:
   *       200:
   *         description: User updated!
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/user'
   *       404:
   *         description: User not found
   */
  static update(req: Request, res: Response): void {
    const paramResult = UserIdParam.safeParse(req.params);

    if (!paramResult.success) {
      res.status(400).json({
        error: "Invalid input",
        details: paramResult.error.issues,
      });
      return;
    }

    const { id } = paramResult.data;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const parseResult = UpdateUserInput.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid input",
        details: parseResult.error.issues,
      });
      return;
    }

    const { name, email, password } = parseResult.data;

    if (email && email !== users[index].email) {
      const emailExists = users.find((u) => u.email === email && u.id !== id);
      if (emailExists) {
        res.status(409).json({ error: "Email already registered." });
        return;
      }
    }

    users[index] = {
      ...users[index],
      name: name ?? users[index].name,
      email: email ?? users[index].email,
      password: password ?? users[index].password,
    };

    res.json(users[index]);
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Remove user by ID
   *     tags: [users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted!
   *       404:
   *         description: User not found
   */
  static delete(req: Request, res: Response): void {
    const paramResult = UserIdParam.safeParse(req.params);

    if (!paramResult.success) {
      res.status(400).json({
        error: "Invalid input",
        details: paramResult.error.issues,
      });
      return;
    }

    const { id } = paramResult.data;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    users.splice(index, 1);
    res.json({ message: "User deleted!" });
  }
}
