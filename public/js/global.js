function SintahKlaes(_canvas, _number) {
	var self = this,
		canvas = _canvas,
		context = _canvas.getContext("2d"),
		objects = new Array(),
		lastUpdate;
	
	init = function (_number) {
		window.addEventListener("resize", function (e) { self.editSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight); });
		requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		for(var e = 0; e<_number; e++) {
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
		window.setTimeout(function () { requestFrame(tick); }, 1000/(Settings.FPS - Date.now() - lastUpdate));
	}
	
	this.editSize = function (_width, _height) {
		this.size[0] = _width;
		this.size[1] = _height;
		canvas.width = this.size[0];
		canvas.height = this.size[1];
	}
	this.size = [canvas.width, canvas.height];
	requestFrame = function () { }
	init(_number);
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
		color, fontSize, speed, nextColorUpdate;
	
	init = function () {
		color = Util.getColor();
		fontSize = Util.getFontSize();
		speed = 0.1 + Math.random() * Settings.MAXSPEED;
		nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);
	}
	drawable.update = function (dt) {
		var parSize = parent.size;
		
		drawable.y += speed * dt;
		
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
	drawable.render = function (context) {
		context.fillStyle = color;
		context.font = Util.getFont(fontSize);
		context.fillText(tekst, drawable.x * (parent.size[0] - fontSize * tekst.length / 2), drawable.y * (parent.size[1]));
	}
	init();
	return drawable;
}

Util = {	
	getColor: function () {
		var color = '#'+Math.floor(Math.random()*0xffffff).toString(16);
		color += new Array(8-color.length).join(0);
		return color;
	},
	getFont: function (_n) {
		return _n + "px Arial";
	},
	getFontSize: function () {
		return 14 + Math.floor(Math.random() * 50);
	},
	getRandomNumber: function (_n) {
		return Math.floor(_n * Math.random());
	}
}

Settings = {
	MAXCOLORTIMEOUT: 5000,
	MAXSPEED: 0.2,
	FPS: 40,
	NUMOBJECTS: 45
}

function initBackground () {
	var parent = document.getElementById("background"),
		canvas = document.createElement("canvas"),
		sintahklaes;

	if (parent !== null) {
		canvas.width = parent.clientWidth;
		canvas.height = parent.clientHeight

		sintahklaes = new SintahKlaes(canvas, Settings.NUMOBJECTS);

		parent.appendChild(canvas);
	}
}

function init () {
	initBackground();
}

window.onload = init;