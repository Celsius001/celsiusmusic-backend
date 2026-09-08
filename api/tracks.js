const cors = require('cors')();

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}

module.exports = async (req, res) => {
    await runMiddleware(req, res, cors);

    const category = req.query.category || 'hip-hop';

    try {
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
};
