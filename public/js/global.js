function SintahKlaes(_canvas) {
	var self = this,
		canvas = _canvas,
		context = _canvas.getContext("2d"),
		objects = new Array(),
		music = Content.Audio['backgroundMusic'],
		lastUpdate;
	
	init = function () {
		window.addEventListener("resize", function (e) { self.editSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight); });
		requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		music.autoplay = true;
		music.play();

		objects.push(new Images(self, Math.random(), Math.random(), "sint"));
		for(var e = 0; e<Settings.NUMPIETENOBJECTS; e++) {
			objects.push(new Images(self, Math.random(), Math.random(), "piet"));
		}
		for(var e = 0; e<Settings.NUMTEXTOBJECTS; e++) {
			objects.push(new Tekst(self, Math.random(), Math.random()));
		}

		lastUpdate = Date.now();
		tick();
	}
	render = function () {
		var objectsLength = objects.length;
		context.clearRect(0, 0, self.size[0], self.size[1]);
		while(objectsLength--) {
			objects[objectsLength].render(context);
		}
	}
	update = function (_dt) {
		var objectsLength = objects.length;
		while(objectsLength--) {
			if(!objects[objectsLength].update(_dt)) {
				objects.splice(objectsLength, 1);
			}
		}
	}
	tick = function () {
		var now = Date.now();
		update((now - lastUpdate)/1000);
		lastUpdate = now;
		render();
		window.setTimeout(function () { requestFrame(tick); }, 1);
	}
	
	this.editSize = function (_width, _height) {
		this.size[0] = _width;
		this.size[1] = _height;
		canvas.width = this.size[0];
		canvas.height = this.size[1];
	}
	this.size = [canvas.width, canvas.height];
	requestFrame = function () { }
	init();
}

function Drawable(_x, _y) {
	return {
				x: _x,
				y: _y,
				render: function () { },
				update: function (dt) { return false;}
			}
}

function Tekst(_parent, _x, _y) {
	var parent = _parent,
		drawable = Drawable(_x, _y),
		tekst = "sintahklaes is baas",
		color, fontSize, font, speed, nextColorUpdate;
	
	init = function () {
		color = Util.getColor();
		fontSize = Util.getFontSize();
		font = Util.getFont();
		speed = 0.1 + Math.random() * Settings.MAXSPEEDS['tekst'];
		nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);
	}
	drawable.update = function (_dt) {
		var parSize = parent.size;
		
		drawable.y += speed * _dt;
		
		if(Date.now() >= nextColorUpdate) {
			color = Util.getColor();
			nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);
		}
		if(drawable.y > 1) {
			fontSize = Util.getFontSize();
			drawable.x = Math.random();
			drawable.y = 0;
		}
		return true;
	}
	drawable.render = function (_context) {
		_context.fillStyle = color;
		_context.font = Util.createFont(fontSize, font);
		_context.fillText(tekst, drawable.x * (parent.size[0] - fontSize * tekst.length / 2), drawable.y * (parent.size[1] + fontSize));
	}
	init();
	return drawable;
}

function Images(_parent, _x, _y, _name) {
	var parent = _parent,
		drawable = Drawable(_x, _y),
		name = _name,
		images = {},
		size, speed, rotation, image;

		init = function () {
			rotation = Math.random() - 0.5;
			speed = 0.2 + Math.random() * Settings.MAXSPEEDS[name];
			image = Content.Images[name][Math.floor(Content.Images[name].length * Math.random())];
			size = [image.width, image.height];
		}
		drawable.update = function (_dt) {
			drawable.y += speed * _dt;
			if (drawable.y > 1) {
				drawable.x = Math.random();
				drawable.y = 0;
				rotation = Math.random() - 0.5;
			}
			return true;
		}
		drawable.render = function (_context) {
			var x = drawable.x * (parent.size[0] - size[0]) + size[0] / 2,
				y = drawable.y * (parent.size[1] + size[1] ) - size[1] / 2;

			_context.save();
			_context.translate(x, y);
			_context.rotate(rotation); 
			_context.drawImage(image, -(size[0] / 2), -(size[1] / 2));
			_context.restore();
		}
		init();
		return drawable;
}

Util = {	
	getColor: function () {
		var color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
		color += new Array(8 - color.length).join(0);
		return color;
	},
	getFont: function () {
		var fonts = ["Arial", "Georgia Italic", "Marlett", "Lucida Console"];
		return fonts[Math.floor(Math.random() * fonts.length)];
	},
	createFont: function (_size, _font) {
		return _size + "px " + _font;
	},
	getFontSize: function () {
		return 14 + Math.floor(Math.random() * 50);
	},
	getRandomNumber: function (_n) {
		return Math.floor(_n * Math.random());
	},
	loadImage: function (url) {
		var image = new Image();
		image.src = url
		return image;
	},
	loadAudio: function (_url) {
		return new Audio(_url);
	}
}

Settings = {
	STARTSINTAHKLAAS: true,
	NUMTEXTOBJECTS: 5,
	NUMPIETENOBJECTS: 10,
	MAXCOLORTIMEOUT: 5000,
	FPS: 40,
	MAXSPEEDS: {'sint': 0.2,
				'piet': 0.3,
				'tekst': 0.6
	}
}

Content = {
	Images: {'sint': [Util.loadImage('public/images/sint.png')],
			 'piet': [Util.loadImage('public/images/piet0.png'), Util.loadImage('public/images/piet1.png'), Util.loadImage('public/images/piet2.png'), Util.loadImage('public/images/piet3.png')]
	},
	Audio: {'backgroundMusic': Util.loadAudio('public/audio/sinterklaasliedjes.ogg')
	}
}

function initBackground () {
	var parent = document.getElementById("background"),
		canvas = document.createElement("canvas"),
		sintahklaes;

	if (parent !== null && Settings.STARTSINTAHKLAAS) {
		canvas.width = parent.clientWidth;
		canvas.height = parent.clientHeight

		new SintahKlaes(canvas);

		parent.appendChild(canvas);
	}
}

function init () {
	initBackground();
}

window.onload = init;