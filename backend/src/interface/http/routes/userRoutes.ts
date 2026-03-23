import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRoutes = Router();

userRoutes.get("/users", UserController.list);
userRoutes.post("/users", UserController.create);
userRoutes.put("/users/:id", UserController.update);
userRoutes.delete("/users/:id", UserController.delete);

export { userRoutes };
