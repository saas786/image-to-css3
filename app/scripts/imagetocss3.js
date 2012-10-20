/**
 *	Image to CSS converter
 *
 *	@author Romain Berger <romain@romainberger.com>
 */


var ImageToCSS3 = function(img) {
	this.img = img;
	this.pixelSize = 1;
	this.element;
	this.css = '';
	this.colors = new Array();
	this.width;
	this.height;

	/**
	 *	Set the quality of the output. Default to 1 (same quality as the source image)
	 *
	 *	@param integer quality
	 */
	this.setQuality = function(quality) {
		this.pixelSize = quality;
	}

	/**
	 *	Returns a div containing the image created with css3
	 *
	 *	@param cb Callback function
	 */
	this.createElement = function(cb) {
		var self = this;

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');

		this.img.onload = function() {
			self.width = img.width,
			self.height = img.height;

			canvas.width  = self.width;
			canvas.height = self.height;

			ctx.drawImage(img, 0, 0, self.width, self.height);

			var	maxX = self.width / self.pixelSize,
				maxY = self.height / self.pixelSize;

			// two nested loops ? This is slow as heck
			for (var x = 0; x < maxX; x++) {
				self.colors[x] = new Array();
				for (var y = 0; y < maxY; y++) {
					var imageData = ctx.getImageData((x * self.pixelSize), (y * self.pixelSize), self.pixelSize, self.pixelSize);
					var data = imageData.data;
					var alpha = data[3] == 0 ? 0 : 1;
					var color = 'rgba('+data[0]+','+data[1]+','+data[2]+','+alpha+')';
					self.colors[x][y] = color;
				}
			}

			self.generateCSS();
			cb(self.element);
		}
	}

	this.generateCSS = function() {
		var	maxX = this.width / this.pixelSize,
			maxY = this.height / this.pixelSize;

		var wrapper = document.createElement('div');
		var mainPixel = document.createElement('div');
		wrapper.appendChild(mainPixel);
		wrapper.setAttribute('style', 'width: '+this.width+'px; height: '+this.height+'px;');

		var boxShadowString = '',
			boxShadowExport = '';

		// once again two nested loops. This sucks.
		for (var x = 0; x < maxX; x++) {
			for (var y = 0; y < maxY; y++) {
				var boxShadow = (x * pixelSize) + 'px ' + (y * pixelSize) + 'px 0 ' + this.colors[x][y];
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
		// the first color is the background of the element
		var style = 'width: '+this.pixelSize+'px; height: '+this.pixelSize+'px; background: '+this.colors[0][0]+';';
			style += 'box-shadow: '+boxShadowString;
		mainPixel.setAttribute('style', style);

		this.element = wrapper;

		this.css = 'div{\n';
		this.css += '\twidth: '+this.pixelSize+'px;\n';
		this.css += '\theight: '+this.pixelSize+'px;\n';
		this.css += '\tbackground: '+this.colors[0][0]+';\n';
		this.css += '\tbox-shadow: '+boxShadowExport+';\n}';
	}

	/**
	 *	Returns the css generated
	 *
	 *	@param cb Callback function
	 */
	this.exportCSS = function(cb) {
		var self = this;
		if (this.css != '') {
			cb(this.css);
		}
		else {
			this.createElement(function() {
				cb(self.css);
			})
		}
	}
}