cc.Class({
    extends: cc.Component,
    properties: {
    },
    start () {
        this.node.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.6,1.05),cc.scaleTo(0.4,1)
        )));
    },
});
