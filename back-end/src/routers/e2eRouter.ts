import { Router } from "express";
import e2eController from "../controllers/e2eController.js";

const e2eRouter = Router();

e2eRouter.post("/e2e/reset", e2eController.reset);
e2eRouter.post("/e2e/seed", e2eController.seed);

export default e2eRouter;
