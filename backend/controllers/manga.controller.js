import { fetchFromJikan } from "../services/jikan.service.js";

export async function getTrendingManga(req, res) {
    try {
        const response = await fetchFromJikan(`https://api.jikan.moe/v4/top/manga`);

        if (response.data.length === 0) {
            return res.status(404).send(null);
        }

        res.status(200).json({ success: true, content: response.data });
    } catch (error) {
        console.log("Error in getTrendingManga controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getMangaDetails(req, res) {
    const { id } = req.params;
    try {
        const response = await fetchFromJikan(`https://api.jikan.moe/v4/manga/${id}`);

        if (!response.data) {
            return res.status(404).json({success: false, message: `Manga with ID ${id} not found`});
        }

        res.status(200).json({success: true, content: response.data});
    } catch (error) {
        console.error("Error in getMangaDetails controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function getMangaRelations(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromJikan(`https://api.jikan.moe/v4/manga/${id}/relations`);

        if (!data || !data.data || data.data.length === 0) {
            return res.status(404).json({ success: false, message: "No relations found for this manga" });
        }

        const relations = data.data.map((relation) => ({
            relation_type: relation.relation,
            related_manga: relation.entry.map((manga) => ({
                mal_id: manga.mal_id,
                title: manga.name,
                url: manga.url || `https://myanimelist.net/manga/${manga.mal_id}`,
                image_url: manga.images?.jpg?.image_url || null,
            })),
        }));

        res.status(200).json({ success: true, relations });
    } catch (error) {
        console.error("Error fetching manga relations:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getMangaByCategory(req, res) {
    const { category } = req.params;

    try {
        let data;

        switch (category) {
            case "top-rated":
                data = await fetchFromJikan("https://api.jikan.moe/v4/top/manga?filter=bypopularity");
                break;

            case "popular":
                data = await fetchFromJikan("https://api.jikan.moe/v4/top/manga");
                break;

            case "manhwa":
                data = await fetchFromJikan("https://api.jikan.moe/v4/manga?type=manhwa");
                break;

            case "manga":
                data = await fetchFromJikan("https://api.jikan.moe/v4/manga?type=manga");
                break;

            default:
                return res.status(400).json({ success: false , message: "Invalid category" });
        }

        if (!data || !data.data || data.data.length === 0) {
            return res.status(404).json({ success: false, message: "No manga found for this category" });
        }

        const mangaList = data.data.map((manga) => ({
            mal_id: manga.mal_id,
            title: manga.title,
            synopsis: manga.synopsis,
            image_url: manga.images?.jpg?.image_url || null,
            url: manga.url,
            type: manga.type,
        }));

        res.status(200).json({ success: true, content: mangaList });
    } catch (error) {
        console.error("Error in getMangaByCategory controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}