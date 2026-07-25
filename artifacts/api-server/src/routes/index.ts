import { Router, type IRouter } from "express";
import healthRouter from "./health";
import guepexRouter from "./guepex";
import ordersRouter from "./orders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(guepexRouter);
router.use(ordersRouter);

export default router;
