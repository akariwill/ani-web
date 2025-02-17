import express from "express";
import { getSearchHistory, removeItemFromSearchHistory, searchAnime, searchManga, searchMovie, searchPerson, searchTv } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);
router.get("/anime/:query", searchAnime);
router.get("/manga/:query", searchManga);

router.get("/history", getSearchHistory);

router.delete("/history/:id", removeItemFromSearchHistory);

export default router;