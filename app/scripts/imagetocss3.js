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
				maxY = self.height / self.pixelSize;

			// this two variables will store the raw css code and an indented css code
			var boxShadowString = '',
			boxShadowExport = '';

			// two nested loops ? This is slow as heck
			for (var x = 0; x < maxX; x++) {
				self.colors[x] = new Array();
				for (var y = 0; y < maxY; y++) {
					var imageData = ctx.getImageData((x * self.pixelSize), (y * self.pixelSize), self.pixelSize, self.pixelSize);
					var data = imageData.data;
					var alpha = data[3] == 0 ? 0 : 1;
					var color = 'rgba('+data[0]+','+data[1]+','+data[2]+','+alpha+')';
					self.colors[x][y] = color;

					// append to the code
					var boxShadow = (x * self.pixelSize) + 'px ' + (y * self.pixelSize) + 'px 0 ' + color;
					boxShadow += ',';
					boxShadowString += boxShadow;
					boxShadowExport += boxShadow+'\n\t\t\t';
				}
			}

			// remove the last comma
			boxShadowString = boxShadowString.slice(0, -1);
			boxShadowExport = boxShadowExport.slice(0, -5);

			// create the element
			var wrapper = document.createElement('div');
			var mainPixel = document.createElement('div');
			wrapper.appendChild(mainPixel);
			wrapper.setAttribute('style', 'width: '+self.width+'px; height: '+self.height+'px;');

			// apply the css
			// the first color is the background of the element
			var style = 'width: '+self.pixelSize+'px; height: '+self.pixelSize+'px; background: '+self.colors[0][0]+';';
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