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
  search.requests[0].image.source.imageUri = url + '?downsize=700:*&output-format=auto&output-quality=auto'
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

      // only add new search to gallery if it doesn't already exist
      database.ref().child('gallery').once('value', function (bigSnapshot) {
        // grab database, loop through gallery, parse objects, check URLs
        var entries = bigSnapshot.val()
        let arr = Object.entries(entries).map(e => Object.assign(e[1], { key: e[0] }))
        var isThere = false
        for (var i = 0; i < arr.length; i++) {
          if (JSON.parse(arr[i]).url === dataObj.url) {
            isThere = true
          }
        }
        if (!isThere) {
          console.log('no duplicate entry found, adding')
          database.ref().child('gallery').push(JSON.stringify(dataObj))
        }
      })
      populateLabelButtons(labels)
    }, function (reason) {
      console.log('Error: ' + reason.result.error.message)
    })
};

// visionByURL('https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr06/2013/5/7/10/enhanced-buzz-16842-1367938322-0.jpg?downsize=700:*&output-format=auto&output-quality=auto', 5)

// firebase listener
database.ref().on('child_changed', function (snapshot) {
  // checks if the change was because google cloud vision just completed
  if (snapshot.key === 'newSearch') {
    // create buttons of the labels in the snapshot, which will trigger wikipedia API
  }
})

// Wikipedia Helper Function
const callWikipedia = (wikiSearchTerm) => {
  $.ajax({
    'url': 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiSearchTerm + '&limit=5&namespace=0&format=json&origin=*'
  }).then(function (response) {
    populateWikiCards(response)
  })
}

// Window Load and DOM interaction
const populateLabelButtons = (labels) => {
  for (let i = 0; i < labels.length; i++) {
    const labelButton = $(`<button class="label-button btn btn-secondary m-1" value="${labels[i]}">${labels[i]}</button>`)
    $('#label-buttons').append(labelButton)
  }
}

const populateWikiCards = (params) => {
  $('#result-cards').empty()
  for (let i = 0; i < params[1].length; i++) {
    for (let j = 0; j < params[0][j].length; j++) {
      let newColumn = $('<div class="col-sm-12 col-md-6 col-lg-4 my-1">')
      let newCard = $('<div class="card">')
      let newCardBody = $('<div class="card-body">')
      let newCardTitle = $(`<h4 class="card-title">${params[1][i]}</h4>`)
      let newCardText = $(`<p class="card-text">${params[2][i]}</p>`)
      let newCardButton = $(`<a href="${params[3][i]}" class="btn btn-secondary" target="_blank">Read More</a>`)

      newCardBody.append(newCardTitle)
      newCardBody.append(newCardText)
      newCardBody.append(newCardButton)
      newCard.append(newCardBody)
      newColumn.append(newCard)
      $('#result-cards').append(newColumn)
    }
  }
}

// Image carousel loader
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

// Populates the carousel
database.ref().child('gallery').once('value', function (galSnapshot) {
  var value = galSnapshot.val()
  let arr = Object.entries(value).map(e => Object.assign(e[1], { key: e[0] }))
  for (var i = 0; i < arr.length; i++) {
    var newCaroVal = $('<img>')
    var url = JSON.parse(arr[i])
    url = url.url
    newCaroVal.attr('src', url)
    newCaroVal.css('max-height', '200px')
    $('.center').slick('slickAdd', newCaroVal)
  }
})

// Window Load and DOM interaction
$(window).ready(function () {
  $('#instructionModal').modal('show')
})

// Handles the animation transition for upload page -> results page
// TODO: When we are adding reset page (or upload another image) might need to tinker with this
// 'hide' class simply sets display:none property
$('#imgSubmit').on('click', function () {
  visionByURL($('#imgUrlInput').val(), 5)
  $('#img-url').html($(`<img src="${searchUrl}" class="result-img">`))
  $('#imgInputDiv').addClass('slideOutRight')
  $('#imgInputDiv').on('animationend', function () {
    $('#imgInputDiv').addClass('hide')
    $('#resultsDiv').removeClass('hide')
    $('#resultsDiv').addClass('slideInLeft')
    $('#reset').removeClass('hide')
  })
})

$(document).on('click', '.label-button', (event) => {
  console.log(event)
  callWikipedia(event.target.value)
})

$('#reset').on('click', function () {
  location.reload()
})

$('form').submit(false)
