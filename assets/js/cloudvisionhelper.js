// google vision API key: AIzaSyB5sUYWoVsXdrrobdoe9u2NUiTP-QrbuQU
// takes in a POST request, not a GET
// takes an object in POST request, returns an object with results

// The format of the data being sent in the ajax request is described here:
// https://cloud.google.com/vision/docs/request#json_request_format

var search = {
    "requests": [
        {
            "image": {
                "source": {
                    "imageUri":
                        ""
                }
            },
            "features": [
                {
                    "type": "LABEL_DETECTION",
                    "maxResults": 1
                }
            ]
        }
    ]
}

//takes in a URL in the form of a string, and optionally max number of results (default is 1)
//returns response object
function visionByURL(url, numResults = 1) {
    search.requests[0].image.source.imageUri = url;
    search.requests[0].features.maxResults = numResults;
    // 1. Load the JavaScript client library.
    gapi.load('client', start);
}

function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'AIzaSyB5sUYWoVsXdrrobdoe9u2NUiTP-QrbuQU',
    })
        .then(function () {
            // 3. Initialize and make the API request.
            return gapi.client.request({
                'path': 'https://vision.googleapis.com/v1/images:annotate?',
                'method': 'POST',
                'body': search
            })
        })
        .then(function (response) {
            //TODO: make wikipedia API call based on "response"
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });
};
