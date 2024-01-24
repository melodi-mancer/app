import React, { Fragment, Keyboard } from "react";
import spotifyClient from "../spotifyClient";
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
    };
    this.timer = null;
    this.artists = null;
    this.tracks = null;

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
    this.artists = await spotifyClient.searchArtist(v);
    this.setState({ artistsUpdated: true });
    this.setState({ loading: false });
  };

  handleTrack = async (v) => {
    this.artists = null;
    this.artistInput.current.value = "";
    this.tracks = await spotifyClient.searchTrack(v);
    this.setState({ tracksUpdated: true });
    this.setState({ loading: false });
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
              <button onClick={(e) => functions.getbyArtists("medium_term")} style={{display: 'none'}}>
                Explore by Recent Top Artists
              </button>
              <button onClick={(e) => functions.getbyTracks("medium_term")}>
                Get recommendations by Short Term Top Tracks
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
          </Fragment>
        ) : (
          ""
        )}
      </div>
    );
  }
}

functions.getbyArtists = async (timeRange) => {
  //spotifyClient.databyAllTimeTopArtists(range);
};

functions.getbyTracks = async (timeRange) => {
  spotifyClient.databyAllTimeTopTracks(timeRange);

  //let audioFeatures = await spotifyClient.getUserTopTracksAudioFeatures(timeRange);
  //let stats = await statisticalAnalysisHelper.getSummary(audioFeatures);
  //onsole.log(stats);
};
