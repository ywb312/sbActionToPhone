cc.Class({
    extends: cc.Component,
    properties: {
        slowTalk : {
            default:null,
            type : cc.AudioClip,
        },
    },
    start () {
        cc.audioEngine.play(this.slowTalk,false,1);
        var isnew = cc.find('resident').getComponent("residentScript").isnew;
        if (isnew == 0) {
            cc.find('Canvas/btn').on('touchend',()=>{
                cc.director.loadScene('final');
            });
        } else {
            cc.find('Canvas/btn').on('touchend',()=>{
                cc.director.loadScene('game');
            });
        }
    },
});
