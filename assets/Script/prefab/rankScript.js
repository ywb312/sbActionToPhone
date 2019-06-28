cc.Class({
    extends: cc.Component,
    properties: {
        headNode:cc.Node,
        nameNode:cc.Node,
        scoreNode:cc.Node,
        bestNode:cc.Node,
    },
    createRank(obj){
        let ht = this;
        cc.loader.load({url:obj.head,type:'jpg'},function(err,ttt){
            var headFra = new cc.SpriteFrame;
            headFra.setTexture(ttt);
            ht.headNode.getComponent(cc.Sprite).spriteFrame = headFra;
        });
        if (obj.self == 1) {
            var bol = true;
            this.schedule(()=>{
                if (bol) {
                    this.nameNode.color = new cc.color(255,255,255,255);
                    this.scoreNode.color = new cc.color(255,255,255,255);
                } else {
                    this.nameNode.color = new cc.color(0,0,0,255);
                    this.scoreNode.color = new cc.color(0,0,0,255);
                }
                bol = !bol;
            },0.5);
        }
        if (obj.rank == 1) {
            this.bestNode.active = true;
        }
        this.nameNode.getComponent(cc.Label).string = obj.name;
        this.scoreNode.getComponent(cc.Label).string = obj.score + '元';
    },
});
