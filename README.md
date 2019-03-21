# anonymous-pumpkin

## Description
This app will take advantage of an image analysis API and then will return information from a second API based on the image's subjects

### Firebase
Firebase is used to store previously analyzed images utilizing a real time database

### APIs Used
#### Google Cloud Vision
https://cloud.google.com/vision/
Takes in the URL for a publicly accessible image, and then analyzes that image. By using the "LABEL_DETECTION" mode, the API will return an object with labels of what it believes is in the image, ranked by weight. 

The API calls are handled by google's helper library "gapi", which makes the actual AJAX requests.

#### Wikipedia
For the information look up for labels returned by Google Cloud Vision API the https://en.wikipedia.org/w/api.php end point was selected.

Using `action=opensearch` witch returns a group of pages based off the `search=` value in an array with Page Titles, Page Snippets, and Page URLs each as an array.

The number of items in each of the inner arrays returned by `action=opensearch` is controlled by `limit=`.

`origin=*` is used to allow for CORS

### Languages Used
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
  * JavaScript
  * jQuery
  * Bootstrap 4
  * CSS 3
  * HTML 5

### Libraries Used
#### Animate.css
https://daneden.github.io/animate.css/ provides the animations attached to the main sections, fading and moving in and out of the view port

#### Slick
http://kenwheeler.github.io/slick/ is used to generate the carousel that displays previously analyzed images

#### Particles.js
https://marcbruederlin.github.io/particles.js/ supplies the vector animation graphics in the background

## Other
Using `.gitkeep` to hold the empty `images` directory in GitHub.
