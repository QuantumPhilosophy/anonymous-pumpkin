'use strict'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCx0YFX55Dn5KpBEvdzL9BMotSIld3G8-M',
  authDomain: 'anonymous-pumpkin.firebaseapp.com',
  databaseURL: 'https://anonymous-pumpkin.firebaseio.com',
  projectId: 'anonymous-pumpkin',
  storageBucket: 'anonymous-pumpkin.appspot.com',
  messagingSenderId: '149175598768'
}
firebase.initializeApp(config)

var database = firebase.database()

// google vision API key: AIzaSyB5sUYWoVsXdrrobdoe9u2NUiTP-QrbuQU
// takes in a POST request, not a GET
// takes an object in POST request, returns an object with results
// uses google API helper library gapi

// ***************REQUIRES LIVE SERVER WHEN IN TEST ENVIRONMENT***************

var search = {
  'requests': [
    {
      'image': {
        'source': {
          'imageUri':
            ''
        }
      },
      'features': [
        {
          'type': 'LABEL_DETECTION',
          'maxResults': 5
        }
      ]
    }
  ]
}

var searchUrl
// takes in a URL in the form of a string, and max number of results
// returns response object
function visionByURL (url, numResults) {
  search.requests[0].image.source.imageUri = url
  search.requests[0].features[0].maxResults = numResults
  searchUrl = url
  // 1. Load the JavaScript client library.
  return gapi.load('client', start)
}

function start () {
  // 2. Initialize the JavaScript client library.
  return gapi.client.init({
    'apiKey': 'AIzaSyB5sUYWoVsXdrrobdoe9u2NUiTP-QrbuQU'
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
      var labels = []
      var rawLabels = response.result.responses[0].labelAnnotations

      for (var i = 0; i < rawLabels.length; i++) {
        labels[i] = rawLabels[i].description
      }

      // update firebase
      var dataObj = {
        url: searchUrl,
        labels: labels
      }
      database.ref().child('newSearch').set(JSON.stringify(dataObj))
      database.ref().child('gallery').push(JSON.stringify(dataObj))
    }, function (reason) {
      console.log('Error: ' + reason.result.error.message)
    })
};

// visionByURL("https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr06/2013/5/7/10/enhanced-buzz-16842-1367938322-0.jpg?downsize=700:*&output-format=auto&output-quality=auto", 5);

// firebase listener
database.ref().on('child_changed', function (snapshot) {
  // checks if the change was because google cloud vision just completed
  if (snapshot.key === 'newSearch') {
    // create buttons of the labels in the snapshot, which will trigger wikipedia API
  }
})

// Wikipedia Helper Functions
const wikiSearchTermValue = 'wolf'

const callWikipedia = (wikiSearchTerm) => {
  $.ajax({
    'url': 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiSearchTerm + '&limit=5&namespace=0&format=json&origin=*'
  }).then(function (response) {
    populateWikiCards(response)
  })
}

const populateWikiCards = (params) => {
  for (let i = 0; i < params[1].length; i++) {
    for (let j = 0; j < params[0][j].length; j++) {
      // console.log('*********************')
      // console.log('returnedSearchItem:', params[1][i])
      // console.log('returnedSearchSnippet:', params[2][i])
      // console.log('returnedSearchUrl:', params[3][i])
    }
  }
}

callWikipedia(wikiSearchTermValue)





$('.center').slick({
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3,
  adaptiveHeight: true,

  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
})

//Populates the carousel
database.ref().child('gallery').once("value", function(galSnapshot) { 
  var value=galSnapshot.val()
  let arr = Object.entries(value).map(e => Object.assign(e[1], { key: e[0]}))
  for (var i = 0; i<arr.length; i++) {
    var newCaroVal = $('<img>')
    var url = JSON.parse(arr[i])
    //YO DAWG
    url = url.url
    newCaroVal.attr('src', url)
    newCaroVal.css('max-height', '200px')
    $('.center').slick('slickAdd', newCaroVal);
  }
})


// Window Load and DOM interaction
$(window).ready(function () {
  $('#instructionModal').modal('show')
  // Image carousel loader
  
})



// Handles the animation transition for upload page -> results page
// TODO: When we are adding reset page (or upload another image) might need to tinker with this
// 'hide' class simply sets display:none property
$('#imgSubmit').on('click', function () {
  $('#imgInputDiv').addClass('slideOutRight')

  $('#imgInputDiv').on('animationend', function () {
    $('#imgInputDiv').addClass('hide')
    $('#resultsDiv').removeClass('hide')
    $('#resultsDiv').addClass('slideInLeft')
    $('#reset').removeClass('hide')
  })
})

$('#reset').on('click', function () {
  location.reload()
})

$('form').submit(false)
