cc.Class({
    extends: cc.Component,
    properties: {
        font0:cc.SpriteFrame,
        font200:cc.SpriteFrame,
        font300:cc.SpriteFrame
    },
    start () {
        let type = cc.find('resident').getComponent('residentScript').tool;
        switch (type) {
            case 0:
                this.node.getComponent(cc.Sprite).spriteFrame = this.font0;
                break;
            case "200":
                this.node.getComponent(cc.Sprite).spriteFrame = this.font200;
                break;
            case "300":
                this.node.getComponent(cc.Sprite).spriteFrame = this.font300;
                break;
            default:
                break;
        }
    },
});
