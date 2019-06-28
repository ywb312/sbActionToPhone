cc.Class({
    extends: cc.Component,
    properties: {
    },
    // 控制下落 
    start () {
        var setX = Math.random()*7-3;
        var setY = Math.random()*4+4;
        this.schedule(function(){
            this.node.x-=setX;
            this.node.y-=setY;
            if (this.node.y<-600) {
                this.node.destroy();
            }
        },0.03);
    },
});