import { User } from "../models/user.model.js";
import { fetchFromJikan } from "../services/jikan.service.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req,res) {
    const {query} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);
        
        if(response.results.length === 0){
            return res.status(404).send(null)
        }

        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:{
                    id: response.results[0].id,
                    image: response.results[0].profile_path,
                    title: response.results[0].name,
                    searchType: "person",
                    createdAt: new Date(),
                }
            }
        })

        res.status(200).json({success:true, content:response.results})
    } catch (error) {
        console.log("Error in searchPerson controller: ", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export async function searchMovie(req,res) {
    const {query} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`);

        if(response.results.length === 0){
            return res.status(404).send(null);
        }

        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:{
                    id: response.results[0].id,
                    image: response.results[0].profile_path,
                    title: response.results[0].title,
                    searchType: "movie",
                    createdAt: new Date(),
                }
            }
        })

        res.status(200).json({success:true,content:response.results});
    } catch (error) {
        console.log("Error in searchMovie controller: ", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export async function searchTv(req,res) {
    const {query} = req.params;
    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);

        if(response.results.length === 0){
            return res.status(404).send(null);
        }

        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:{
                    id: response.results[0].id,
                    image: response.results[0].profile_path,
                    title: response.results[0].name,
                    searchType: "tv",
                    createdAt: new Date(),
                }
            }
        })

        res.status(200).json({success:true,content:response.results});
    } catch (error) {
        console.log("Error in searchTv controller: ", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export async function searchAnime(req, res) {
    const { query } = req.params;
    try {
 
        const response = await fetchFromJikan(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`);

        if (response.data.length === 0) {
            return res.status(404).send(null);
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.data[0].mal_id,
                    image: response.data[0].images.jpg.image_url,
                    title: response.data[0].title,
                    searchType: "anime",
                    createdAt: new Date(),
                }
            }
        });

        // Mengembalikan hasil pencarian anime
        res.status(200).json({ success: true, content: response.data });
    } catch (error) {
        console.log("Error in getSearchAnime controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export async function getSearchHistory(req,res) {
    try {
        res.status(200).json({succes:true,content: req.user.searchHistory});
    } catch (error) {
        res.status(500).json({succes:false,message:"Internal server error"});
    }
}

export async function removeItemFromSearchHistory(req,res) {
    let {id} = req.params;

    id = parseInt(id);
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull:{
                searchHistory:{id:id},
            },
        });

        res.status(200).json({succes:true, message:"Item removed from search History"})
    } catch (error) {
        console.log("Error in removeItemFromSearchHistory: ", error.message);
        res.status(500).json({succes:false, message:"Internal server error"});
    }
}