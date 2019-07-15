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
    },
    onLoad() {
        this.clickAble = false;
    },
    start () {
        // cc.director.preloadScene('select',()=>{});
        cc.director.preloadScene('final',()=>{});
        cc.director.preloadScene('again',()=>{});
        this.scheduleOnce(()=>{
            cc.find('Canvas/bz/img').runAction(cc.scaleTo(1,1));
            this.scheduleOnce(()=>{
                cc.find('Canvas/mask').active = false;
                this.clickAble = true;
            },1);
        },3);
        //碰撞后改变杯子位置
        cc.find('resident').on('changePos',function(data){
            if (cc.find('Canvas/bz/img')!=null) {
                cc.find('Canvas/bz/img').setPosition(data.x/1.75,Math.floor(((data.y+157.5)/1.41)+5));
                // cc.find('Canvas/bz').getComponent('cupScript').offMove();
                // setTimeout(() => {
                //     cc.find('Canvas/bz').getComponent('cupScript').onMove();
                // },500);
            }
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
        // let num = 30;
        // 游戏时间
        // this.schedule(()=>{
        //     num--;
        //     if (num<=0) {
        //         cc.audioEngine.play(this.gameOverMusic,false,1);
        //     }
        // },1);
        this.schedule(()=>{
            // if (num>2) {
                cc.audioEngine.play(this.noticeMusic);
            // }
        },3.7);
    },
    // 返回玩家编号
    getPlayerNum(){
        return this.playerNum;
    },
});
