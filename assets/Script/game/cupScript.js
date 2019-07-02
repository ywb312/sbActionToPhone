cc.Class({
    extends: cc.Component,
    properties: {
        ballNode:cc.Node,
        cupPicArr:{
            default:[],
            type: [cc.SpriteFrame],
        },
        penPicArr:{
            default:[],
            type: [cc.SpriteFrame],
        },
        gangPicArr:{
            default:[],
            type: [cc.SpriteFrame],
        },
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
    // 绑定事件
    // onMove(){
    //     let ht = this;
    //     let touch = cc.find("Canvas/touch");
    //     touch.on(cc.Node.EventType.TOUCH_MOVE,function(event){
    //         ht.moveFun(event);
    //     });
    // },
    // // 删除点击事件
    // offMove(){
    //     let touch = cc.find("Canvas/touch");
    //     touch.off('touchmove');
    // },
    // 移动事件回调函数
    moveFun(event){
        // let delta = event.getDelta();
        // this.ballNode.x = event.getLocationX()-240;
        // this.ballNode.y = event.getLocationY()-426.5;
        // //增加限定条件
        // let minX = -180;
        // let maxX = 180;
        // let minY = -350;
        // let maxY = 330;
        // let moveX = this.ballNode.x + delta.x;
        // let moveY = this.ballNode.y + delta.y;
        // //控制移动范围
        // if(moveX < minX){
        //     moveX = minX;
        // }else if(moveX > maxX){
        //     moveX = maxX;
        // }
        // if(moveY < minY){
        //     moveY = minY;
        // }else if(moveY > maxY){
        //     moveY = maxY;
        // }
        // this.ballNode.x = moveX;
        // this.ballNode.y = moveY;
        if(!this.mouseDown) return;
        //获取鼠标距离上一次点的信息
        let delta = event.getDelta();
        //增加限定条件
        let minX = -180;
        let maxX = 180;
        let minY = -350;
        let maxY = 340;
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
        var x = Math.floor(obj.ballNode.x*1.75);
        var y = Math.floor((obj.ballNode.y-5)*1.41-157.5);
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
        let num = cc.find('resident').getComponent('residentScript').color-1;
        switch (type) {
            case 0:
                this.ballNode.getComponent(cc.Sprite).spriteFrame = this.cupPicArr[num];
                this.ballNode.x = 0;
                this.ballNode.y = 0;
                break;
            case "200":
                this.ballNode.getComponent(cc.Sprite).spriteFrame = this.gangPicArr[num];
                this.ballNode.x = 0;
                this.ballNode.y = -10;
                break;
            case "300":
                this.ballNode.getComponent(cc.Sprite).spriteFrame = this.penPicArr[num];
                this.ballNode.x = 0;
                this.ballNode.y = -20;
                break;
            default:
                break;
        }
    },
    // move () {
    //     //获取小车节点
    //     let { cupNode } = this;
    //     let touch = cc.find("Canvas/touch");
    //     //添加变量判断用户当前鼠标是不是处于按下状态
    //     this.mouseDown = 0;
    //     //当用户点击的时候记录鼠标点击状态
    //     touch.on(cc.Node.EventType.TOUCH_START, (event)=>{
    //         if (!cc.find('Canvas/control').getComponent('gameScript').clickAble) return;
    //         cc.find('Canvas/background/text1').active = false;
    //         cc.find('Canvas/background/text2').active = true;
    //         if (this.bol) {
    //             cc.find('Canvas/control').getComponent('gameScript').gameing();
    //             this.bol = false;
    //         }
    //         this.mouseDown = 1;
    //     });
    //     //只有当用户鼠标按下才能拖拽
    //     touch.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
    //         if(!this.mouseDown) return;
    //         //获取鼠标距离上一次点的信息
    //         let delta = event.getDelta();
    //         //增加限定条件
    //         let minX = -235 + cupNode.width / 2;
    //         let maxX = 235 - cupNode.width / 2;
    //         let minY = -375;
    //         let maxY = 150;
    //         let moveX = cupNode.x + (delta.x)*0.9;
    //         let moveY = cupNode.y + (delta.y)*0.9;
    //         //控制移动范围
    //         if(moveX < minX){
    //             moveX = minX;
    //         }else if(moveX > maxX){
    //             moveX = maxX;
    //         }
    //         if(moveY < minY){
    //             moveY = minY;
    //         }else if(moveY > maxY){
    //             moveY = maxY;
    //         }
    //         //移动小车节点
    //         cupNode.x = moveX;
    //         cupNode.y = moveY;
    //         this.selfPos(moveX,moveY);
    //         this.cupPic.scale = 1.3;
    //     });
    //     //当鼠标抬起的时候恢复状态
    //     touch.on(cc.Node.EventType.TOUCH_END, (event)=>{
    //         this.mouseDown = 0;
    //         this.cupPic.scale = 1;
    //     });
    // },
});
