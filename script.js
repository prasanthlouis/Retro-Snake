
var gBoard;
var snake;
var dir = 'left';
var gExecutor;
var gSpeed;
var gFWidth = 20;
var gFHeight = 20;
var sw = 8;
var sh = 8;
var food;
$(document).ready(function() {
    $('body').keydown(keyPress);
});

function move() {
	gf();
	snake.move(dir);
	if(snake.takespos(food.xPos,food.yPos))
		eatFood();
	ds();
};

function keyPress(e) {
	var c = e.keyCode;
	
	switch(c) {
		case 37:
		    dir = 'left';
			break;
		case 38:
			dir = 'up';
			break;
		case 39:
			dir = 'right';
			break;
		case 40:
			dir = 'down';
			break;
		case 13:
			startG();
			break;
	}
 }

function startG() {
	gBoard = new GBoard();
	gSpeed=100;
	gBoard.clearGInfo();
	snake = new Snake(80,80);
snake.onCrash(handler,{xPos:200,yPos:200});
	ds();
	gExecutor = setInterval(move,gSpeed);
};
function endG() {
	if(gExecutor)
		clearInterval(gExecutor);
	
	gBoard.clearBoard();
};

function ds() {
	
	gBoard.removeSnakeBody();
	var snakeBody = snake.getBody();
	
	for(var i=0; i<snakeBody.length; i++){
		gBoard.drawElement('bodypart',snakeBody[i].xPos,snakeBody[i].yPos);
	}
};

function gf() {
	if(gBoard.foodempty()){
		do{
			xpos = Math.floor(Math.random() * gFWidth) * sw;
			ypos = Math.floor(Math.random() * gFHeight)* sh;
		}
		 while(snake.takespos(xpos,ypos));
		food = {xPos:xpos,yPos:ypos};
		gBoard.drawElement('food',xpos,ypos);
	}
};

function eatFood() {
	snake.eatFood();
	gBoard.removeSnakeFood();
	gBoard.updateScore();
	
	eatenItemsCount++;

	

};

function handler() {
	endG();
	gBoard.losermsg();
};

function BodyPart(xpos,ypos,direction) {
	this.xPos=xpos;
	this.yPos=ypos;
	this.direction=direction;;
};

function Snake(startX,startY) {
	var moveStep = 8;
	var bodyParts = [new BodyPart(startX,startY,'right')];

	var gRegion;
	var onCrashCallback;
	var self = this;
	
	this.eatFood = function() {
		bodyParts.push(getNewTail());
	};
	
	this.move = function(newDirection) {
	
			
		var newHead = getNewHead(newDirection);
		
		if(crash(newHead))
			onCrashCallback();
		else{		
			for(var i = bodyParts.length-1; i>0 ;i--){
				bodyParts[i] = bodyParts[i-1];
			}
			bodyParts[0] = newHead;
		}
	};
	
	this.getBody = function() {
		return bodyParts;
	};
	
	this.takespos = function(xpos,ypos) {
		for(var i = 0; i< bodyParts.length; i++){
			if(bodyParts[i].xPos == xpos && bodyParts[i].yPos == ypos)
				return true;
		}
		return false;
	};
	
	this.onCrash = function(crashCallback,fieldSize) {
		gRegion = fieldSize;
		onCrashCallback = crashCallback;
	};
	
	var getNewHead = function(direction){
		var currentHead = bodyParts[0];
		
		switch(direction){
			case 'right':
				return new BodyPart(currentHead.xPos+moveStep,currentHead.yPos,direction);
			case 'left':
				return new BodyPart(currentHead.xPos-moveStep,currentHead.yPos,direction);
			case 'up':
				return new BodyPart(currentHead.xPos,currentHead.yPos-moveStep,direction);
			case 'down':
				return new BodyPart(currentHead.xPos,currentHead.yPos+moveStep,direction);
		};
	};
	
	var getNewTail = function(){
		var currentTail = bodyParts[bodyParts.length-1];
		var tailDirection = currentTail.direction;
		
		switch(tailDirection){
			case 'right':
				return new BodyPart(currentTail.xPos-moveStep,currentTail.yPos,tailDirection);
			case 'left':
				return new BodyPart(currentTail.xPos+moveStep,currentTail.yPos,tailDirection);
			case 'up':
				return new BodyPart(currentTail.xPos,currentTail.yPos+moveStep,tailDirection);
			case 'down':
				return new BodyPart(currentTail.xPos,currentTail.yPos-moveStep,tailDirection);
		};
	};
	
	
	var crash = function(head){
		if(head.xPos >= gRegion.xPos || head.yPos >= gRegion.yPos || head.xPos < 0 || head.yPos < 0 || self.takespos(head.xPos,head.yPos))
			return true;
		
		return false;
	};
	
 	var isReverseDirection = function(newDirection) {
		var currentHeadDirection = bodyParts[0].direction;
		return newDirection == reverseDirections[currentHeadDirection];
	};
	
	
};

function GBoard() {
	this.losermsg = function(){
		$('#lMsg').css('visibility','visible');
	};
		this.updateScore = function() {
		var cs = Number($('#score').html());
		cs+=1;
		$('#score').html(cs);
	};
		this.foodempty = function() {
		return $('.food').length == 0 ;
	};
	
	this.drawElement = function (classname, xpos,ypos) {
		var element = $('<div>').addClass(classname);
		element.css('top',ypos+'px').css('left',xpos+'px');
		$('#gField').append(element);
	};
	
	this.clearBoard = function(){
		$('div.bodypart').remove();
		$('.food').remove();
	};
	
	this.clearGInfo = function() {
		$('#score').html('0');
		$('#loseMsg').css('visibility','hidden');
	};

	this.removeSnakeBody = function() {
		$('.bodypart').remove();
	};
	
	this.removeSnakeFood = function() {
		$('.food').remove();
	};	
}

