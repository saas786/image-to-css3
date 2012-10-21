document.querySelector('input[type=range]').addEventListener('change', function() {
	document.querySelector('#pixelSizeValue').innerHTML = this.value;
});

document.querySelector('input[type=file]').addEventListener('change', function(e) {
	var pixelSize = document.querySelector('input[type=range]').value;
	document.querySelector('#input').innerHTML = '<p>Processing ...</p>';

	// read the image without uploading it
    var reader = new FileReader();
    reader.onload = function(e) {
    	var img = new Image;
		img.src = e.target.result;

		// create the object
		var imageToCSS3 = new ImageToCSS3(img);

		// set the quality
		imageToCSS3.setQuality(pixelSize);

		// get the element created
		imageToCSS3.createElement(function(element) {
			var output = document.querySelector('#output');
			output.appendChild(element);

			// get the css generated
			imageToCSS3.exportCSS(function(css) {
				document.querySelector('#codeWrapper').innerHTML = css;
				document.querySelector('#input').style.display = 'none';
				document.querySelector('#code').style.display = 'block';
			});
		});
    }
    reader.readAsDataURL(this.files[0]);
});