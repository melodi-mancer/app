import statisticalAnalysisApiClient from "./statisticalAnalysisApiClient";

const statisticalAnalysisHelper = {
  getSummary: async function (audioFeatures) {
    // Remap to something Sam's API can work with
    let formattedAudioFeatures = audioFeatures.map(f => { return {
      Danceability: f.danceability,
      Energy: f.energy,
      Loudness: f.loudness,
      Speechiness: f.speechiness,
      Acousticness: f.acousticness,
      Instrumentalness: f.instrumentalness,
      Liveness: f.liveness,
      Valence: f.valence,
      Tempo: f.tempo
    }});

    return await statisticalAnalysisApiClient.getSummary(formattedAudioFeatures);
  }
};

export default statisticalAnalysisHelper;
