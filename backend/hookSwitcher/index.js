const hooks = [
  '',
  '',
  '',
];

function returnResponse(status, message) {
  return ContentService.createTextOutput(JSON.stringify({
    status: status,
    message: message,
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var request = {
      svid: e ? e.parameter.svid : '',
      hash: e ? e.parameter.hash : ''
    };

    if (!request.svid || !request.hash) {
      return returnResponse(false, 'MISSING_PARAMS');
    }
    hooks.forEach(h => {
      UrlFetchApp.fetch(h, {
        "method": "post",
        "payload": {
          "svid": request.svid,
          "hash": request.hash
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}