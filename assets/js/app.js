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


$(window).on('load',function(){
  $('#instructionModal').modal('show');
});

$('#imgSubmit').on('click', function() {
  $('#imgInputDiv').addClass("slideOutRight")
  $('#imgInputDiv').on('animationend', function() {
    $('#imgInputDiv').addClass('hide')
    $('#resultsDiv').removeClass('hide')
    $('#resultsDiv').addClass("slideInLeft")
  })


})

$('form').submit(false);
