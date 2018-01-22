function Chicken(){
	base(this,LSprite,[]);
	var self = this;
	var bitmap = new LBitmap(new LBitmapData(imglist["chicken1"]));
	self.addChild(bitmap);
}