const https = require("https");

exports.handler = async (event) => {
  const url = JSON.parse(event.body).url;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const response = {
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
            },
            body: data,
          };
          resolve(response);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
