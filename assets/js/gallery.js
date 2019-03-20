
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
    newCardTextVal.text(arr[i].labels)

    newCardTextDiv.append(newCardTextVal)
    newCard.append(newCardImg)
    newCard.append(newCardTextDiv)

    $('#cards').append(newCard)
  }
})
