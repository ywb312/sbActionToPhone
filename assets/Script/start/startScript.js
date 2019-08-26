cc.Class({
    extends: cc.Component,
    properties: {
        publicMusic: {
            default: null,
            type: cc.AudioClip,
        },
        homeTalk: {
            default: null,
            type: cc.AudioClip,
        },
        haveRed: {
            default: null,
            type: cc.AudioClip,
        },
        alertMusic: {
            default: null,
            type: cc.AudioClip,
        },
        btnMusic: {
            default: null,
            type: cc.AudioClip,
        },
        qrCodeNode: cc.Node,
    },
    onLoad() {
        this.preload = 100;
        this.goAgain = false;
    },
    start() {
        let _self = this;
        this.ajaxEnter();
        cc.director.preloadScene('game', () => {
            this.preload = 0;
        });
        cc.director.preloadScene('again', () => {
            this.goAgain = true;
        });
        // 动画
        cc.find('Canvas/packet/img').runAction(cc.repeatForever(cc.rotateBy(2,-90)));
        var action1 = cc.sequence(cc.moveTo(0.5,cc.p(0,-125)),cc.moveTo(0.5,cc.p(0,0)));
        cc.find('Canvas/packet').runAction(action1);
        // 按钮点击事件
        cc.find('Canvas/packet/btn').on("touchend", () => {
            _self.getPaidStatus();
        });
        // 点击事件
        cc.find('Canvas/packet/rule').on("touchend", () => {
            cc.find('Canvas/packet').active = false;
            // cc.audioEngine.play(this.alertMusic);
            cc.find('Canvas/rule').active = true;
        });
        cc.find('Canvas/rule/close').on("touchend", () => {
            // cc.audioEngine.play(this.publicMusic);
            cc.find('Canvas/packet').active = true;
            cc.find('Canvas/rule').active = false;
        });
        cc.find('Canvas/invite/close').on("touchend", () => {
            cc.find('Canvas/invite').active = false;
            cc.find('Canvas/packet').active = true;
            cc.find('Canvas/packet').setPosition(0,-70);
        });
        // 邀请
        cc.find('Canvas/invite/shareBtn').on("touchend", () => {
            console.log('分享');
        });
        // headBox头像框加人
        cc.find('resident').on('playerEnt',function(data){
            if (cc.find('Canvas/invite/text')!= null) {
                _self.setHead(data);
            }
        });
        this.schedule(()=>{
            this.shake(cc.find('Canvas/invite'));
            this.shake(cc.find('Canvas/packet'));
        },5);
    },
    //抖动动画
    shake(node){
        let x = node.x;
        let y = node.y;
        let action = cc.sequence(
                cc.rotateTo(0.05,-2),
                cc.rotateTo(0.05,0),
                cc.rotateTo(0.05,2),
                cc.rotateTo(0.05,-2),
                cc.rotateTo(0.05,0),
                cc.rotateTo(0.05,2),
                cc.rotateTo(0.05,-2),
                cc.rotateTo(0.05,0),
                cc.rotateTo(0.05,2),
                cc.rotateTo(0.05,0),
        );
        node.runAction(action);
    },
    // 接口 
    ajaxEnter() {
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('enter');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                cc.find('resident').getComponent('residentScript').isnew = res.istrial;
                cc.find('resident').getComponent('residentScript').me = res.me;
                cc.find('resident').getComponent('residentScript').redpack = res.redpack;
                cc.find('resident').getComponent('residentScript').tool = res.tool;
                cc.find('resident').getComponent('residentScript').coin_paid = res.coin_paid;
                _self.coin_paid = res.coin_paid;
                _self.ajaxUsers();
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
    },
    ajaxUsers() {
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('users');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                cc.find('resident').getComponent('residentScript').userList = res.users;
                cc.find('resident').getComponent('residentScript').changeQRcode(res.url,_self.qrCodeNode);
                _self.ajaxFenping();
                _self.setHead(res.users);
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
    },
    ajaxFenping() {
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('fenping');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                cc.audioEngine.play(_self.btnMusic);
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
    },
    ajaxStart() {
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('start');
        // 回传新手
        var obj = {
            x: 0,
            y: -80,
            istrial:cc.find('resident').getComponent('residentScript').isnew
        }
        var str = cc.find('resident').getComponent('residentScript').setObjData(obj);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                cc.find('resident').getComponent('residentScript').color = res.color;
                cc.find('resident').getComponent('residentScript').isnew = res.istrial;
                cc.director.loadScene('game');
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(str);
    },
    setHead(data){
        var num = 3 - data.length;
        cc.find('Canvas/invite/text').getComponent(cc.Label).string = num;
        if (data.length!=0) {
            for (let i = 0; i < data.length; i++) {
                let j = i + 1;
                if (j < 4) {
                    cc.loader.load({ url: data[i].avatar, type: 'jpg' }, function (err, ttt) {
                        var newFra = new cc.SpriteFrame;
                        newFra.setTexture(ttt);
                        cc.find('Canvas/headBox/player'+j+'/img/headImg').getComponent(cc.Sprite).spriteFrame = newFra;
                    });
                    cc.find('Canvas/headBox/player'+j+'/name').getComponent(cc.Label).string = data[i].nickname;
                }
            }
        }
        if (data.length>=3) {
            var move1 = cc.moveTo(0.5,cc.p(150,-30));
            var move2 = cc.moveTo(0.5,cc.p(150,-15));
            var move3 = cc.moveTo(0.5,cc.p(150,-30));
            var move4 = cc.moveTo(0.5,cc.p(150,-15));
            var move5 = cc.moveTo(0.5,cc.p(150,-30));
            var move6 = cc.fadeOut(1);
            var move7 = cc.moveTo(0.01,cc.p(150,0));
            var move8 = cc.fadeIn(2);
            var actionArr = cc.sequence(move1,move2,move3,move4,move5,move6,move7,move8);
            cc.find('Canvas/headBox/player4').runAction(cc.repeatForever(actionArr));
        }
    },
    // 控制展示效果
    getPaidStatus() {
        var isnew = cc.find('resident').getComponent("residentScript").isnew;
        var redpack = cc.find('resident').getComponent("residentScript").redpack;
        var list = cc.find('resident').getComponent("residentScript").userList;
        cc.audioEngine.play(this.haveRed, false, 1);
        // 加载转圈
        // cc.find('Canvas/loading').active = true;
        // cc.find('Canvas/loading').runAction(cc.repeatForever(cc.rotateBy(2, 360)));
        // 是新手或者人气
        if (isnew == 1 || (redpack.red_number >= 3 && redpack.balance > 0) || this.coin_paid == 1) {
            cc.audioEngine.play(this.homeTalk, false, 1);
            // if (list.length >= 3) {   //满3人可以开始
            //     var timer = setInterval(() => {
            //         // 加载完毕
            //         if (this.preload == 0) {
            //             // 控制跳转 是否剩余红包
            //             clearInterval(timer);
            //             this.ajaxStart();
            //         }
            //     }, 300);
            // } else if(this.coin_paid == 1) {
                this.ajaxStart();
            // } else {  //有教学或红包 不满3人
            //     cc.find('Canvas/headBox').active = true;
            //     cc.find('Canvas/invite').active = true;
            //     cc.find('Canvas/packet').active = false;
            //     cc.find('Canvas/packet').runAction(cc.moveTo(1,cc.p(0,-70)));
            //     cc.find('Canvas/invite').runAction(cc.moveTo(1,cc.p(0,-50)));
            // }
            // 不是新手
        } else {
            // this.ajaxStart();
            if (this.goAgain) {
                cc.director.loadScene('again');
            }
        }
    },
});
