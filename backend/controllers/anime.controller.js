import { fetchFromJikan } from "../services/jikan.service.js";

export async function getTrendingAnime(req, res) {
    try {
        const data = await fetchFromJikan(`https://api.jikan.moe/v4/seasons/now`);
        if (!data?.data || data.data.length === 0) {
            return res.status(404).json({ success: false, message: "No trending anime found" });
        }
        const randomAnime = data.data[Math.floor(Math.random() * data.data.length)]     

        res.json({ success: true, content: randomAnime });
    } catch (error) {
        console.error("Error fetching trending anime:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getAnimeTrailers(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromJikan(`https://api.jikan.moe/v4/anime/${id}/videos`);
        const trailers = data.data?.promo || []; 
        
        if (!trailers.length) {
            return res.status(404).json({ success: false, message: "No trailers found for this anime." });
        }

        res.json({ success: true, trailers });
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }        

        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getAnimeDetails(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromJikan(`https://api.jikan.moe/v4/anime/${id}`);
        
        if (!data || !data.data) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

        res.status(200).json({ success: true, content: data.data });
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getAnimeRelations(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromJikan(`https://api.jikan.moe/v4/anime/${id}/relations`);

        if (!data || !data.data || data.data.length === 0) {
            return res.status(404).json({ success: false, message: "No relations found for this anime" });
        }

        const relations = data.data.map((relation) => ({
            relation_type: relation.relation,
            related_anime: relation.entry.map((anime) => ({
                mal_id: anime.mal_id,
                title: anime.name,
                url: `https://myanimelist.net/anime/${anime.mal_id}`,
                image_url: anime.images?.jpg?.image_url || null,
            })),
        }));

        res.status(200).json({ success: true, relations });
    } catch (error) {
        console.error("Error fetching anime relations:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getAnimeByCategory(req, res) {
    const { category } = req.params;

    try {
        let data;

        switch (category) {
            case "upcoming":
                data = await fetchFromJikan("https://api.jikan.moe/v4/seasons/upcoming");
                break;

            case "airing":
                data = await fetchFromJikan("https://api.jikan.moe/v4/schedules");
                break;

            case "top-rated":
                data = await fetchFromJikan("https://api.jikan.moe/v4/top/anime?type=tv&filter=bypopularity");
                break;

            case "popular":
                data = await fetchFromJikan("https://api.jikan.moe/v4/top/anime?type=tv");
                break;

            default:
                return res.status(400).json({ success: false, message: "Invalid category" });
        }

        if (!data || !data.data || data.data.length === 0) {
            return res.status(404).json({ success: false, message: "No anime found for this category" });
        }

        const animeList = data.data.map((anime) => ({
            mal_id: anime.mal_id,
            title: anime.title,
            synopsis: anime.synopsis,
            image_url: anime.images?.jpg?.image_url || null,
            url: anime.url,
        }));

        res.status(200).json({ success: true, content: animeList });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
