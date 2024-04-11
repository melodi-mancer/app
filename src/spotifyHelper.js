import tracks from "./components/tracks";
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

    var fullTrackList = tracks1.concat(tracks2);
    //console.log(fullTrackList);
    return fullTrackList;
  },

  getUserTopTracksArtists: async function(timeRange) {
    //Method to get artist information for user's top tracks

    //First get tracks and trackID's
    let tracks1 = (await spotifyClient.currentUser.topItems("tracks", timeRange, 49, 0)).items;
    let tracks2 = (await spotifyClient.currentUser.topItems("tracks", timeRange, 50, 49)).items;
    //console.log(tracks1);

    //Then get artistID's for those tracks
    let trackArtistIds1 = tracks1.map((t) => t.artists[0].id);
    let trackArtistIds2 = tracks2.map((t) => t.artists[0].id);

    //Get artist information for those tracks
    let artistsList1 = (await spotifyClient.artists.get(trackArtistIds1));
    let artistsList2 = (await spotifyClient.artists.get(trackArtistIds2));
    
    var fullArtistList = artistsList1.concat(artistsList2);
    //console.log(fullArtistList);
    return fullArtistList; 
  },
  
  getUserTopGenre: async function(timeRange)
  {
  //Method for finding user's top genre based on most played tracks

    let genreList = [];
    let tracksArtists = await this.getUserTopTracksArtists(timeRange);
      
      //Save genres to list. Only selecting first genre for now
      tracksArtists.forEach((tracksArtist) => 
      {
        if (tracksArtist.genres[0])
        {
        genreList.push(tracksArtist.genres[0]);
        //genreList.push(tracksArtist.genres[1]);
        //genreList.push(tracksArtist.genres[2]);
        //genreList.push(tracksArtist.genres[3]);
        }
      });
    
    
   //Find most occurring genre 
    var mostOcc = genreList.sort((a,b) =>
          genreList.filter(v => v===a).length
        - genreList.filter(v => v===b).length
    ).pop();
    console.log("most played tracks genre:" + " " + mostOcc);
    return mostOcc;
},

getUserTopArtistGenre: async function(timeRange)
{
  //Method for finding user's top genre based on most played artists

  let genreArtistList = [];
  let artists1 = (await spotifyClient.currentUser.topItems("artists", timeRange, 49, 0)).items;
  let artists2 = (await spotifyClient.currentUser.topItems("artists", timeRange, 50, 49)).items;
  var fullArtistList = artists1.concat(artists2);
    

    //Save genres to list. Only selecting first genre for now
    fullArtistList.forEach((tracksArtist) => 
    {
      if (tracksArtist.genres[0])
      {
      genreArtistList.push(tracksArtist.genres[0]);
      //genreList.push(tracksArtist.genres[1]);
      //genreList.push(tracksArtist.genres[2]);
      //genreList.push(tracksArtist.genres[3]);
      }
    });
  
  //Find most occurring genre 
  var mostOcc = genreArtistList.sort((a,b) =>
        genreArtistList.filter(v => v===a).length
      - genreArtistList.filter(v => v===b).length
  ).pop();
  console.log("most played artists genre:" + " " + mostOcc);
  return mostOcc;
},

  filterTracksOnGenre: async function(timeRange,genre)
  {

  //Method to combine tracks with artist genres
  let tracks = await this.getAllUserTopTracks(timeRange);

  //Create array container and constructor for new objects to combine information
  var allObjects = [];
  function aTrackArtist (trackID, artistName, artistID, artistGenres, artistGenres1, artistGenres2, artistGenres3)
  {
    this.trackID = trackID;
    this.artistName = artistName;
    this.artistID = artistID;
    this.artistGenres = artistGenres;
    this.artistGenres1 = artistGenres1;
    this.artistGenres2 = artistGenres2;
    this.artistGenres3 = artistGenres3;
  }
   
  //creates object for each track with trackinformation
   tracks.forEach((track) => 
   {
     track.artists[0].id = new aTrackArtist(track.id, track.artists[0].name, track.artists[0].id, "");
     allObjects.push(track.artists[0].id);
   });

    let tracksArtists = await this.getUserTopTracksArtists(timeRange);
   
  
  //Creates container array (which we might not need),filters the object array and update genre information on track objects from the artist information 
   tracksArtists.forEach((tracksArtist) => 
    {
      if (tracksArtist.genres[0])
      {
        allObjects.filter(function(allObj) {
          return allObj.artistID === (tracksArtist.id);
      }).map(function(allObj) {
          allObj.artistGenres = tracksArtist.genres[0];
          allObj.artistGenres1 = tracksArtist.genres[0];
          allObj.artistGenres2 = tracksArtist.genres[1];
          allObj.artistGenres3 = tracksArtist.genres[2];
          //console.log(allObj);
          return allObj
      });
      }
      else
      {
      }
    });
    
    
 
    //Filters the list of tracks based on a specific common genre keyword (default constant "folk" music, but should be a variable)
    var filteredTracks = allObjects.filter(function(allObj) {
      //console.log(allObj.artistGenres);
      return (allObj.artistGenres).includes(genre);
    });

    return filteredTracks;
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

  getGenreTracksAudioFeatures: async function(timeRange,genre) {

   // get the top tracks for the current user based on genre 
   let tracksWithGenre = await this.filterTracksOnGenre(timeRange,genre);
   //console.log(tracksWithGenre);

   let trackIds = [];
   tracksWithGenre.forEach((track) =>
   {
     trackIds.push(track.trackID);
   });

   //persisting tracks with genres 
   //console.log(trackIds);
   localStorage.setItem("spotify-top-tracks", JSON.stringify(trackIds));

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
    
    let allTracksUris = [];
    var allTracks = JSON.parse(localStorage.getItem("spotify-data")).tracks.map((track) => (
      track.uri));
      console.log(allTracks)
    
    var sum = 0;

    allTracks.forEach((tracky) =>
    {
      if (sum < 600000)
      {
          allTracksUris.push(tracky);
      }
      //console.log(allTracksUris);
      sum = allTracksUris.reduce(
        (a, b) => a + b,
        0,
      );
      //console.log("sum:" + " " + sum);
    });
     
    //console.log(allTracks);
    var trackUris = JSON.parse(localStorage.getItem("spotify-data")).tracks.map((t) => t.uri);
    
    await spotifyClient.playlists.addItemsToPlaylist(playlist.id, trackUris);
    window.open("https://open.spotify.com/playlist/" + playlist.id, "_blank");
  },
};

export default spotifyHelper;
