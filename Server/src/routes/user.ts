import { Router } from "express";
import { getAll } from "../controllers/user-controller";

const router = Router()

router.get('/getAll',getAll)

export default router