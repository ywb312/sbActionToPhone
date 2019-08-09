cc.Class({
    extends: cc.Component,
    properties: {
        ballNode:cc.Node,
        bzPicArr:cc.SpriteFrame,
        jpPicArr:cc.SpriteFrame,
        mtPicArr:cc.SpriteFrame,
        wanPicArr:cc.SpriteFrame,
        imgNode:cc.Node,
        boxPic:cc.Node,
    },
    onLoad(){
        this.changePic();
    },
    start () {
        this.timer = 0;
        this.bol = true;
        let touch = cc.find("Canvas/touch");
        // 是否按下
        this.mouseDown = 0;
        // 摇杆
        touch.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.mouseDown = 1;
        });
        touch.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.moveFun(event);
        });
        touch.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.mouseDown = 0;
        });
        this.schedule(()=>{
            this.selfPos(this);
        },0.05);
    },
    // 移动事件回调函数
    moveFun(event){
        if(!this.mouseDown) return;
        //获取鼠标距离上一次点的信息
        let delta = event.getDelta();
        //增加限定条件
        let minX = -175;
        let maxX = 175;
        let minY = -330;
        let maxY = 234;
        let moveX = this.ballNode.x + delta.x;
        let moveY = this.ballNode.y + delta.y;
        //控制移动范围
        if(moveX < minX){
            moveX = minX;
        }else if(moveX > maxX){
            moveX = maxX;
        }
        if(moveY < minY){
            moveY = minY;
        }else if(moveY > maxY){
            moveY = maxY;
        }
        //移动小车节点   
        this.ballNode.x = moveX;
        this.ballNode.y = moveY;
    },
    // 上传位置信息
    selfPos(obj){
        // x,y为大屏幕上显示的位置
        var x = Math.floor(obj.ballNode.x*1.66)+30;
        var y = Math.floor((obj.ballNode.y+48)*1.9-15);
        var ck = obj.mouseDown;
        let tool = cc.find('resident').getComponent('residentScript').tool;
        var data = {
            x,y,ck,tool
        }
        cc.find('resident').emit('setPos',data);
    },
    // 改变杯子图片
    changePic(){
        let type = cc.find('resident').getComponent('residentScript').tool;
        switch (type) {
            case "100":
                this.boxPic.setPosition(-14,-25);
                this.imgNode.getComponent(cc.Sprite).spriteFrame = this.bzPicArr;
                break;
            case "200":
                this.boxPic.setPosition(0,-30);
                this.imgNode.getComponent(cc.Sprite).spriteFrame = this.jpPicArr;
                break;
            case "300":
                this.boxPic.setPosition(0,-20);
                this.imgNode.getComponent(cc.Sprite).spriteFrame = this.mtPicArr;
                break;
            case "400":
                this.boxPic.setPosition(0,-38);
                this.imgNode.getComponent(cc.Sprite).spriteFrame = this.wanPicArr;
                break;
        }
    },
});
