import axios from "axios";

export const fetchFromJikan =  async (url) => {
    try {
        const options = {
            headers: {
                accept: 'application/json',
                'User-Agent': 'axios' 
            }
        };
        
        const response = await axios.get(url, options);
        
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data from Jikan API: ${response.statusText}`);
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching data from Jikan API:", error.message);
        throw new Error("Failed to fetch data from Jikan API");
    }
}

