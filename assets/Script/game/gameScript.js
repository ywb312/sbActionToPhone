cc.Class({
    extends: cc.Component,
    properties: {
        noticeMusic : {
            default:null,
            type : cc.AudioClip,
        },
        gameOverMusic : {
            default:null,
            type : cc.AudioClip,
        },
        coinPic:cc.SpriteFrame,
    },
    onLoad() {
        this.score = 0;
    },
    start () {
        let _self = this;
        // cc.director.preloadScene('select',()=>{});
        cc.director.preloadScene('final',()=>{});
        cc.director.preloadScene('again',()=>{});
        // 设置左上角头像
        cc.loader.load({ url: cc.find('resident').getComponent('residentScript').me.avatar, type: 'jpg' }, function (err, ttt) {
            var newFra = new cc.SpriteFrame;
            newFra.setTexture(ttt);
            cc.find('Canvas/top/self/headImg').getComponent(cc.Sprite).spriteFrame = newFra;
        });
        //碰撞后改变杯子位置
        cc.find('resident').on('changePos',function(data){
            if (cc.find('Canvas/bz/ball')!=null) {
                cc.find('Canvas/bz/ball').setPosition(Math.floor((data.x-30)/1.66),Math.floor(((data.y+15)/1.9)-48));
            }
        });
        // 收到分数渲染
        cc.find('resident').on('changeScore',function(data){
            data.score = data.score*1;
            let num = (data.score - _self.score)/5;
            _self.schedule(() => {
                _self.moveTop();
            }, 0.1, num);
            _self.score = data.score;
            cc.find('Canvas/top/right/mid').getComponent('scoreScript').scoreShow(_self.score);
            cc.find('Canvas/top/right/btm').getComponent(cc.Label).string = "价值:"+ Math.floor(data.score/100) + "元";
            cc.find('Canvas/background/bottomText').getComponent(cc.Label).string = "当前聚宝盆剩余"+data.nb+"个金币";
        });
        // 碰碎后的操作
        cc.find('resident').on('broken',function(data){
            clearTimeout(_self.timer);
            cc.find('Canvas/background/topText/explain1').active = false;
            cc.find('Canvas/background/topText/explain2').active = true;
            _self.timer = setTimeout(() => {
                cc.find('Canvas/background/topText/explain1').active = true;
                cc.find('Canvas/background/topText/explain2').active = false;
            },2000);
        });
        // 结束游戏 got消息
        cc.find('resident').on('goEnd',function(data){
            if (data.balance <= 0){
                cc.director.loadScene('final');
            }
        });
    },
    // 游戏时间及'注意啦'声音控制
    gameing(){
        this.schedule(()=>{
            cc.audioEngine.play(this.noticeMusic);
        },3.7);
    },
    // 返回玩家编号
    getPlayerNum(){
        return this.playerNum;
    },
    moveTop(){
        var move = new cc.Node;
        move.addComponent(cc.Sprite);
        move.getComponent(cc.Sprite).spriteFrame = this.coinPic;
        move.width = 28;
        move.height = 28;
        cc.find('Canvas').addChild(move);
        var x = cc.find('Canvas/bz/ball').x;
        var y = cc.find('Canvas/bz/ball').y;
        move.setPosition(x,y);
        var headPos = cc.find('Canvas/top').position;
        move.runAction(cc.moveTo(0.8, headPos));
        this.scheduleOnce(() => {
            move.destroy();
        }, 0.8);
    },
});
