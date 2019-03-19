// google vision API key: AIzaSyB5sUYWoVsXdrrobdoe9u2NUiTP-QrbuQU
// takes in a POST request, not a GET
// takes an object in POST request, returns an object with results
// uses google API helper library gapi
// ***REQUIRES LIVE SERVER WHEN IN TEST ENVIRONMENT***

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
                    "maxResults": 5
                }
            ]
        }
    ]
}

//takes in a URL in the form of a string, and max number of results 
//returns response object
function visionByURL(url, numResults) {
    search.requests[0].image.source.imageUri = url;
    search.requests[0].features[0].maxResults = numResults;

    // 1. Load the JavaScript client library.
    return gapi.load('client', start);
}

function start() {
    // 2. Initialize the JavaScript client library.
    return gapi.client.init({
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
            var labels = [];
            var rawLabels = response.result.responses[0].labelAnnotations;

            for (i = 0; i < rawLabels.length; i++) {
                labels[i] = rawLabels[i].description;
            }
            console.log("Labels array: ", labels)

            //TODO: make wikipedia API call based on "response"
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });
};

// sample: visionByURL("http://imgURL...", 5);

