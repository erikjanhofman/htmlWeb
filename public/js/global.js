function SintahKlaes(_canvas, _number) {
	var self = this,
		canvas = _canvas,
		context = _canvas.getContext("2d"),
		objects = new Array();
	
	init = function (_number) {
		requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		for(var e = 0; e<_number; e++) {
			objects.push(new Tekst(canvas.width, canvas.height));
		}
		tick();
	}
	render = function () {
		var objectsLength = objects.length;
		while(objectsLength--) {
			objects[objectsLength].render(context);
		}
	}
	update = function (dt) {
		var objectsLength = objects.length;
		while(objectsLength--) {
			if(!objects[objectsLength].update(dt)) {
				objects.splice(objectsLength, 1);
			}
		}
	}
	tick = function () {
		update(1);
		render();
		requestFrame(tick);
	}
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

function Tekst(_width, _height) {
	var drawable = Drawable(_width*Math.random(), _height*Math.random()),
		tekst = "sintahklaes is baas",
		color = Util.getColor(),
		font = Util.getFont();
		
	getColor = function () {
		var colors = ["blue", "yellow", "red"];
		return colors[Math.floor(Math.random * colors.length)];
	}
	getFont = function () {
		return Math.floor(Math.random * 100) + "px Arial";
	}
		
	drawable.update = function (dt) {
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
		var colors = ["blue", "yellow", "red"];
		return colors[Math.floor(Math.random() * colors.length)];
	},
	getFont: function () {
		return Math.floor(Math.random() * 50) + "px Arial";
	} 
}

function init() {
	var parent = document.getElementById("content"),
		canvas = document.createElement("canvas"),
		sintahklaes;
	//canvas.style.width = "100%";
	//canvas.style.height = "100%";
	canvas.width = parent.clientWidth;
	canvas.height = parent.clientHeight
	sintahklaes = new SintahKlaes(canvas, 20);
	//canvas.onResize = sintahklaes.render;
	parent.appendChild(canvas);
}

//document.onload = init;