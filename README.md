# Image to CSS3

  This script convert images to css3 using box shadows.

  [Demo](http://romainberger.com/lab/image-to-css3)

## Documentation

  To use the class, just include the script in the html file

  ```html
    <script src="scripts/imagetocss3.js"></script>
  ```

  First you need to create an object, with an image as parameter

  ```javascript
    var img = new Image;
    img.src = 'img/myImage.png';

    var imageToCSS3 = new ImageToCSS3(img);
  ```

  The class has two method: `createElement()` and `exportCSS()`.
  To create an element and to add it to your document:

  ```javascript
    imageToCSS3.createElement(function(element) {
      var output = document.querySelector('#output');
      output.appendChild(element);
    });
  ```

  To get the css generated:

  ```javascript
    imageToCSS3.exportCSS(function(css) {
      console.log(css);
    });
  ```

  The performance are really bad for now...