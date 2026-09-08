const cors = require('cors')();

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}

async function getSpotifyToken() {
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

module.exports = async (req, res) => {
    await runMiddleware(req, res, cors);

    const provider = req.query.provider || 'deezer';
    const category = req.query.category || 'hip-hop';

    try {
        if (provider === 'spotify') {
            const token = await getSpotifyToken();
            let query = category;
            if (category === 'top-hits') query = 'latest chart hits';
            if (category === 'hip-hop') query = 'hip hop rap';
            if (category === 'curated') query = 'trending playlist';

            const spotifyRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=15`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const spotifyData = await spotifyRes.json();
            
            const tracks = spotifyData.tracks.items.map(track => ({
                id: track.id,
                title: track.name,
                artist: track.artists[0].name,
                thumbnail: track.album.images[0]?.url || '',
                audioUrl: track.preview_url
            }));
            return res.json(tracks);
        } else {
            let query = category;
            if (category === 'top-hits') query = 'chart hits';
            if (category === 'hip-hop') query = 'hip hop';
            if (category === 'curated') query = 'trending';

            const deezerRes = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
            const deezerData = await deezerRes.json();

            const tracks = deezerData.data.map(track => ({
                id: track.id,
                title: track.title,
                artist: track.artist.name,
                thumbnail: track.album.cover_medium,
                audioUrl: track.preview
            }));
            return res.json(tracks);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
};
