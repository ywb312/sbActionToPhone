cc.Class({
    extends: cc.Component,
    properties: {
        leftBg1:cc.SpriteFrame,
        leftBg2:cc.SpriteFrame,
        rightBg1:cc.SpriteFrame,
        rightBg2:cc.SpriteFrame,
    },
    start () {
        // 创建变量 选中左边为0 右边为1
        var choiceOne = null;
        let _self = this;
        // 各个道具标题动画
        var action1 = cc.sequence(
            cc.fadeOut(0.25),
            cc.fadeIn(0.25),
            cc.fadeOut(0.25),
            cc.fadeIn(0.25),
            cc.fadeOut(0.25),
            cc.fadeIn(0.25),
            cc.fadeOut(0.25),
            cc.fadeIn(0.25),
        );
        //定时动画
        var bol = true;
        this.schedule(()=>{
            if (bol) {
                cc.find('Canvas/choice/select/left/title').runAction(action1);
            } else {
                cc.find('Canvas/choice/select/right/title').runAction(action1);
            }
            bol = !bol;
        },2.25);
        // 点击动画
        cc.find('Canvas/choice/select/left').on('touchend',()=>{
            choiceOne = 0;
            // 获取杯子类型
            cc.find('resident').getComponent("residentScript").tool = "300";
            //替换图片
            cc.find('Canvas/choice/select/left').getComponent(cc.Sprite).spriteFrame = _self.leftBg2;
            cc.find('Canvas/choice/select/right').getComponent(cc.Sprite).spriteFrame = _self.rightBg1;
            cc.find('Canvas/choice/select/left').runAction(cc.sequence(cc.scaleTo(0.05,1.1),cc.scaleTo(0.05,1)));
            // 修改宽度
            cc.find('Canvas/choice/select/left').width = 185;
            cc.find('Canvas/choice/select/left').height = 306;
            cc.find('Canvas/choice/select/right').width = 150;
            cc.find('Canvas/choice/select/right').height = 270;
        });
        cc.find('Canvas/choice/select/right').on('touchend',()=>{
            choiceOne = 1;
            // 获取杯子类型
            cc.find('resident').getComponent("residentScript").tool = "200";
            //替换图片
            cc.find('Canvas/choice/select/left').getComponent(cc.Sprite).spriteFrame = _self.leftBg1;
            cc.find('Canvas/choice/select/right').getComponent(cc.Sprite).spriteFrame = _self.rightBg2;
            cc.find('Canvas/choice/select/right').runAction(cc.sequence(cc.scaleTo(0.05,1.1),cc.scaleTo(0.05,1)));
            // 修改宽度
            cc.find('Canvas/choice/select/right').width = 185;
            cc.find('Canvas/choice/select/right').height = 306;
            cc.find('Canvas/choice/select/left').width = 150;
            cc.find('Canvas/choice/select/left').height = 270;
        });
        //拉起支付
        cc.find('Canvas/choice/btn').on('touchend',()=>{
            if (choiceOne!=null) {
                _self.ajaxCreate();
            }
        });
    },
    ajaxCreate() {
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('create');
        var obj = {
            type:2,
            coins: cc.find('resident').getComponent("residentScript").tool,
            fee: 20,
        }
        var str = cc.find('resident').getComponent('residentScript').setObjData(obj);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                if (res.ispaid == 0) {
                    _self.weixinPay(res);
                } else {
                    _self.ajaxStart();
                }
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
        var vm = this;
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', params.config,
            function (res) {
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    vm.schedule(()=>{
                        vm.ajaxIspaid(params.orderid);
                    },1);
                } else {
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
                    cc.find('resident').getComponent('residentScript').isnew = 0;
                    _self.ajaxStart();
                }
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(str);
    },
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
