import { addSA1CandidateController, chooseSA1Candidate, testFeature } from "@/controllers/StepsControllers";
import { Router } from "express"

const router = Router();

router.post("/candidate/add/:stepId", addSA1CandidateController)
router.post("/candidate/choose/:candidateId", chooseSA1Candidate)

export default router