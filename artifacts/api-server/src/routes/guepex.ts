import { Router, type IRouter } from "express";
import {
  GetWilayasResponse,
  GetCommunesQueryParams,
  GetCommunesResponse,
  GetCentersQueryParams,
  GetCentersResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GUEPEX_BASE = "https://api.guepex.app/v1";

function guepexHeaders() {
  return {
    "X-API-ID": process.env.GUEPEX_API_ID ?? "",
    "X-API-TOKEN": process.env.GUEPEX_API_TOKEN ?? "",
  };
}

// GET /api/wilayas
router.get("/wilayas", async (req, res): Promise<void> => {
  try {
    const response = await fetch(`${GUEPEX_BASE}/wilayas/?page_size=100&is_deliverable=1`, {
      headers: guepexHeaders(),
    });
    if (!response.ok) {
      req.log.error({ status: response.status }, "Guepex wilayas error");
      res.status(500).json({ error: "Failed to fetch wilayas from Guepex" });
      return;
    }
    const json = await response.json() as { data: unknown[] };
    const parsed = GetWilayasResponse.safeParse(json.data);
    if (!parsed.success) {
      req.log.error({ err: parsed.error }, "Guepex wilayas parse error");
      res.status(500).json({ error: "Invalid response from Guepex" });
      return;
    }
    res.json(parsed.data.filter((w) => w.is_deliverable));
  } catch (err) {
    req.log.error({ err }, "Error fetching wilayas");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/communes?wilaya_id=X
router.get("/communes", async (req, res): Promise<void> => {
  const params = GetCommunesQueryParams.safeParse({
    wilaya_id: req.query.wilaya_id ? Number(req.query.wilaya_id) : undefined,
  });
  if (!params.success) {
    res.status(400).json({ error: "wilaya_id is required" });
    return;
  }
  try {
    const response = await fetch(
      `${GUEPEX_BASE}/communes/?wilaya_id=${params.data.wilaya_id}&page_size=500&is_deliverable=1`,
      { headers: guepexHeaders() }
    );
    if (!response.ok) {
      req.log.error({ status: response.status }, "Guepex communes error");
      res.status(500).json({ error: "Failed to fetch communes from Guepex" });
      return;
    }
    const json = await response.json() as { data: unknown[] };
    const parsed = GetCommunesResponse.safeParse(json.data);
    if (!parsed.success) {
      req.log.error({ err: parsed.error }, "Guepex communes parse error");
      res.status(500).json({ error: "Invalid response from Guepex" });
      return;
    }
    res.json(parsed.data.filter((c) => c.is_deliverable));
  } catch (err) {
    req.log.error({ err }, "Error fetching communes");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/centers?wilaya_id=X
router.get("/centers", async (req, res): Promise<void> => {
  const params = GetCentersQueryParams.safeParse({
    wilaya_id: req.query.wilaya_id ? Number(req.query.wilaya_id) : undefined,
  });
  if (!params.success) {
    res.status(400).json({ error: "wilaya_id is required" });
    return;
  }
  try {
    const response = await fetch(
      `${GUEPEX_BASE}/centers/?wilaya_id=${params.data.wilaya_id}&page_size=200`,
      { headers: guepexHeaders() }
    );
    if (!response.ok) {
      req.log.error({ status: response.status }, "Guepex centers error");
      res.status(500).json({ error: "Failed to fetch centers from Guepex" });
      return;
    }
    const json = await response.json() as { data: unknown[] };
    const parsed = GetCentersResponse.safeParse(json.data);
    if (!parsed.success) {
      req.log.error({ err: parsed.error }, "Guepex centers parse error");
      res.status(500).json({ error: "Invalid response from Guepex" });
      return;
    }
    res.json(parsed.data);
  } catch (err) {
    req.log.error({ err }, "Error fetching centers");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
