$(window).ready(function () {
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

$(window).on('load', function () {
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  })
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    focusOnSelect: true
  })
})

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

// This will generate cards based off images in the firebase store
// will have to be tweaked to fit what firebase puts out

database.ref().child('gallery').once('value', function (snapshot) {
  // grab database, loop through gallery, parse objects
  var entries = snapshot.val()
  let arr = Object.entries(entries).map(e => Object.assign(e[1], { key: e[0] }))
  for (var i = 0; i < arr.length; i++) {
    arr[i] = JSON.parse(arr[i])
  }

  for (var i = 0; i < arr.length; i++) {
    var newCard = $('<div>')
    newCard.addClass('card')
    newCard.attr('style', 'width: 20rem;')
    newCard.addClass('mb-3 mr-5')
    var newCardImg = $('<img>')
    newCardImg.addClass('card-img-top')
    // Following line will need to have appropriate alt, probably just the tag thats used
    // newCardImg.attr('alt', 'firebase tag')

    // Following line will need to change for
    newCardImg.attr('src', arr[i].url)
    var newCardTextDiv = $('<div>')
    newCardTextDiv.addClass('card-body')

    var newCardTextVal = $('<p>')
    newCardTextVal.addClass('card-text')

    // wiki snippet will need to be added here
    // newCardTextVal.text(arr[i].labels)  ==> for text only labels. Replaced with button code below
    for (var j = 0; j < arr[i].labels.length; j++) {
      var label = arr[i].labels[j]
      const labelButton = $(`<button class="label-button btn btn-secondary m-1" value="${label}">${label}</button>`)
      newCardTextVal.append(labelButton)
    }

    newCardTextDiv.append(newCardTextVal)
    newCard.append(newCardImg)
    newCard.append(newCardTextDiv)

    $('#cards').append(newCard)
  }
})

$(document).on('click', '.label-button', function () {
  var wikiSearchTerm = $(this).val()
  $.ajax({
    'url': 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiSearchTerm + '&limit=2&namespace=0&format=json&origin=*'
  }).then(function (response) {
    console.log('test', response)
    $('.modal-title').text(response[0])
    $('.modal-body').html(response[2][0] + '<br>' + "<a target='_blank' href='" + response[3][0] + "'>" + response[3][0] + '</a>')
    $('#wikiModal').modal('show')
  })
})
