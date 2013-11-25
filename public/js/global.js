function SintahKlaes(_canvas, _number) {
	var self = this,
		canvas = _canvas,
		context = _canvas.getContext("2d"),
		objects = new Array(),
		size = [canvas.width, canvas.height],
		nextRefresh,
		lastUpdate ;
	
	init = function (_number) {
		requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		for(var e = 0; e<_number; e++) {
			objects.push(new Tekst(self, canvas.width, canvas.height));
		}
		nextRefresh = Date.now() + 1000/Settings.FPS;
		lastUpdate = Date.now();
		tick();
	}
	render = function () {
		var objectsLength = objects.length;
		context.clearRect(0, 0, size[0], size[1]);
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
		/*update((Date.now()-prevTime)/1000);
		render();
		prevTime = Date.now();
		requestFrame(tick);*/
		var now;
		do {
			now = Date.now();
			update((now-lastUpdate)/1000);
			lastUpdate = now;
		} while (Date.now()*2-lastUpdate < nextRefresh);
		
		render();
		nextRefresh += 1000/Settings.FPS;
		lastUpdate = Date.now();
		requestFrame(tick);
	}
	
	this.editSize = function (_width, _height) {
		var objectsLength = objects.length,
			dx = _width/size[0],
			dy = _height/size[1];
			
		size[0] = _width;
		size[1] = _height;
		canvas.width = size[0];
		canvas.height = size[1];
		while(objectsLength--) {
			objects[objectsLength].editSize(dx, dy);
		}
	}
	this.getSize = function () {
		return size;
	}
	requestFrame = function () { }
	init(_number);
}

function Drawable(_x, _y) {
	return {
				x: _x,
				y: _y,
				editSize: function (_dx, _dy) {
					this.x *= _dx;
					this.y *= _dy;
				},
				render: function () { },
				update: function (dt) { return false;}
			}
}

function Tekst(_parent, _width, _height) {
	var parent = _parent,
		tekst = "sintahklaes is baas",
		color = Util.getColor(),
		fontSize = Util.getFontSize(),
		speed = 50 + Util.getRandomNumber(Settings.MAXSPEED),
		nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT),
		drawable = Drawable((_width-fontSize*(tekst.length/2))*Math.random(), _height*Math.random());
	
	drawable.update = function (dt) {
		var parSize = parent.getSize();
		
		drawable.y += speed * dt;
		
		if(Date.now() >= nextColorUpdate) {
			color = Util.getColor();
			nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);
		}
		if(drawable.y > parSize[1]) {
			fontSize = Util.getFontSize();
			drawable.x = (parSize[0] - fontSize*(tekst.length/2)) * Math.random();
			drawable.y = 0;
		}
		return true;
	}
	drawable.render = function (context) {
		context.fillStyle = color;
		context.font = Util.getFont(fontSize);
		context.fillText(tekst, drawable.x, drawable.y);
	}
	
	return drawable;
}

Util = {	
	getColor: function () {
		return '#'+Math.floor(Math.random()*0xffffff).toString(16);
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
	MAXSPEED: 100,
	FPS: 30,
	NUMOBJECTS: 45
}

window.onload = function () {
	var parent = document.getElementById("background"),
		canvas = document.createElement("canvas"),
		sintahklaes;

	canvas.width = parent.clientWidth;
	canvas.height = parent.clientHeight
	
	sintahklaes = new SintahKlaes(canvas, Settings.NUMOBJECTS);
	
	window.addEventListener("resize", function (e) { sintahklaes.editSize(parent.clientWidth, parent.clientHeight); });
	
	parent.appendChild(canvas);
}