function SintahKlaes(_canvas, _number) {
	var self = this,
		canvas = _canvas,
		context = _canvas.getContext("2d"),
		objects = new Array(),
		size = [canvas.width, canvas.height],
		prevTime;
	
	init = function (_number) {
		requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		for(var e = 0; e<_number; e++) {
			objects.push(new Tekst(self, canvas.width, canvas.height));
		}
		prevTime = Date.now();
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
		update((Date.now()-prevTime)/1000);
		render();
		prevTime = Date.now();
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
		drawable = Drawable(_width*Math.random(), _height*Math.random()),
		tekst = "sintahklaes is baas",
		color = Util.getColor(),
		font = Util.getFont(),
		speed = 50 + Util.getRandomNumber(Settings.MAXSPEED),
		nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);
		
	drawable.update = function (dt) {
		var parSize = parent.getSize();
		
		drawable.y += speed * dt;
		
		if(Date.now() >= nextColorUpdate) {
			color = Util.getColor();
			nextColorUpdate = Date.now() + Util.getRandomNumber(Settings.MAXCOLORTIMEOUT);
		}
		if(drawable.y > parSize[1]) {
			drawable.x = parSize[0]*Math.random();
			drawable.y = 0;
			font = Util.getFont();
		}
		return true;
	}
	drawable.render = function (context) {
		context.fillStyle = color;
		context.font = font;
		context.fillText(tekst, drawable.x, drawable.y);
	}
	
	return drawable;
}

Util = {	
	getColor: function () {
		return '#'+Math.floor(Math.random()*0xffffff).toString(16);
	},
	getFont: function () {
		return Math.floor(Math.random() * 50) + "px Arial";
	},
	getRandomNumber: function (_n) {
		return Math.floor(_n * Math.random());
	}
}

Settings = {
	MAXCOLORTIMEOUT: 5000,
	MAXSPEED: 100
}

window.onload = function () {
	var parent = document.getElementById("content"),
		canvas = document.createElement("canvas"),
		sintahklaes;

	canvas.width = parent.clientWidth;
	canvas.height = parent.clientHeight
	
	sintahklaes = new SintahKlaes(canvas, 50);
	
	window.addEventListener("resize", function (e) { sintahklaes.editSize(parent.clientWidth, parent.clientHeight); });
	
	parent.appendChild(canvas);
}