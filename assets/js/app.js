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

$(window).ready(function()  {
  //Image carousel loader
  $('#instructionModal').modal('show')
  // $('.multiple-items').slick({
  //   infinite: true,
  //   slidesToShow: 3,
  //   slidesToScroll: 3
  // })
  $('.center').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
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
  });
})


//Handles the animation transition for upload page -> results page
//TODO: When we are adding reset page (or upload another image) might need to tinker with this
//'hide' class simply sets display:none property
$('#imgSubmit').on('click', function () {
  $('#imgInputDiv').addClass('slideOutRight')
  $('#imgInputDiv').on('animationend', function () {
    $('#imgInputDiv').addClass('hide')
    $('#resultsDiv').removeClass('hide')
    $('#resultsDiv').addClass('slideInLeft')
  })
})



$('form').submit(false)
