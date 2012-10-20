var pixelSize,
	pixelSizeValue = document.querySelector('#pixelSizeValue');

document.querySelector('input[type=range]').addEventListener('change', function() {
	pixelSizeValue.innerHTML = this.value;
});

document.querySelector('input[type=file]').addEventListener('change', function(e) {
	imageToCss3(this.files);
});


function imageToCss3(files) {
	pixelSize = document.querySelector('input[type=range]').value;
	document.querySelector('#input').innerHTML = '<p>Processing ...</p>';
	// read the image without uploading it
    var reader = new FileReader();
    reader.onload = pixelize;
    reader.readAsDataURL(files[0]);
}

function pixelize(e) {
	var img = new Image;
	img.src = e.target.result;

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	img.onload = function() {
		var width = img.width,
			height = img.height;

		canvas.width = width;
		canvas.height = height;

		ctx.drawImage(img, 0, 0, width, height);

		// array of array to store the colors
		var colors = new Array(),
			maxX = width / pixelSize,
			maxY = height / pixelSize;

		// two nested loops ? This is slow as heck
		for (var x = 0; x < maxX; x++) {
			colors[x] = new Array();
			for (var y = 0; y < maxY; y++) {
				var imageData = ctx.getImageData((x * pixelSize), (y * pixelSize), pixelSize, pixelSize);
				var data = imageData.data;
				var alpha = data[3] == 0 ? 0 : 1;
				var color = 'rgba('+data[0]+','+data[1]+','+data[2]+','+alpha+')';
				colors[x][y] = color;
			}
		}

		generateCss(colors, maxX, maxY);
		$('#output').css('height', height);
	}
}

function generateCss(colors, maxX, maxY) {
	var mainPixel = $('#mainPixel');

	// the first color is the background of the div
	mainPixel.css({
		'width' : pixelSize,
		'height' : pixelSize,
		'background' : colors[0][0]
	});

	var boxShadowString = '',
		boxShadowExport = '';

	// once again two nested loops. This sucks.
	for (var x = 0; x < maxX; x++) {
		for (var y = 0; y < maxY; y++) {
			var boxShadow = (x * pixelSize) + 'px ' + (y * pixelSize) + 'px 0 ' + colors[x][y];
			boxShadow += ',';
			boxShadowString += boxShadow;
			boxShadowExport += boxShadow+'\n\t\t\t';
		}
	}
	// remove the last comma
	boxShadowString = boxShadowString.slice(0, -1);
	boxShadowExport = boxShadowExport.slice(0, -5);

	document.querySelector('#input').style.display = 'none';

	// apply the css
	mainPixel.css('box-shadow', boxShadowString);

	exportCss(boxShadowExport);
}

function exportCss(boxShadow) {
	var css = 'div{\n';
		css += '\twidth: '+pixelSize+'px;\n';
		css += '\theight: '+pixelSize+'px;\n';
		css += '\tbackground: '+$('#mainPixel').css('background-color')+';\n';
		css += '\tbox-shadow: '+boxShadow+';\n}';

	document.querySelector('textarea').innerHTML = css;

	document.querySelector('#code').style.display = 'block';
}