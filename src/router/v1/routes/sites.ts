import { Router } from "express";
import {
  createSite,
  deleteSite,
  getAllSites,
    getSiteById,
  updateSite,
} from "../../../controllers/SiteControllers";

const router = Router();

router.post("/", createSite);

router.get("/", getAllSites);
router.get("/:id", getSiteById);

router.put("/:id", updateSite);

router.delete("/:id", deleteSite);

export default router;