cc.Class({
    extends: cc.Component,
    properties: {
        publicBtnMusic: {
            default: null,
            type: cc.AudioClip,
        },
        alertMusic: {
            default: null,
            type: cc.AudioClip,
        },
        qrCodeNode: cc.Node,
    },
    start() {
        let _self = this;
        this.setHeadBox();
        this.getPayNum();
        this.animation();
        // 塞进红包点击
        cc.find('Canvas/btn').on('touchend', () => {
            cc.audioEngine.play(this.publicBtnMusic, false, 1);
            _self.ajaxCreate(_self.fee);
        });
    },
    // 动画
    animation(){
        //聚宝盆亮点闪烁
        var bol = false;
        this.schedule(()=>{
            cc.find('Canvas/pen/light').active = bol;
            bol = !bol;
        },0.3);
        // 背景转圈
        cc.find('Canvas/rotate').runAction(cc.repeatForever(cc.rotateBy(2,-180)));
    },
    // 通过请求获取支付的金额
    getPayNum(){
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('create');
        var obj = {
            type:1,
            coins:0,
            fee:0,
        }
        var str = cc.find('resident').getComponent('residentScript').setObjData(obj);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                let num = (res.fee/100);
                let list = cc.find('resident').getComponent('residentScript').userList;
                _self.fee = res.fee;
                var sum = res.fee * 4 / 5;
                if (list.length>4) {
                    sum = res.fee * list.length / 5;
                }
                _self.schedule(()=>{
                    cc.find('Canvas/sumLabel').getComponent(cc.Label).string = sum/100;
                    cc.find('Canvas/sumLabel').active = true;
                },2);
                cc.find('Canvas/topNum').getComponent('numScript').setTopNum(num);
                cc.find('Canvas/topNum').getComponent('numScript').setBottomNum(sum);
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(str);
    },
    // 头像框进入
    setHeadBox(){
        let list = cc.find('resident').getComponent('residentScript').userList;
        let me = cc.find('resident').getComponent('residentScript').me;
        for (let i = 0; i < list.length; i++) {
            let j = i+2;    //第一个是自己
            if (me.openid==list[i].openid) {
                list.splice(i,1);
                i--;
            }else{
                cc.loader.load({ url: list[i].avatar, type: 'jpg' }, function (err, ttt) {
                    var newFra = new cc.SpriteFrame;
                    newFra.setTexture(ttt);
                    cc.find('Canvas/heads/play'+j+'/img/headImg').getComponent(cc.Sprite).spriteFrame = newFra;
                });
                cc.find('Canvas/heads/play'+j).active = true;
            }
        }
        cc.loader.load({ url: me.avatar, type: 'jpg' }, function (err, ttt) {
            var newFra = new cc.SpriteFrame;
            newFra.setTexture(ttt);
            cc.find('Canvas/heads/play1/img/headImg').getComponent(cc.Sprite).spriteFrame = newFra;
        });

        // 进入动画
        cc.find('Canvas/heads/play1').runAction(cc.moveTo(0.5,cc.p(-180,0)));
        this.scheduleOnce(()=>{
            cc.find('Canvas/heads/play2').runAction(cc.moveTo(0.5,cc.p(-100,0)));
        },0.5);
        this.scheduleOnce(()=>{
            cc.find('Canvas/heads/play3').runAction(cc.moveTo(0.5,cc.p(-28,0)));
        },1);
        this.scheduleOnce(()=>{
            cc.find('Canvas/heads/play4').runAction(cc.moveTo(0.5,cc.p(44,0)));
        },1.5);
        this.scheduleOnce(()=>{
            cc.find('Canvas/heads/play5').runAction(cc.moveTo(0.5,cc.p(116,0)));
        },2);
        this.scheduleOnce(()=>{
            cc.find('Canvas/heads/play6').runAction(cc.moveTo(0.5,cc.p(188,0)));
        },2.5);
    },
    // 支付
    ajaxCreate(num) {
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('create');
        var obj = {
            type:1,
            coins: num / 5,
            fee: num,
        }
        var str = cc.find('resident').getComponent('residentScript').setObjData(obj);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                _self.weixinPay(res);
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(str);
    },
    //WXPAY
    weixinPay(parmse) {
        let vm = this;
        if (typeof WeixinJSBridge == "undefined") {//微信浏览器内置对象。参考微信官方文档
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(parmse), false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(parmse));
                document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(parmse));
            }
        } else {
            // alert("直接回调");
            vm.onBridgeReady(parmse);
        }
    },
    onBridgeReady(params) {
        //console.log('params: ' +params);
        var vm = this;
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', params.config,
            function (res) {
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // 付费成功后，跳转到房间页
                    console.log('支付成功');
                    vm.schedule(()=>{
                        vm.ajaxIspaid(params.orderid);
                    },1);
                } else {
                    //vm.$router.replace({path: '/medicalservice/orderdetail',query:{order_id:vm.order_id}});
                }
            }
        );
    },
    // 轮询接口，进入游戏
    ajaxIspaid(id) {
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('ispaid');
        var obj = {
            orderid: id,
        }
        var str = cc.find('resident').getComponent('residentScript').setObjData(obj);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                // cc.find('resident').getComponent('residentScript').ispaid = res.ispaid;
                // 付费后
                if (res.ispaid == 1) {
                    // cc.find('Canvas/share').active = true;
                    // 绘制二维码
                    cc.find('resident').getComponent('residentScript').changeQRcode(res.url,_self.qrCodeNode);
                    cc.find('resident').getComponent('residentScript').isnew = 0;
                    _self.ajaxStart();
                }
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(str);
    },
    // 开始
    ajaxStart() {
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('start');
        var obj = {
            x: 0,
            y: -80,
            istrial:cc.find('resident').getComponent('residentScript').isnew,
        }
        var str = cc.find('resident').getComponent('residentScript').setObjData(obj);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                cc.find('resident').getComponent('residentScript').color = res.color;
                cc.find('resident').getComponent('residentScript').isnew = res.istrial;
                // 测试屏蔽
                cc.director.loadScene('game');
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(str);
    },
});
 