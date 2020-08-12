import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }
  componentDidMount() {
    console.log('Mounting');
    Spotify.checkAccessToken();
  }
  async search(term) {
    const results = await Spotify.search(term);
    this.setState({ searchResults: results });
  }
  addTrack(track) {
    const newPlaylistTracks = [];
    let isInPlaylist = false;
    this.state.playlistTracks.forEach(playlistTrack => {
      newPlaylistTracks.push(playlistTrack);
      if (track.id === playlistTrack.id) {
        isInPlaylist = true;
      }
    })
    if (!isInPlaylist) {
      newPlaylistTracks.push(track);
      this.setState({ playlistTracks: newPlaylistTracks });
    }
  }
  removeTrack(track) {
    const newPlaylistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({ playlistTracks: newPlaylistTracks });
  }
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }
  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
    
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist} 
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;