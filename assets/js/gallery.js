
$(window).on('load', function () {
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav'
    });
    $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: true,
        centerMode: true,
        focusOnSelect: true
    });
})


//This will generate cards based off images in the firebase store
//will have to be tweaked to fit what firebase puts out
var FIREBASE_STUFF=[]

//for (var i=0; i<FIREBASE_STUFF.length;i++) {
$('#testCard').on('click', function() {
    var newCard = $('<div>')
    newCard.addClass('card')
    newCard.attr('style', "width: 18rem;")

    var newCardImg = $('<img>')
    newCardImg.addClass('card-img-top')
    //Following line will need to have appropriate alt, probably just the tag thats used
    newCardImg.attr('alt', 'firebase tag')

    //Following line will need to change for 
    //newCardImg.attr('src', FIREBASE_STUFF.image)
    newCardImg.attr('src', 'https://via.placeholder.com/350x150')
    var newCardTextDiv = $('<div>')
    newCardTextDiv.addClass('card-body')
    
    var newCardTextVal = $('<p>')
    newCardTextVal.addClass('card-text')
    //wiki snippet will need to be added here
    newCardTextVal.text('Wiki snippet goes here')

    newCardTextDiv.append(newCardTextVal)
    newCard.append(newCardImg)
    newCard.append(newCardTextDiv)
    $('#cards').append(newCard)
})
//}