import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studyKitRouter from "./study-kit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studyKitRouter);

export default router;
