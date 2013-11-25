function SintahKlaes(_canvas, _number) {
	var context = _canvas.getContext("2d"),
		objects = new Array();
	
	init = function (_number) {
		for(var e = 0; e<_number; e++) {
			objects.push(new Tekst());
		}
	}
	this.render = function () {
		var objectLength = objects.length;
		while(objectLength--) {
			
		}
	}
	init(_number);
}

function Drawable(_x, _y) {
	return {
				x: _x,
				y: _y,
				render: function () { },
				update: function () { }
			}
}

function Tekst(_width, _height) {
	var drawable = Drawable(_width/2, _height/2);
	
	drawable.tekst = "sintahklaes is baas";
	
	drawable.update = function () {
	}
	
	drawable.render = function () {
	
	}
	
	return drawable;
}

function init() {
	var canvas = document.createElement("canvas"),
		sintahklaes;
	canvas.style.width = "100%";
	document.style.height = "100%";
	sintahklaes = new SintahKlaes(canvas);
	canvas.onResize = sintahklaes.render;
	document.getElementById("content").appendChild(canvas);
}

document.onload = init;