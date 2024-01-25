import statisticalAnalysisApiClient from "./statisticalAnalysisApiClient";

const statisticalAnalysisHelper = {
  getCfa: async function (audioFeatures) {
    // Remap to something Sam's API can work with
    let formattedAudioFeatures = audioFeatures.map(f => { return {
      danceability: f.danceability,
      energy: f.energy,
      loudness: f.loudness,
      speechiness: f.speechiness,
      acousticness: f.acousticness,
      instrumentalness: f.instrumentalness,
      liveness: f.liveness,
      valence: f.valence,
      tempo: f.tempo
    }});

    const request = {
      audio_features: formattedAudioFeatures
    };

    console.log(request);

    let response = await statisticalAnalysisApiClient.getCfa(request);

    localStorage.setItem("analysis-data", JSON.stringify(response));

    return response;
  },
};

export default statisticalAnalysisHelper;
