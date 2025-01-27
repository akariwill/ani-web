import express from "express";
import { getMangaByCategory, getMangaDetails, getMangaRelations, getTrendingManga } from "../controllers/manga.controller.js";

const router = express.Router();

router.get("/trending", getTrendingManga);
router.get("/:id/details", getMangaDetails);
router.get("/:id/relations", getMangaRelations);
router.get("/:category", getMangaByCategory);

export default router;