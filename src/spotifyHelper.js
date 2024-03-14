import { spotifyClient } from "./spotifyClient";

const spotifyHelper = {
  setRecommendationsBySelectedTracks: async function (seedTrackIds) {
    let recommendations = await spotifyClient.recommendations.get({seed_tracks: seedTrackIds, limit: 100});
    this.setStorage(recommendations);
  },

  setRecommendationsBySelectedArtists: async function (seedArtistIds) {
    let recommendations = await spotifyClient.recommendations.get({seed_artists: seedArtistIds, limit: 100});
    this.setStorage(recommendations);
  },

  getAllUserTopTracks: async function (timeRange) {
    let tracks1 = (await spotifyClient.currentUser.topItems("tracks", timeRange, 49, 0)).items;
    let tracks2 = (await spotifyClient.currentUser.topItems("tracks", timeRange, 50, 49)).items;

    return tracks1.concat(tracks2);
  },
  
  getUserTopTracksAudioFeatures: async function(timeRange) {
    // get the 99 top tracks for the current user
    let tracks = await this.getAllUserTopTracks(timeRange);

    // need to persist this
    localStorage.setItem("spotify-top-tracks", JSON.stringify(tracks));

    // get the audio features
    let trackIds = tracks.map((t) => t.id);
    return await spotifyClient.tracks.audioFeatures(trackIds);
  },

  setRecommendationsByTopArtists: async function (timeRange) {
    let artists = (await spotifyClient.currentUser.topItems("artists", timeRange, 5, 0)).items;
    let artistIds = artists.map((t) => t.id);
    let recommendations = await spotifyClient.recommendations.get({seed_artists: artistIds, limit: 100});
    this.setStorage(recommendations);
  },

  setRecommendationsByTopTracks: async function (timeRange) {
    let tracks = (await spotifyClient.currentUser.topItems("tracks", timeRange, 5, 0)).items;
    let trackIds = tracks.map((t) => t.id);
    let recommendations = await spotifyClient.recommendations.get({seed_tracks: trackIds, limit: 100});
    this.setStorage(recommendations);
  },

  setStorage: function(data) {
    localStorage.setItem("spotify-data", JSON.stringify(data));
    // Pretty clunky
    window.location.reload();
  },

  createPlaylist: async function () {
    const currentDate = new Date();
    let profile = await spotifyClient.currentUser.profile();
    let playlist = await spotifyClient.playlists.createPlaylist(profile.id, { name: `Melodimancer: ${currentDate.toISOString()} `, public: false});

    var trackUris = JSON.parse(localStorage.getItem("spotify-data")).tracks.map((t) => t.uri);

    await spotifyClient.playlists.addItemsToPlaylist(playlist.id, trackUris);
    window.open("https://open.spotify.com/playlist/" + playlist.id, "_blank");
  },
};

export default spotifyHelper;
