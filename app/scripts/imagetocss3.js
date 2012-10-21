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
	this.grayscale = false;
	this.pixelate = {on: false, size: 0, gap: 0};
	this.blurValue = 0;
	this.invert = false;
	this.alpha = 1;

	/**
	 *	Set the quality of the output. Default to 1 (same quality as the source image)
	 *
	 *	@param integer quality
	 */
	this.setQuality = function(quality) {
		this.pixelSize = quality;
	}

	this.toGrayscale = function() {
		this.grayscale = true;
	}

	/**
	 *	Set the size of the pixels and the distance between them
	 *	This function automatically set the quality to 1
	 *
	 *	@param integer size Size of the pixel
	 *	@param integer gap Distance between the pixels
	 */
	this.toPixelated = function(size, gap) {
		this.setQuality(1);
		this.pixelate.on = true;
		this.pixelate.size = size || 20;
		this.pixelate.gap = gap || 5;
	}

	/**
	 *	Set the amount of blur to apply to the image
	 *
	 *	@param integer blur
	 */
	this.blur = function(blur) {
		this.blurValue = blur;
	}

	/**
	 *	Invert the colors
	 */
	this.invertColors = function() {
		this.invert = true;
	}

	/**
	 *	Set the opacity
	 *
	 *	@param float alpha Number between 0 and 1
	 */
	this.setOpacity = function(alpha) {
		this.alpha = alpha;
	}

	/**
	 *	Creates a div containing the image created with css3
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
				maxY = self.height / self.pixelSize,
			// this two variables will store the raw css code and an indented css code
				boxShadowString = '',
				boxShadowExport = '',
			// this variable is used to count the number of pixels drawn for the pixelated effect
				gapAddedX = 0,
				gapAddedY = 0,
				lastGapX = 0,
				lastGapY = 0;

			// two nested loops ? This is slow as heck
			for (var y = 0; y < maxY; y++) {
				self.colors[y] = new Array();
				for (var x = 0; x < maxX; x++) {
					var imageData = ctx.getImageData((x * self.pixelSize), (y * self.pixelSize), self.pixelSize, self.pixelSize);
					var data = imageData.data;
					var alpha = data[3] == 0 ? 0 : 1;

					// if set to grayscale is true, change the color
					if (self.grayscale) {
						var graylevel = parseInt((parseInt(data[0]) + parseInt(data[1]) + parseInt(data[2])) / 3);
						var r = graylevel;
						var g = graylevel;
						var b = graylevel;
					}
					else {
						var r = data[0];
						var g = data[1];
						var b = data[2];
					}

					// invert the colors
					if (self.invert) {
						r = 255 - r;
						g = 255 - g;
						b = 255 - b;
					}

					var color = 'rgba('+r+','+g+','+b+','+self.alpha+')';

					self.colors[y][x] = color;

					if (self.pixelate.on) {
						if (x > self.pixelate.size && (parseInt(x / self.pixelate.size) * self.pixelate.gap) > lastGapX) {
							gapAddedX += self.pixelate.gap;
							lastGapX = gapAddedX;
						}
						if (y > self.pixelate.size && (parseInt(y / self.pixelate.size) * self.pixelate.gap) > lastGapY) {
							gapAddedY += self.pixelate.gap;
							lastGapY = gapAddedY;
						}
						var boxShadow = ((x * self.pixelSize) + gapAddedX) + 'px ' + ((y * self.pixelSize) + gapAddedY) + 'px '+self.blurValue+'px ' + color+',';
					}
					else {
						var boxShadow = (x * self.pixelSize) + 'px ' + (y * self.pixelSize) + 'px '+self.blurValue+'px ' + color+',';
					}

					// append to the code
					boxShadowString += boxShadow;
					boxShadowExport += boxShadow+'\n\t\t\t';
				}
				lastGapX = 0;
				gapAddedX = 0;
			}

			// remove the last comma
			boxShadowString = boxShadowString.slice(0, -1);
			boxShadowExport = boxShadowExport.slice(0, -5);

			// create the element
			var wrapper = document.createElement('div');
			var mainPixel = document.createElement('div');
			wrapper.appendChild(mainPixel);
			var wrapperWidth = self.width,
				wrapperHeight = self.height;

			// adjust the dimension if the pixelated effect is on
			if (self.pixelate.on) {
				wrapperWidth += gapAddedY;
				wrapperHeight += gapAddedY;
			}

			wrapper.setAttribute('style', 'width: '+wrapperWidth+'px; height: '+wrapperHeight+'px;');

			// apply the css
			// the first color is the background of the element
			var style = 'width: '+self.pixelSize+'px; height: '+self.pixelSize+'px; background: transparent;';
				style += 'box-shadow: '+boxShadowString;
			mainPixel.setAttribute('style', style);

			self.element = wrapper;

			// create the indented code
			self.css = 'div{\n';
			self.css += '\twidth: '+self.pixelSize+'px;\n';
			self.css += '\theight: '+self.pixelSize+'px;\n';
			self.css += '\tbackground: '+self.colors[0][0]+';\n';
			self.css += '\tbox-shadow: '+boxShadowExport+';\n}';

			// callback
			cb(self.element);
		}
	}

	/**
	 *	Returns the css generated
	 *
	 *	@param cb Callback function
	 */
	this.exportCSS = function(cb) {
		if (this.css != '') {
			cb(this.css);
		}
		else {
			var self = this;
			this.createElement(function() {
				cb(self.css);
			})
		}
	}
}