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

let database = firebase.database()

// google vision API key: AIzaSyB5sUYWoVsXdrrobdoe9u2NUiTP-QrbuQU
// takes in a POST request, not a GET
// takes an object in POST request, returns an object with results
// uses google API helper library gapi

// ***************REQUIRES LIVE SERVER WHEN IN TEST ENVIRONMENT***************

let search = {
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

let searchUrl
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
      if (response.result.responses[0].error) {
        $('#error-message').text(response.result.responses[0].error.message).removeClass('hide')
      }
      let labels = []
      let rawLabels = response.result.responses[0].labelAnnotations

      for (let i = 0; i < rawLabels.length; i++) {
        labels[i] = rawLabels[i].description
      }

      // update firebase
      let dataObj = {
        url: searchUrl,
        labels: labels
      }
      database.ref().child('newSearch').set(JSON.stringify(dataObj))

      // only add new search to gallery if it doesn't already exist
      database.ref().child('gallery').once('value', function (bigSnapshot) {
        // grab database, loop through gallery, parse objects, check URLs
        let entries = bigSnapshot.val()
        let arr = Object.entries(entries).map(e => Object.assign(e[1], { key: e[0] }))
        let isThere = false
        for (let i = 0; i < arr.length; i++) {
          if (JSON.parse(arr[i]).url === dataObj.url) {
            isThere = true
          }
        }
        if (!isThere) {
          database.ref().child('gallery').push(JSON.stringify(dataObj))
        }
      })
      populateLabelButtons(labels)
    }, function (reason) {
      console.log('Error: ' + reason.result.error.message)
    })
};

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
  $('#error-message').addClass('hide')
  $('#result-cards').empty()

  if (params[1].length === 0) {
    $('#error-message').text('There are no Wikipedia pages with the title: ' + params[0]).removeClass('hide')
  }
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
  let value = galSnapshot.val()
  let arr = Object.entries(value).map(e => Object.assign(e[1], { key: e[0] }))
  for (let i = 0; i < arr.length; i++) {
    let newCaroVal = $('<img>')
    let url = JSON.parse(arr[i])
    url = url.url
    newCaroVal.attr('src', url)
    newCaroVal.css('max-height', '200px')
    $('.center').slick('slickAdd', newCaroVal)
  }
})

// Window Load and DOM interaction
$(window).ready(function () {
  if (sessionStorage.getItem('modal-shown') === null || false) {
    $('#instructionModal').modal('show')
    sessionStorage.setItem('modal-shown', true)
  }

  // Image carousel loader
  Particles.init({
    selector: '.background',
    connectParticles: true,
    responsive: [
      {breakpoint:768,
        options: {
          maxParticles:
            200,
          connectParticles:
            false
        }
      }, {
        breakpoint:425,
        options: {
          maxParticles:100,
          connectParticles:
            false
        }
      }, {
        breakpoint:320,
        options: {
          maxParticles:
            0

          // disables particles.js
        }
      }
    ]
  })
})

// Handles the animation transition for upload page -> results page
// TODO: When we are adding reset page (or upload another image) might need to tinker with this
// 'hide' class simply sets display:none property
$('#imgSubmit').on('click', function () {
  if ($('#imgUrlInput').val() !== '') {
    $('#user-feedback').addClass('hide')
    visionByURL($('#imgUrlInput').val(), 5)
    $('#img-url').html($(`<img src="${searchUrl}" class="result-img">`))
    $('#imgInputDiv').addClass('slideOutRight')
    $('#imgInputDiv').on('animationend', function () {
      $('#imgInputDiv').addClass('hide')
      $('#resultsDiv').removeClass('hide')
      $('#resultsDiv').addClass('slideInLeft')
      $('#reset').removeClass('hide')
    })
  } else {
    $('#user-feedback').text('Please enter an image.').removeClass('hide')
  }
})

$(document).on('click', '.label-button', (event) => {
  callWikipedia(event.target.value)
})

$('#reset').on('click', function () {
  location.reload()
})

$('form').submit(false)
