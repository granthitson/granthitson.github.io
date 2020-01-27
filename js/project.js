var coll = document.getElementsByClassName("title");
var canvas = document.getElementsByName("canvas");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
	var id =this.id;
	this.classList.toggle("active");
	var content = this.nextElementSibling;
	console.log(id);
	if (content.style.maxHeight){
	  content.style.maxHeight = null;
	  if (id == "8ball")
	  {
		canvas.style.background = "radial-gradient(ellipse farthest-corner at center, #1B2735 0%, #090A0F 100%)";
		clear();
	  }
	  
	} else {
	  content.style.maxHeight = content.scrollHeight + "px";
	  if (id == "8ball") {
		canvas.style.background = "radial-gradient(ellipse farthest-corner at center, #7fc9db, #3a8bad, #114f71)";
		if (isInitialized() == true)
		{
			animate();
		}
		else {
			init();
			animate();
		}
	  }
	  
	} 
  });
}

function callFunction() {
	
}