import { fetchFromJikan } from "../services/jikan.service.js";

async function getCharacterIdByQuery(query) {
    try {
        const searchData = await fetchFromJikan(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}`);
        
        if (!searchData || !searchData.data || searchData.data.length === 0) {
            return null;
        }

        return searchData.data[0].mal_id;
    } catch (error) {
        console.error("Error fetching character ID:", error);
        return null;
    }
}

export async function getCharacterAnime(req, res) {
    const { query } = req.params;

    try {
        const characterId = await getCharacterIdByQuery(query);
        if (!characterId) {
            return res.status(404).json({ success: false, message: "Character not found" });
        }

        const data = await fetchFromJikan(`https://api.jikan.moe/v4/characters/${characterId}/anime`);

        if (!data || !data.data) {
            return res.status(404).json({ success: false, message: "Character Anime not found" });
        }

        res.status(200).json({ success: true, content: data.data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getCharacterManga(req, res) {
    const { query } = req.params;

    try {
        const characterId = await getCharacterIdByQuery(query);
        if (!characterId) {
            return res.status(404).json({ success: false, message: "Character not found" });
        }

        const data = await fetchFromJikan(`https://api.jikan.moe/v4/characters/${characterId}/manga`);

        if (!data || !data.data) {
            return res.status(404).json({ success: false, message: "Character Manga not found" });
        }

        res.status(200).json({ success: true, content: data.data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getCharacterVoiceActors(req, res) {
    const { query } = req.params;

    try {
        const characterId = await getCharacterIdByQuery(query);
        if (!characterId) {
            return res.status(404).json({ success: false, message: "Character not found" });
        }

        const data = await fetchFromJikan(`https://api.jikan.moe/v4/characters/${characterId}/voices`);

        if (!data || !data.data) {
            return res.status(404).json({ success: false, message: "Character Voice Actors not found" });
        }

        res.status(200).json({ success: true, content: data.data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
