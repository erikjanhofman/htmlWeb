function SintahKlaes(_canvas) {
	var self = this,
		canvas = _canvas,
		context = _canvas.getContext("2d"),
		objects = new Array(),
		music = Content.Audio['backgroundMusic'],
		cursor, lastUpdate;
	
	init = function () {
		requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.addEventListener("resize", function (e) { self.editSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight); });

		cursor = new Cursor(self);

		if (Settings.BACKGROUNDMUSIC) {
			music.volume = 0.2;
			music.loop = true;
			music.play();
		}

		for(var e = 0; e<Settings.NUMTEXTOBJECTS; e++) {
			objects.push(new FallingTekst(self, Math.random(), Math.random()));
		}
		for(var e = 0; e<Settings.NUMPIETENOBJECTS; e++) {
			objects.push(new Piet(self, Math.random(), Math.random()));
		}
		objects.push(new Sint(self, Math.random(), Math.random()));

		lastUpdate = Date.now();
		tick();
	}
	render = function () {
		var objectsLength = len = objects.length;
		len--;
		context.clearRect(0, 0, self.size[0], self.size[1]);
		while(objectsLength--) {
			objects[len - objectsLength].render(context);
		}
	}
	update = function (_dt, _now) {
		var objectsLength = objects.length;
		while(objectsLength--) {
			if(!objects[objectsLength].update(_dt, _now, cursor)) {
				objects.splice(objectsLength, 1);
			}
		}
	}
	tick = function () {
		var now = Date.now();
		update((now - lastUpdate)/1000, now);
		lastUpdate = now;
		requestFrame(render);
		window.setTimeout(tick, 1);
	}
	
	this.Messages = {
		'pietermannen': 0,
		'sintlaughing': false
		};
	this.getCanvas = function () {
		return canvas;
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
				update: function () { return false; }
			}
}

function Tekst(_parent, _x, _y, _tekst) {
	var parent = _parent,
		drawable = Drawable(_x, _y);

	drawable.tekst = _tekst
	drawable.color = Util.getColor();
	drawable.fontSize = Util.getFontSize();
	drawable.font = Util.getFont();
	drawable.update = function (_dt, _now, _cursor) {
		return true;
	}
	drawable.render = function (_context) {
		_context.fillStyle = drawable.color;
		_context.font = Util.createFont(drawable.fontSize, drawable.font);
		_context.fillText(drawable.tekst, drawable.x * (parent.size[0] - drawable.fontSize * drawable.tekst.length / 2), drawable.y * (parent.size[1] + drawable.fontSize));
	}
	return drawable;
}

function FallingTekst(_parent, _x, _y) {
	var parent = _parent,
		tekst = Tekst(parent, _x, _y,  Content.SINTAHKLAESZINNEN[Math.floor(Math.random() * Content.SINTAHKLAESZINNEN.length)]),
		speed = 0.1 + Math.random() * Settings.MAXSPEEDS['tekst'],
		nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);

	tekst.update = function (_dt, _now, _cursor) {
		var parSize = parent.size;
		
		tekst.y += speed * _dt;
		
		if(_now >= nextColorUpdate) {
			tekst.color = Util.getColor();
			nextColorUpdate = _now + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);
		}
		if(tekst.y > 1) {
			tekst.fontSize = Util.getFontSize();
			tekst.x = Math.random();
			tekst.y = 0;
		}
		return true;
	}
	return tekst;
}

function Images(_parent, _images, _x, _y, _rotation) {
	var parent = _parent,
		drawable = Drawable(_x, _y),
		currentImage = 0;

		drawable.images = _images;
		drawable.opacity = 1;
		drawable.rotation = _rotation;
		drawable.size = [_images[0].width, _images[0].height];
		drawable.scale = [1, 1];

		drawable.nextImage = function () {
			currentImage = (currentImage + 1) % drawable.images.length;
		}
		drawable.setImage = function (_n) {
			currentImage = _n % drawable.images.length;
		}
		drawable.update = function (_dt, _now, _cursor) {
			return true;
		}
		drawable.render = function (_context) {
			var x = drawable.x * (parent.size[0] - drawable.size[0]) + drawable.size[0] / 2,
				y = drawable.y * (parent.size[1] + drawable.size[1] ) - drawable.size[1] / 2;

			_context.save();
			_context.globalAlpha = drawable.opacity;
			_context.translate(x, y);
			_context.rotate(drawable.rotation); 
			_context.drawImage(drawable.images[currentImage], -(drawable.size[0] / 2), -(drawable.size[1] / 2), drawable.size[0] * drawable.scale[0], drawable.size[1] * drawable.scale[1]);
			_context.restore();
		}
		return drawable;
}

function Person (_parent, _x, _y, _images, _rotation) {
	var parent = _parent,
		image = Images(_parent, _images, _x, _y, _rotation);

	image.speed = Settings.DEFAULTSPEED;
	image.currentAnimationState = 0;
	image.nextAnimationState = 0;
	image.maxAnimationState = 0;

	image.update = function (_dt, _now, _cursor) {
		return true;
	}
	return image;
}

function Sint (_parent, _x, _y) {
	var parent = _parent,
		person = Person(_parent, _x, _y, [Content.Images['sint'][0]], 0.5 * Math.random()),
		sounds = [Content.Audio['laughter']];

	person.update = function (_dt, _now, _cursor) {
		person.y += person.speed * _dt;

		if (Util.vectorCompare([2, 2], person.scale) && parent.Messages['pietermannen'] > 0) {
			person.scale[0] += parent.Messages['pietermannen'] / 2;
			person.scale[1] += parent.Messages['pietermannen'] / 2;
		}
		parent.Messages['pietermannen'] = 0;

		if (Util.vectorCompare(person.scale, [1, 1])) {
			person.scale[0] -= 0.75 * _dt;
			person.scale[1] -= 0.75 * _dt;
		}else if (person.scale[0] < 1 && person.scale[1] < 1) {
			person.scale[0] = 1;
			person.scale[1] = 1;
		}

		if (parent.Messages['sintlaughing']) {
			if (!Util.audioIsPlaying(sounds[0])) {
				sounds[0].play();
			}
			parent.Messages['sintlaughing'] = false;
		}

		if (person.y > 1) {
			person.x = Math.random();
			person.y = 0;
			person.rotation = Math.random() - 0.5;
		}
		return true;
	}

	return person;
}

function Piet (_parent, _x, _y) {
	var parent = _parent,
		person = Person(_parent, _x, _y, [Content.Images['piet'][Math.floor(Math.random() * Content.Images['piet'].length)], Content.Images['skull'][0], Content.Images['blood'][0]], 0.5 * Math.random()),
		sounds = [Util.loadAudio('public/audio/whipcrack.ogg'), Util.loadAudio('public/audio/shotgun.ogg')],
		timeout = Date.now() + 5000 + Math.random() * 10000;

	person.speed = 0.1 + Math.random() * Settings.MAXSPEEDS['piet'];
	person.maxAnimationState = 3;

	person.update = function (_dt, _now, _cursor) {
		person.y += person.speed * _dt;

		if (!_cursor.usedOnce && _cursor.mousePosition.length > 0 && person.nextAnimationState === 0) {
			if (Util.isBetween(_cursor.mousePosition, [person.x * parent.size[0] - person.size[0] / 2 * person.scale[0], person.y * parent.size[1] - person.size[1] / 2 * person.scale[1]], Util.multiplyVector(person.size, person.scale))) {
				parent.Messages['pietermannen']++;
				_cursor.usedOnce = true;
				sounds[1].play();
				person.nextAnimationState = 3;
				timeout = _now;
			}
		}

		if (person.currentAnimationState === 1) {
			if (person.rotation >= 0) {
				person.rotation += 1 * _dt;
			}else{
				person.rotation -= 1 * _dt;
			}
			person.opacity -= 2 * _dt;
		}else if(person.currentAnimationState === 3) {
			person.scale[0] += 1 * _dt;
			person.scale[1] += 1 * _dt;
		}

		if (Settings.WHIPCRACKS && _now >= timeout) {
			if(person.nextAnimationState === 0) {
				sounds[0].play();
				timeout = _now + 500;
				person.currentAnimationState = person.nextAnimationState;
				person.nextAnimationState = 1;
			}else if(person.nextAnimationState === 1) {
				parent.Messages['sintlaughing'] = true;
				person.nextImage();
				timeout = _now + 500;
				person.currentAnimationState = person.nextAnimationState;
				person.nextAnimationState = 2;
			}else if(person.nextAnimationState === 2) {
				person.opacity = 1;
				person.scale = [1, 1];
				person.speed = Math.abs(person.speed);
				person.x = Math.random();
				person.y = 0;
				person.setImage(0);
				timeout = _now + 5000 + Math.random() * 10000 + 500;
				person.currentAnimationState = person.nextAnimationState;
				person.nextAnimationState = 0;
			}else if(person.nextAnimationState === 3) {
				person.speed = -person.speed;
				person.setImage(2);
				timeout = _now + 500;
				person.currentAnimationState = person.nextAnimationState;
				person.nextAnimationState = 2;
			}
		}

		if (person.y > 1) {
			person.x = Math.random();
			person.y = 0;
			person.rotation = Math.random() - 0.5;
		}
		return true;
	}
	return person;
}

function Cursor (_parent) {
	var self = this,
		parent = _parent,
		offsets = [parent.getCanvas().offsetLeft, parent.getCanvas().offsetTop],
		singleClick = true;

	init = function () {
		if (Settings.WHIPCRACKS && Settings.USEDAMOUSE) {
			document.addEventListener("mousedown", onDown, false);
			document.addEventListener("mouseup", onRelease, false);
		}
	}

	onDown = function (_event) {
		self.mousePosition = [_event.clientX - offsets[0], _event.clientY - offsets[1]];
	}

	onRelease = function (_event) {
		self.mousePosition = [];
		self.usedOnce = false;
		singleClick = true;
	}

	this.usedOnce = false
	this.mousePosition = [];

	this.isSingleMouseClick = function () {
		singleClick = false;
		return !singleClick;
	}
	init();
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
	},
	isBetween: function (_point, _position, _size) {
		return _point[0] > _position[0] && _point[0] < (_position[0] + _size[0]) && _point[1] > _position[1] && _point[1] < (_position[1] + _size[1]);
	},
	multiplyVector: function (a, b) {
		return [a[0] * b[0], a[1] * b[1]];
	},
	vectorCompare: function (_vx, _vy) {
		return _vx[0] > _vy[0] && _vx[1] > _vy[1];
	},
	audioIsPlaying: function (_audio) {
		return !_audio.paused && !_audio.ended && _audio.currentTime > 0;
	}
}

Settings = {
	BACKGROUNDMUSIC: true,
	WHIPCRACKS: true,
	STARTSINTAHKLAAS: true,
	USEDAMOUSE: false, //doe maar niet muis spulz gebruiken
	NUMTEXTOBJECTS: 5,
	NUMPIETENOBJECTS: 10,
	MAXCOLORTIMEOUT: 5000,
	FPS: 40,
	DEFAULTSPEED: 0.3,
	MAXSPEEDS: {'piet': 0.3,
				'tekst': 0.6
	}
}

Content = {
	SINTAHKLAESZINNEN: ["Sintahklaes is baes", "Waes ist Sintahklaes", "Sintahklaes omdat ie het waerd is", "Winter is coming"],
	Images: {'sint': [Util.loadImage('public/images/sint.png')],
			 'piet': [Util.loadImage('public/images/piet0.png'), Util.loadImage('public/images/piet1.png'), Util.loadImage('public/images/piet2.png'), Util.loadImage('public/images/piet3.png')],
			 'skull': [Util.loadImage('public/images/skull.png')],
			 'blood': [Util.loadImage('public/images/blood.png')]
	},
	Audio: {'backgroundMusic': Util.loadAudio('public/audio/sinterklaasliedjes.ogg'),
			'whipcrack': Util.loadAudio('public/audio/whipcrack.ogg'),
			'shotgun': Util.loadAudio('public/audio/shotgun.ogg'),
			'laughter': Util.loadAudio('public/audio/laughter.ogg')
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

initRequsts.push(initBackground);
