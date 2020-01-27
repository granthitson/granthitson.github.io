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
	
	init();
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
	this.distance = 0;
	
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
		this.x += this.dx;
		this.y += this.dy;
		
		if (this.x - this.radius < 0) {
			bounceBall(this, Math.PI);
			this.x = this.radius;
		} else if (this.x + this.radius > innerWidth) {
			bounceBall(this, 0);
			this.x = innerWidth - this.radius;
		}
		
		if (this.y - this.radius < 0) {
			bounceBall(this, Math.PI /2 );
			this.y = this.radius;
		} else if (this.y + this.radius > innerHeight) {
			bounceBall(this, -Math.PI / 2);
			this.y = innerHeight - this.radius;
		}
		
		this.resolveCollisions();
		
		this.draw();
	}
	
	this.resolveCollisions = function() {
		for (var i = 0; i < circleArray.length; i ++) {
			for (var j = i + 1; j < circleArray.length; j++)
			{
				checkCol = circleArray[i].colliding(circleArray[j]);
			}
		}
	}

	this.colliding = function(circle) {
		dx = circle.x-this.x;
		dy = circle.y-this.y;
		
		var normalVector = (dx, dy);
		
		dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		
		sumR = this.radius + circle.radius;
		let intersection = this.radius + circle.radius - ballToBallDistance(this, circle);

		if (dist < sumR) {
			this.distance = dist;
			
			let angle = ballToBallAngle(this, circle);
			let normal = calcNormalFromAngle(angle);
			
			bounceBall(this, angle);
			bounceBall(circle, angle + Math.PI);
			
			this.x -= normal[0] * intersection / 2;
			this.y -= normal[1] * intersection / 2;

			circle.x += normal[0] * intersection / 2;
			circle.y += normal[1] * intersection / 2;
		}
	}
	
	function bounceBall(ball, angle) {
		let normal = calcNormalFromAngle(angle);
		let velocity = [ball.dx, ball.dy];

		let ul = dotproduct(velocity, normal) / dotproduct(normal, normal);
		let u = [
			normal[0] * ul,
			normal[1] * ul
		];

		let w = [
			velocity[0] - u[0],
			velocity[1] - u[1]
		];

		let new_velocity = [
			w[0] - u[0],
			w[1] - u[1]
		];

		ball.dx = parseFloat(new_velocity[0], 10);
		ball.dy = parseFloat(new_velocity[1], 10);
	}

	function dotproduct(a, b) {
		return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
	}

	function ballToBallDistance(ball1, ball2) {
		return Math.sqrt((Math.pow(ball2.x - ball1.x, 2) + Math.pow(ball2.y - ball1.y, 2)));
	}

	function ballToBallAngle(ball1, ball2) {
		return Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
	}
	
	function calcNormalFromAngle(angle) {
	return [
		Math.cos(angle),
		Math.sin(angle)
	];
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
var initialized = false;

function init() {
	circleArray = [];
	for (var i =0; i < 15; i++) {
		var radius = 24
		var x = Math.random() * (innerWidth - radius*2) + radius;
		var y = Math.random() * (innerHeight - radius*2) + radius;
		var dx = (Math.random() - 0.5) * 5;
		var dy = (Math.random() - 0.5) * 5;
		var color = colorArray[i];
		var number = numberArray[i];
		circleArray.push(new Circle(x,y,dx,dy,radius,color,number,false));
	}
	initialized = true;
}

function isInitialized() {
	return initialized;
}

var checkCol = false;
var requestId;

function animate() {
	requestId = requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);
	
	holes();
	
	for (var i = 0; i < circleArray.length; i++) {
		circleArray[i].update();
	}	
	
}

function clear() {
	c.clearRect(0,0,innerWidth,innerHeight);
	cancelAnimationFrame(requestId);
}
