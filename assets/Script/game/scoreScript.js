cc.Class({
    extends: cc.Component,
    properties: {
        numArr:{
            default:[],
            type:[cc.SpriteFrame],
        },
    },
    scoreShow(num){
        var thousand = parseInt(num/1000);
        var hundred = parseInt(num/100)%10;
        var ten = parseInt((num%100)/10);
        var one = parseInt(num%10);
        var bol = true;
        if (thousand != 0) {
            cc.find('Canvas/top/right/mid/thousand').active = true;
        }
        if (hundred != 0) {
            cc.find('Canvas/top/right/mid/hundred').active = true;
        }
        if (ten!=0) {
            cc.find('Canvas/top/right/mid/ten').active = true;
        }
        cc.find('Canvas/top/right/mid/thousand').getComponent(cc.Sprite).spriteFrame = this.numArr[thousand];
        cc.find('Canvas/top/right/mid/hundred').getComponent(cc.Sprite).spriteFrame = this.numArr[hundred];
        cc.find('Canvas/top/right/mid/ten').getComponent(cc.Sprite).spriteFrame = this.numArr[ten];
        cc.find('Canvas/top/right/mid/one').getComponent(cc.Sprite).spriteFrame = this.numArr[one];
    },
});
