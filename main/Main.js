var loadingLayer;
var backgroundLayer,backLayer;
var wallLayer_left,wallLayer_right,wallLayer_top,wallLayer_buttom;
var chicken,centerlayer;
var bitmap,slingshotJoin;
var imglist = {};
var imgData = new Array(
		{type:"js",path:"./main/Chicken.js"},
		{type:"js",path:"./main/Stage.js"},
		{name:"back",path:"./images/back.png"},
		{name:"chicken1",path:"./images/chicken1.png"}
		);
var startX,startY;
function main(){
	if(LGlobal.canTouch){
		LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
		LSystem.screen(LStage.FULL_SCREEN);
	}
	LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN,true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_UP,true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE,true);
	//LGlobal.setDebug(true);
	backgroundLayer = new LSprite();	
	addChild(backgroundLayer);	
	backLayer = new LSprite();	
	addChild(backLayer);	
	
	loadingLayer = new LoadingSample3();
	backLayer.addChild(loadingLayer);	
	LLoadManage.load(
		imgData,
		function(progress){
			loadingLayer.setProgress(progress);
		},
		function(result){
			imglist = result;
			backLayer.removeChild(loadingLayer);
			loadingLayer = null;
			gameInit();
		}
	);
}
function gameInit(event){
	LGlobal.box2d = new LBox2d();
	var back = new LBitmap(new LBitmapData(imglist["back"]));
	back.scaleX = LGlobal.width/back.getWidth();
	back.scaleY = LGlobal.height/back.getHeight();
	backgroundLayer.addChild(back);
	
	var ttlRows = LGlobal.width / 50;
	for(var i=0;i<ttlRows;i++){
		backLayer.graphics.drawLine(1, "#eee", [50*i+1, 0, 50*i+1, LGlobal.height]);
	}
	var ttlColumns = LGlobal.height/50;
	for(var j=0;j<ttlColumns;j++){
		backLayer.graphics.drawLine(1, "#eee", [ 0,50*j+1, LGlobal.width, 50*j+1]);
	}
			
	chicken = new LSprite();
	chicken.name = "chicken1";
	backLayer.addChild(chicken);
	bitmap = new LBitmap(new LBitmapData(imglist["chicken1"]));
	chicken.addChild(bitmap);

	wallLayer_left = new LSprite();
	wallLayer_left.x=0;
	wallLayer_left.y=0;
	backLayer.addChild(wallLayer_left);
	wallLayer_left.addBodyPolygon(1,LGlobal.height*2,0);

	wallLayer_right= new LSprite();
	wallLayer_right.x = LGlobal.width-1;
	wallLayer_right.y=0;
	backLayer.addChild(wallLayer_right);
	wallLayer_right.addBodyPolygon(1,LGlobal.height*2,0);

	wallLayer_top= new LSprite();
	wallLayer_top.x=0;
	wallLayer_top.y=0;
	backLayer.addChild(wallLayer_top);
	wallLayer_top.addBodyPolygon(LGlobal.width*2,1,0);

	wallLayer_bottom = new LSprite();
	wallLayer_bottom.x=0;
	wallLayer_bottom.y = LGlobal.height-1;
	backLayer.addChild(wallLayer_bottom);
	wallLayer_bottom.addBodyPolygon(LGlobal.width*2,1,0);

	start()
}


function start(){
	LGlobal.box2d.setEvent(LEvent.POST_SOLVE,postSolve);
	chicken.x = 0,chicken.y = 0;
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,downStart);
	startX = chicken.x + chicken.getWidth()*0.5;
	startY = chicken.y + chicken.getHeight()*0.5;
}

function postSolve(contact, impulse){
	if(contact.GetFixtureA().GetBody().GetUserData().hit)contact.GetFixtureA().GetBody().GetUserData().hit(impulse.normalImpulses[0]);
	if(contact.GetFixtureB().GetBody().GetUserData().hit)contact.GetFixtureB().GetBody().GetUserData().hit(impulse.normalImpulses[0]);
}

function downStart(event){
	backLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,downStart);
	backLayer.addEventListener(LMouseEvent.MOUSE_MOVE,downMove);
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,downOver);
}
function downOver(event){
	backLayer.removeEventListener(LMouseEvent.MOUSE_UP,downOver);
	backLayer.removeEventListener(LMouseEvent.MOUSE_MOVE,downMove);
	
	var startX2 = chicken.x + chicken.getWidth()*0.5;
	var startY2 = chicken.y + chicken.getHeight()*0.5;
	var r = Math.sqrt(Math.pow((startX - startX2),2)+Math.pow((startY - startY2),2));
	var angle = Math.atan2(startY2 - startY,startX2 - startX);
	
	chicken.addBodyCircle(chicken.getWidth()*0.5,chicken.getHeight()*0.5,chicken.getWidth()*0.5,1,5,.4,.3);
	chicken.setBodyMouseJoint(true);
}
function downMove(event){
	//var r = Math.sqrt(Math.pow((startX - event.selfX),2)+Math.pow((startY - event.selfY),2));
	//if(r > 100)r = 100;
	//var angle = Math.atan2(event.selfY - startY,event.selfX - startX);
	//chicken.x = Math.cos(angle) * r + startX - chicken.getWidth()*0.5;
	//chicken.y = Math.sin(angle) * r + startY - chicken.getHeight()*0.5;
	chicken.x = event.selfX - chicken.getWidth()*0.5;
	chicken.y = event.selfY- chicken.getHeight()*0.5;
}

function setStage(list,x,y,rotate,m,ctrl){
	var stageLayer = new Stage(list,rotate,m,ctrl);
	stageLayer.x = x;
	stageLayer.y = y;
	backLayer.addChild(stageLayer);
	return stageLayer;
}