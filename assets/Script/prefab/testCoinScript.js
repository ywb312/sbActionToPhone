cc.Class({
    extends: cc.Component,
    properties: {
        speedY: 5,
        addY : 2.5,
    },
    // start () {
    //     var setX = Math.random()*3-1.5;
    //     this.schedule(function(){
    //         this.speedY-=this.addY;
    //     },0.3);
    //     this.schedule(function(){
    //         this.node.x -=setX;
    //         this.node.y +=this.speedY;
    //         if (this.node.y<-600) {
    //             this.node.destroy();
    //         }
    //     },0.03);
    // },
    start () {
        var setX = Math.random()*7-3;
        var setY = Math.random()*3+4;
        this.schedule(function(){
            this.node.x-=setX;
            this.node.y-=setY;
            if (this.node.y<-600) {
                this.node.destroy();
            }
        },0.03);
    },
});
