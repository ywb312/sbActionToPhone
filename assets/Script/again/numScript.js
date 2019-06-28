cc.Class({
    extends: cc.Component,
    properties: {
        topNumArr:{
            default:[],
            type:[cc.SpriteFrame],
        },
        bottomNumArr:{
            default:[],
            type:[cc.SpriteFrame],
        },
        bottomNumArr2:{
            default:[],
            type:[cc.SpriteFrame],
        }
    },
    setTopNum(num){
        var ten = parseInt((num%100)/10);
        var one = parseInt(num%10);
        if (ten == 0) {
            cc.find('Canvas/topNum/one').x = 64;
            cc.find('Canvas/topNum/one').getComponent(cc.Sprite).spriteFrame = this.topNumArr[one];
        }else{
            cc.find('Canvas/topNum/ten').active = true;
            cc.find('Canvas/topNum/ten').getComponent(cc.Sprite).spriteFrame = this.topNumArr[ten];
            cc.find('Canvas/topNum/one').getComponent(cc.Sprite).spriteFrame = this.topNumArr[one];
            cc.find('Canvas/topNum/ten').runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.6,1.3),cc.scaleTo(0.4,1)
            )));
        }
        cc.find('Canvas/topNum/one').runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.6,1.3),cc.scaleTo(0.4,1)
        )));
    },
    setBottomNum(num){
        var thousand = parseInt(num/1000);
        var hundred = parseInt(num/100)%10;
        var ten = parseInt((num%100)/10);
        var one = parseInt(num%10);
        var bol = true;
        if (thousand == 0) {
            cc.find('Canvas/bottomNum/thousand').active = false;
        }
        if (thousand == 0 && hundred == 0) {
            cc.find('Canvas/bottomNum/hundred').active = false;
        }
        this.schedule(()=>{
            if (bol) {
                cc.find('Canvas/bottomNum/thousand').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr[thousand];
                cc.find('Canvas/bottomNum/hundred').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr[hundred];
                cc.find('Canvas/bottomNum/ten').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr[ten];
                cc.find('Canvas/bottomNum/one').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr[one];
            } else {
                cc.find('Canvas/bottomNum/thousand').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr2[thousand];
                cc.find('Canvas/bottomNum/hundred').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr2[hundred];
                cc.find('Canvas/bottomNum/ten').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr2[ten];
                cc.find('Canvas/bottomNum/one').getComponent(cc.Sprite).spriteFrame = this.bottomNumArr2[one];
            }
            bol = !bol;
        },0.25);
    },
});
