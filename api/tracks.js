module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

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
