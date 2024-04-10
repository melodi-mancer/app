import React, { Fragment, Keyboard } from "react";
import spotifyHelper from "../spotifyHelper";
import { spotifyClient } from "../spotifyClient";
import ArtistSearch from "./artistSearch";
import TrackSearch from "./trackSearch";
import Loading from "./loading";
import statisticalAnalysisHelper from "../statisticalAnalysisHelper";

export default class functions extends React.Component {
  constructor() {
    super();
    this.state = {
      artistsUpdated: false,
      tracksUpdated: false,
      clearResults: false,
      inputsEmpty: true,
      loading: false,
      genre: "",
      mpg: "",
      artistmpg:"",
    };
    this.timer = null;
    this.artists = null;
    this.tracks = null;
    this.userGenre = spotifyHelper.getUserTopGenre("short_term").then((value) => {
      this.setState({mpg:(value)});
  });
  this.artistGenre = spotifyHelper.getUserTopArtistGenre("medium_term").then((value) => {
    this.setState({artistmpg:(value)});
});


    this.artistInput = React.createRef();
    this.trackInput = React.createRef();
  }

  handleArtistInput = (e) => {
    this.setState({ loading: true });
    if (e.value) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleArtist(e.value);
        this.setState({ clearResults: false });
        this.setState({ inputsEmpty: false });
        e.blur();
      }, 1000);
    } else if (!e.value || e.value.length < 1) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setState({ clearResults: true });
        this.setState({ inputsEmpty: true });
        this.setState({ loading: false });
        e.blur();
      }, 800);
    }
  };

  handleTrackInput = (e) => {
    this.setState({ loading: true });
    if (e.value) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleTrack(e.value);
        this.setState({ clearResults: false });
        this.setState({ inputsEmpty: false });
        e.blur();
      }, 1000);
    } else if (!e.value || e.value.length < 1) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setState({ clearResults: true });
        this.setState({ inputsEmpty: true });
        this.setState({ loading: false });
        e.blur();
      }, 800);
    }
  };

  handleArtist = async (v) => {
    this.tracks = null;
    this.trackInput.current.value = "";
    this.artists = (await spotifyClient.search(v, ["artist"], undefined, 18)).artists.items;
    this.setState({ artistsUpdated: true });
    this.setState({ loading: false });
  };

  handleTrack = async (v) => {
    this.artists = null;
    this.artistInput.current.value = "";
    this.tracks = (await spotifyClient.search(v, ["track"], undefined, 24)).tracks.items;
    this.tracks = await spotifyHelper.searchTrack(v);
    this.setState({ tracksUpdated: true });
    this.setState({ loading: false });
  };

    //Sets the genre based on the dropDown 
    setGenre = (event) => {
      this.setState({genre:(event.target.value)});
        };
    
    //Genre Button function
    getRecked = () => {
      let genre = this.state.genre;
      functions.getbyGenreTracks("short_term",genre);
    };

    //Auto-Pick Genre by tracks Button function
    getAutoRecked = () => {
      let mostPlayedGenre = this.state.mpg;
      functions.getbyGenreTracks("short_term",mostPlayedGenre);
    };
    
    //Auto-Pick Genre by artists Button function
    getArtistAutoRecked = () => {
      let mostPlayedArtistGenre = this.state.artistmpg;
      functions.getbyGenreTracks("medium_term",mostPlayedArtistGenre);
    };


  render() {
    return (
      <div className="results">
        <div className="funcs">
          <input
            onChange={(e) => this.handleArtistInput(e.target)}
            placeholder="pick at most 5 artists.."
            ref={this.artistInput}
          ></input>
          {this.state.loading ? <Loading></Loading> : <span>OR</span>}
          <input
            onChange={(e) => this.handleTrackInput(e.target)}
            placeholder="pick at most 5 tracks.."
            ref={this.trackInput}
          ></input>
        </div>
        {}
        {!this.state.clearResults ? (
          <Fragment>
            {this.artists ? (
              <div className="search-container">
                <ArtistSearch artists={this.artists}></ArtistSearch>{" "}
              </div>
            ) : (
              ""
            )}
            {this.tracks ? (
              <div className="search-container">
                <TrackSearch tracks={this.tracks}></TrackSearch>{" "}
              </div>
            ) : (
              ""
            )}
          </Fragment>
        ) : (
          ""
        )}
        {this.state.inputsEmpty ? (
          <Fragment>
            <div className="funcs">
              <button onClick={(e) => functions.getbyTracks("short_term")}>
                Get recommendations by Short Term Top Tracks
              </button>
            </div>
            <div className="funcs">
              <button onClick={(e) => functions.getbyArtists("medium_term")} style={{display: 'none'}}>
                Explore by Recent Top Artists
              </button>
              <button onClick={(e) => functions.getbyTracks("medium_term")}>
                Get recommendations by Medium Term Top Tracks
              </button>
            </div>
            <div className="funcs">
              <button onClick={(e) => functions.getbyArtists("long_term")} style={{display: 'none'}}>
                Explore by All-Time Top Artists
              </button>
              <button onClick={(e) => functions.getbyTracks("long_term")}>
                Get recommendations by Long Term Top Tracks
              </button>
            </div>
            <div className="funcs">
            <select onChange={this.setGenre}>
              <option>Select</option>
              <option value="rock">Rock</option>
              <option value="folk">Folk</option>
              <option value="grime">Grime</option>
              <option value="samba">Samba</option>
              <option value="progressive">Progressive</option>
            </select>
            <button onClick={this.getRecked}>Get recommendations by Short Term Top Tracks in the {this.state.genre} genre</button>
            </div>
            <div className="funcs">
              <button onClick={this.getAutoRecked}>
                Get recommendations based on most played genre: {this.state.mpg}
              </button>
            </div>
            <div className="funcs">
              <button onClick={this.getArtistAutoRecked}>
                Get recommendations based on genre of most played artists: {this.state.artistmpg}
              </button>
            </div>
          </Fragment>
        ) : (
          ""
        )}
      </div>
    );
  }
}

functions.getbyArtists = async (timeRange) => {
  //spotifyHelper.setRecommendationsByTopArtists(timeRange);
};

functions.getbyTracks = async (timeRange) => {
  let audioFeatures = await spotifyHelper.getUserTopTracksAudioFeatures(timeRange);
  
  // this is going to do a refresh right now
  let cfaProfile = await statisticalAnalysisHelper.getCfa(audioFeatures);

  // pretty sloppy
  let userTopTracks = JSON.parse(localStorage.getItem("spotify-top-tracks")).slice(0, 5).map(track => track.id);;

  // let's just do rc1 for now
  let attributes = cfaProfile.profile_cfa.filter((row) => row.RC1 !== 0);

  let recommendationsRequest = {};
  recommendationsRequest.seed_tracks = userTopTracks;
  recommendationsRequest.limit = 100;

  attributes.forEach((attribute) => 
  {
    recommendationsRequest[`target_${attribute._row}`] = attribute.new_RC1;
  });

  // users recommendations based on the attributes and top artists
  let recommendations = await spotifyClient.recommendations.get(recommendationsRequest);

  localStorage.setItem("spotify-data", JSON.stringify(recommendations));

  // pretty clunky
  window.location.reload();
};

functions.getbyGenreTracks = async (timeRange,genre) => {
  let audioFeatures = await spotifyHelper.getGenreTracksAudioFeatures(timeRange,genre);
  //console.log(audioFeatures);
  console.log(genre);
  
  // this is going to do a refresh right now
  let cfaProfile = await statisticalAnalysisHelper.getCfa(audioFeatures);

  // pretty sloppy
  let userTopTracks = JSON.parse(localStorage.getItem("spotify-top-tracks")).slice(0, 5);

  // let's just do rc1 for now
  let attributes = cfaProfile.profile_cfa.filter((row) => row.RC1 !== 0);

  let recommendationsRequest = {};
  recommendationsRequest.seed_tracks = userTopTracks;
  recommendationsRequest.limit = 100;

  attributes.forEach((attribute) => 
  {
    recommendationsRequest[`target_${attribute._row}`] = attribute.new_RC1;
  });

  // users recommendations based on the attributes and top artists
  let recommendations = await spotifyClient.recommendations.get(recommendationsRequest);

  localStorage.setItem("spotify-data", JSON.stringify(recommendations));

  // pretty clunky
  window.location.reload();
};
