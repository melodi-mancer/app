import axios from "axios";

const statisticalAnalysisApiClient = {
  getCfa: async function (audioFeatures) {
    let analysis = [];
    await axios({
      method: "POST",
      url:
        "https://melodimancers.com/cfa",
      data: audioFeatures,
      json: true,
    }).then((res) => {
      analysis = res.data;
    });
    return analysis;
  }
};

export default statisticalAnalysisApiClient;
