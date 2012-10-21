# Image to CSS3

  Javascript class to convert images to css3 using box shadows.
  The performance are really bad for now. Be carefull when using big images.

  [Demo](http://romainberger.com/lab/image-to-css3)

## Basic usage

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

### Create an element

  To create an element and to add it to your document:

  ```javascript
    imageToCSS3.createElement(function(element) {
      var output = document.querySelector('#output');
      output.appendChild(element);
    });
  ```

### Get the generated css

  To get the css generated:

  ```javascript
    imageToCSS3.exportCSS(function(css) {
      console.log(css);
    });
  ```

## Effects

  There are different effects available. All these methods have to be called before creating the element or generating the css.

### Set the quality

  The object has a method `setQuality(integer)` which determines the quality of the output generated.
  By default it is set to 1, which means the quality will be exactly the same to the original image.
  The performance and the time the script will spend generating the image is directly related to the
  quality.

  ```javascript
    imageToCSS3.setQuality(2);
  ```

### Convert to grayscale

  ```javascript
    imageToCSS3.toGrayscale();
  ```

### Add blur

  The value you use as a parameter determines the amount of blur

  ```javascript
    imageToCSS3.blur(10);
  ```

## Notes

  When generating an image or the css code, be sure to place all your code in the callback function.
  For example if you want both the image and the code:

  ````javascript
    /** Bad **/
    imageToCSS3.createElement(function(element) {
      ...
    });

    imageToCSS3.exportCSS(function(css) {
      ...
    });

    /** Good **/
    imageToCSS3.createElement(function(element) {
      ...

      imageToCSS3.exportCSS(function(css) {
        ...
      });
    });
  ```