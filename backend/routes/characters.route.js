import express from "express";
import { getCharacterAnime, getCharacterManga, getCharacterVoiceActors } from "../controllers/characters.controller.js";

const router = express.Router();

router.get("/anime/:query", getCharacterAnime);
router.get("/manga/:query", getCharacterManga);
router.get("/voices/:query", getCharacterVoiceActors);

export default router;
