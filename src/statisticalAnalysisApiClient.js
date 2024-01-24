import axios from "axios";

const statisticalAnalysisApiClient = {
  getSummary: async function (audioFeatures) {
    let analysis = [];
    await axios({
      method: "POST",
      url:
        "http://206.81.18.129:8000/summary_table",
      data: audioFeatures,
      json: true,
    }).then((res) => {
      analysis = res.data;
    });
    return analysis;
  }
};

export default statisticalAnalysisApiClient;
