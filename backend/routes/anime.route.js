import express from "express";
import { getAnimeByCategory, getAnimeDetails, getAnimeRelations, getAnimeTrailers, getTrendingAnime } from "../controllers/anime.controller.js";

const router = express.Router();

router.get("/trending", getTrendingAnime);
router.get("/:id/trailers", getAnimeTrailers);
router.get("/:id/details", getAnimeDetails);
router.get("/:id/relations", getAnimeRelations);
router.get("/:category", getAnimeByCategory);

export default router;
