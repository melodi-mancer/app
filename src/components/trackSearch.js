import React, { Component, Fragment } from "react";
import spotifyHelper from "../spotifyHelper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class trackSearch extends Component {
  constructor() {
    super();
    this.state = {
      suggUpdated: false,
    };
    this.selection = [];
    this.searchResultlist = React.createRef();
  }

  scrollToElement = () =>
    this.searchResultlist.current.scrollIntoView(true, {
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });

  handletrackSelection = async (e, val) => {
    let index = this.selection.indexOf(val);
    if (index < 0 && this.selection.length < 5) {
      this.selection.push(val);
      document.cookie =
        "selection=" + this.selection + ";max-age=3600;samesite=lax;Secure";
      this.toggleSelected(e);
      this.setState({ suggUpdated: true });
    } else if (index >= 0 && this.selection.length <= 5) {
      this.selection.splice(index, 1);
      document.cookie =
        "selection=" + this.selection + ";max-age=3600;samesite=lax;Secure";
      this.toggleSelected(e);
      this.setState({ suggUpdated: true });
    }
    if (this.selection.length <= 0) {
      this.clearCookie();
    }
    if (this.selection.length === 5) {
      toast.error("reached maximum selection capacity!");
    }
  };

  toggleSelected = async (e) => {
    e.classList.toggle("selected");
  };

  clearCookie = async () => {
    document.cookie = "selection=;max-age=0;samesite=lax;Secure";
  };

  getRecommendations = async () => {
    spotifyHelper.setRecommendationsBySelectedTracks(this.selection);
  };

  render() {
    return (
      <Fragment key="trackSearch">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          icon={false}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          theme="dark"
        />
        {this.selection.length > 0 ? (
          <div className="funcs">
            <button onClick={(e) => this.getRecommendations()}>
              Recommend Tracks
            </button>
          </div>
        ) : (
          ""
        )}
        <ul
          ref={this.searchResultlist}
          className={this.props.tracks.length === 1 ? "single" : ""}
        >
          {this.props.tracks.map((track) => (
            <Fragment key={track.id}>
              <li>
                <div className="track-results">
                  <div
                    className="item"
                    onClick={(e) =>
                      this.handletrackSelection(e.target, track.id)
                    }
                  >
                    {track.album.images[0] ? (
                      <div className="art">
                        <img
                          alt="album art"
                          src={track.album.images[2].url}
                        ></img>
                      </div>
                    ) : (
                      ""
                    )}
                    <p className="name">
                      {track.name}
                      <span>
                        {track.artists.map(
                          (item, index) => (index ? ", " : "") + item.name
                        )}
                      </span>
                      <span className="album">{track.album.name}</span>
                    </p>
                  </div>
                </div>
              </li>
            </Fragment>
          ))}
        </ul>
        {/* {this.suggestions ? <div className='display'>
                    <span className="selected">selected</span>
                    <span className="items">{this.suggestions}</span>
                </div> : ""} */}
      </Fragment>
    );
  }
}
