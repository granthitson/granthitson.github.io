var coll = document.getElementsByClassName("title");
var canvas = document.getElementsByName("canvas");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
	this.classList.toggle("active");
	var content = this.nextElementSibling;
	if (content.style.maxHeight){
	  content.style.maxHeight = null;
	  canvas.style.background = "radial-gradient(ellipse farthest-corner at center, #1B2735 0%, #090A0F 100%)"
	  clear();
	  console.log(1);
	} else {
	  content.style.maxHeight = content.scrollHeight + "px";
	  canvas.style.background = "radial-gradient(ellipse farthest-corner at center, #7fc9db, #3a8bad, #114f71)"
	  animate();  
	  console.log(2);
	} 
  });
}

var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();

var colorArray = [	
	'#c9af4e','#c9af4e',
	'#1f3483','#1f3483',
	'#a40f0f','#a40f0f',
	'#4f0f57','#4f0f57',
	'#cd530a','#cd530a',
	'#1b5118',	'#1b5118',	
	'#440902','#440902',
	'#1e150b',
];

var numberArray = [
	'1','9',
	'2','10',
	'3','11',
	'4','12',
	'5','13',
	'6','14',
	'7','15',
	'8',
];

window.addEventListener('resize',function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

function Circle(x,y,dx,dy,radius,color,number,collision) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;
	this.rgb = color;
	this.number = number;
	this.collision = collision;
	
	this.draw = function() {
		
		var grd = c.createRadialGradient(this.x, this.y, 20, this.x, this.y, 3);
		grd.addColorStop(0, this.rgb);
		grd.addColorStop(1, "white");
		
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
		c.fillStyle = grd;
		c.fill();
		
		c.beginPath();
		c.arc(this.x,this.y,this.radius-12,0,Math.PI * 2, false);
		c.fillStyle = 'white';
		c.fill();
		
		c.beginPath();
		c.textBaseline = "middle";
		c.textAlign = "center";
		c.fillStyle = 'black';
		c.font = "Bold 16px Arial";
		c.fillText(this.number, this.x, this.y); 
	}
	
	this.update = function() {
		if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}
		
		if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
			this.dy = -this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;
		
		this.draw();
		/*this.addSpeed();*/
	}

	this.colliding = function(circle) {
		dx = circle.x-this.x;
		dy = circle.y-this.y;
		sumR = this.radius + circle.radius;
		sqrR = sumR * sumR +2;
		
		distance = (dx * dx) + (dy * dy);
		
		if (distance <= sqrR) {
			return true;
		}
		return false;
		}
		
	this.resolveCollision = function(circle) {
		/*circle.dx = -(circle.dx * .6);
		circle.dy = -(circle.dy * .6);	
		this.dx = -(this.dx * .6);
		this.dy = -(this.dy * .6);	*/
		
		circle.dx = -circle.dx;
		circle.dy = -circle.dy;	
		this.dx = -this.dx;
		this.dy = -this.dy;	
	}
	
	this.addSpeed = function() {
		if (this.dx < 0) {
			this.dx -= .0002
		} else {
			this.dx += .0001
		}
		
		if (this.dy < 0) {
			this.dy -= .0001
		} else {
			this.dy += .0002
		}
	}
	
	this.checkCollision = function() {
		if (this.collision == true) {
			return true;
		}
		return false;
	}
}

function holes() {
	holeArray = [
		[8,8],
		[innerWidth/2,0],
		[innerWidth-8,8],
		[8,innerHeight-8],
		[innerWidth/2,innerHeight],
		[innerWidth-8,innerHeight-8]
	];
	
	for (var i = 0; i < holeArray.length; i++) {
		c.beginPath();
		c.arc(holeArray[i][0],holeArray[i][1],40,0,Math.PI * 2, false);
		c.fillStyle = "#000000";
		c.fill();
	}
}

var circleArray = [];

function init() {
	circleArray = [];
	for (var i =0; i < 15; i++) {
		var radius = 24
		var x = Math.random() * (innerWidth - radius*2) + radius;
		var y = Math.random() * (innerHeight - radius*2) + radius;
		var dx = (Math.random() - 0.5) * 4;
		var dy = (Math.random() - 0.5) * 4;
		var color = colorArray[i];
		var number = numberArray[i];
		circleArray.push(new Circle(x,y,dx,dy,radius,color,number,false));
	}
}

var checkCol = false;

function animate() {
	requestId = requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);
	
	holes();
	
	for (var i = 0; i < circleArray.length; i++) {
		circleArray[i].update();
		checkCol = circleArray[i].checkCollision();
	}	
	if (checkCol == true) {
		for (var i = 0; i < circleArray.length; i++) {
			for (var j = i+1; j < circleArray.length; j++) {
				if (circleArray[i].colliding(circleArray[j])) {
					circleArray[i].resolveCollision(circleArray[j]);
				}
			}
		}
	}
}

function clear() {
	c.clearRect(0,0,innerWidth,innerHeight);
	cancelAnimationFrame(requestId);
}
