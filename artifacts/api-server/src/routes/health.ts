import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/healthz", (_req: any, res: any) => {
  // Return a plain health response to avoid type-checking issues importing generated types during Vercel's workspace emit step.
  res.json({ status: "ok" });
});

export default router;
