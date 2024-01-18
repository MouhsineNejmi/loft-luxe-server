import { Router } from "express";

import {
  addToFavorites,
  getCurrentUser,
  removeFromFavorites,
} from "../controllers/users-controller";

import { deserializeUser } from "../middlewares/deserialize-user-middleware";
import { requireUser } from "../middlewares/require-user-middleware";

const router = Router();

router.get("/me", deserializeUser, getCurrentUser);

router.use(deserializeUser, requireUser);
router.post("/favorites/:listingId", addToFavorites);
router.delete("/favorites/:listingId", removeFromFavorites);

export default router;
