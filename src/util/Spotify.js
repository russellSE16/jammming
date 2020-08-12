const clientId = '4123a4382013446187dd3c38c7213521';
const redirectUri = "http://localhost:3000/"

let accessToken = '';

const Spotify = {
    checkAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        else if (window.location.href.search(/access_token/) === -1) {
            this.getAccessToken();
        }
        else {
            this.setAccessToken();
        }
    },
    getAccessToken() {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
    },
    setAccessToken() {
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
        const expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
    },
    search(term) {
        this.checkAccessToken();
        const results = fetch('https://api.spotify.com/v1/search?type=track&q=' + term, { headers: { 'Authorization': 'Bearer ' + accessToken }})
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.tracks.items.map(track => {
            return {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            };
        }))
        return results;   
    },
    async savePlaylist(name, tracksArr) {
        if (!name || !tracksArr) {
            return;
        }
        const userId = await fetch('https://api.spotify.com/v1/me', { headers: { 'Authorization': 'Bearer ' + accessToken }})
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.id);
        const playlistId = await fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'name': name })
            })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.id);
        fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'uris': tracksArr })
            }
        )
    }
};

export default Spotify;