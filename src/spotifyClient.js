import axios from "axios";
import authHelpers from "./authHelpers";

const spotifyClient = {
  searchArtist: async function (val) {
    let code = authHelpers.getCookie();
    let artists = [];
    await axios({
      method: "GET",
      url:
        "https://api.spotify.com/v1/search?q=" + val + "&type=artist&limit=18",
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      artists = res.data.artists.items;
    });
    return artists;
  },
  searchTrack: async function (val) {
    let code = authHelpers.getCookie();
    let tracks = [];
    await axios({
      method: "GET",
      url:
        "https://api.spotify.com/v1/search?q=" + val + "&type=track&limit=24",
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      tracks = res.data.tracks.items;
    });
    return tracks;
  },
  databySelectedTracks: async function (tracks) {
    let code = authHelpers.getCookie();
    let data = await this.getbyTracksWithSeed(code, tracks);
    document.cookie = "selection=;max-age=0;samesite=lax;Secure";
    await this.formattedDatabyTracks(data);
  },
  databySelectedArtists: async function (artists) {
    let code = authHelpers.getCookie();
    let data = await this.getbyArtistsWithSeed(code, artists);
    document.cookie = "selection=;max-age=0;samesite=lax;Secure";
    await this.formattedDatabyArtists(data);
  },
  getAllUserTopTracks: async function (timeRange) {
    let code = authHelpers.getCookie();
    let tracks1 = (await this.getUserTopItems("tracks", code, timeRange, 49, 0))[0].items;
    let tracks2 = (await this.getUserTopItems("tracks", code, timeRange, 50, 49))[0].items;

    return tracks1.concat(tracks2);
  },
  getUserTopTracksAudioFeatures: async function(timeRange) {
    let code = authHelpers.getCookie();

    // Get the 99 top tracks for the current user
    let tracks1 = (await this.getUserTopItems("tracks", code, timeRange, 49, 0))[0].items;
    let tracks2 = (await this.getUserTopItems("tracks", code, timeRange, 50, 49))[0].items;
    let tracks = tracks1.concat(tracks2);

    // Get the audio features
    let trackIds = tracks.map((t) => t.id);
    let audioFeatures = await this.getSeveralTracksAudioFeatures(code, trackIds);

    return audioFeatures[0].audio_features;
  },
  databyAllTimeTopArtists: async function (range) {
    let code = authHelpers.getCookie();
    let artists = await this.getUserTopItems("artists", code, range, 5);
    let seed = await this.getArtistSeed(artists);
    let data = await this.getbyArtistsWithSeed(code, seed);
    await this.formattedDatabyArtists(data);
  },
  databyAllTimeTopTracks: async function (range) {
    let code = authHelpers.getCookie();
    let artists = await this.getUserTopItems("tracks", code, range, 5);
    let seed = await this.getTrackSeed(artists);
    let data = await this.getbyTracksWithSeed(code, seed);
    await this.formattedDatabyTracks(data);
  },
  formattedDatabyTracks: async function (data) {
    let result = {
      seeds: data[0].seeds,
      tracks: data[0].tracks,
    };
    localStorage.setItem("spotiData", JSON.stringify(result));
    window.location.reload();
  },
  formattedDatabyArtists: async function (data) {
    let result = {
      seeds: data[0].seeds,
      tracks: data[0].tracks,
    };
    localStorage.setItem("spotiData", JSON.stringify(result));
    window.location.reload();
  },
  getTrackSeed: async function (res) {
    let trackSeed = [];
    res[0].items.forEach((e) => {
      trackSeed.push(e.id);
    });
    return trackSeed;
  },
  getArtistSeed: async function (res) {
    let artistSeed = [];
    res[0].items.forEach((e) => {
      artistSeed.push(e.id);
    });
    return artistSeed;
  },
  getUserTopItems: async function (type, code, timeRange, limit = 20, offset = 0) {
    let result = [];
    await axios({
      method: "GET",
      url:
        `https://api.spotify.com/v1/me/top/${type}`,
      params: {
        time_range: timeRange,
        limit: limit,
        offset: offset
      },
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      result.push(res.data);
    });
    return result;
  },
  getSeveralTracksAudioFeatures: async function (code, ids) {
    let result = [];
    await axios({
      method: "GET",
      url:
        "https://api.spotify.com/v1/audio-features",
      params: {
        ids: ids.join(",")
      },
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      result.push(res.data);
    });
    return result;
  },
  getbyTracksWithSeed: async function (code, trackSeed) {
    let result = [];
    await axios({
      method: "GET",
      url:
        "https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=" +
        trackSeed,
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      result.push(res.data);
    });
    return result;
  },
  getbyArtistsWithSeed: async function (code, artistSeed) {
    let result = [];
    await axios({
      method: "GET",
      url:
        "https://api.spotify.com/v1/recommendations?limit=100&seed_artists=" +
        artistSeed,
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      result.push(res.data);
    });
    return result;
  },
  createPlaylist: async function () {
    let code = authHelpers.getCookie();
    let uid = authHelpers.getUserID();
    let uname = authHelpers.getUsername();
    let pname = "";
    if (uname) {
      pname = "created for " + uname + ", by Explore Spotify";
    } else {
      pname = "created for " + uid + ", by Explore Spotify";
    }

    let pid = "";
    await axios({
      method: "POST",
      url: "https://api.spotify.com/v1/users/" + uid + "/playlists",
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        name: pname,
        public: false,
      },
      json: true,
    }).then((res) => {
      pid = res.data.id;
    });
    await this.populatePlaylist(code, pid);
    window.open("https://open.spotify.com/playlist/" + pid, "_blank");
  },
  populatePlaylist: async function (code, pid) {
    let tUris = JSON.parse(localStorage.getItem("spotiData")).tracks.map(
      (t) => t.uri
    );
    let snapid = "";
    await axios({
      method: "POST",
      url: "https://api.spotify.com/v1/playlists/" + pid + "/tracks",
      headers: {
        Authorization: "Bearer " + code,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        uris: tUris,
        position: 0,
      },
      json: true,
    }).then((res) => {
      snapid = res;
    });
    return snapid;
  },
};

export default spotifyClient;
