cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.roomId = this.getUrlParam('rid');
        this.pttoken = this.getUrlParam('pttoken');
        this.userList = [];
        this.player1={};
        this.player2={};
        this.player3={};
        this.player4={};
        this.player5={};
        this.player6={};
        this.me={};
        this.tool = 0;
        this.color = 0;
        // 判断链接
        if (window.location.href.indexOf('ceshi')!=-1) {
            this.host = "http://ceshi.putaohudong.com/api/coin/";
            this.wsURL = "ws://ceshi.putaohudong.com:8088/wscoin?rid="+this.roomId+"&pttoken="+this.pttoken;
        } else if (window.location.href.indexOf('test')!=-1) {
            this.host = "http://test.putaohudong.com/api/coin/";
            this.wsURL = "ws://test.putaohudong.com:8088/wscoin?+rid="+this.roomId+"&pttoken="+this.pttoken;
        }else{
            this.host = "http://games.putaohudong.com/api/coin/";
            this.wsURL = "ws://games.putaohudong.com:8088/wscoin?+rid="+this.roomId+"&pttoken="+this.pttoken;
        }
        this.LinkWS(this);
    },
    // 根据接口名 处理url
    dealHost(name){
        var baseUrl = this.host + name + "?rid="+this.roomId+"&pttoken="+this.pttoken;
        return baseUrl;
    },
    // 链接ws
    LinkWS(obj){
        var webSocket = new WebSocket(this.wsURL);
        let wsinterval = false;
        webSocket.onopen = function(event){
            console.log('大冒险链接打开');
        };
        //收到消息进行处理
        webSocket.onmessage = function(val){
            var data = JSON.parse(val.data);
            if (data.action == 'open') {
                console.log('openWS!');
                wsinterval = setInterval(function () {
                    webSocket.send('{"action":"heart","data":{"time":"' + Math.round(new Date()) + '"}}');
                }, 10000);
            }
            if (data.action == 'enter') {
                obj.homeStatus(data.data.user);
            }
            if (data.action == 'got') {
                cc.find('resident').emit('goEnd',data.data);
            }
            if (data.action == 'users') {
                obj.changeMePos(data.data);
            }
            if (data.action == 'crash') {
                obj.getCrash(data.data);
            }
            if (data.action == 'leave') {
                obj.removePlayer(data.data);
            }
            if (data.action == 'score') {
                cc.find('resident').emit('changeScore',data.data);
            }
        };
        webSocket.onclose = function(){
            console.log("撒币大行动链接关闭");
        };
        cc.find('resident').on('setPos',function(data){
            webSocket.send('{"action":"pos","pttoken":"' + cc.find('resident').getComponent('residentScript').pttoken
                + '","rid":"' + cc.find('resident').getComponent('residentScript').roomId
                + '","data":{"x":"'+ data.x
                + '","y":"'+ data.y
                + '","ck":"'+ data.ck
                + '","tool":"'+ data.tool
                + '"}}');
        });
    },
    // 获取每个玩家列表
    homeStatus(data){
        var bol = true;
        for (let i = 0; i < this.userList.length; i++) {
            if (data.openid == this.userList[i].openid) {
                bol = false;
            }
        }
        if (bol) {
            this.userList.push(data);
        }
        cc.find('resident').emit('playerEnt',this.userList);
    },
    // 碰撞后改变自己位置
	changeMePos(data) {
		for(let i = 0; i < data.length; i++) {
            if(data[i].user.openid == this.me.openid) {
                cc.find('resident').emit('changePos',data[i]);
            }
		}
	},
    // 删除操作
    removePlayer(data){
        for (let i = 0; i < this.userList.length; i++) {
            if (data.openid == this.userList[i].openid) {
                this.userList.splice(i,1);
            }
        }
    },
    getCrash(data){
        // if (data.openid == this.me.openid) {
        //     cc.director.loadScene('select');
        // }
    },
    // 对数据进行修改
    getPacketText(){
        var str = '';
        if (this.isnew == 0) {
            str = '财神的聚宝盆红包';
        } else {
            // 红包发送者信息
            str = '的聚宝盆红包';
        }
        return str;
    },
    // 从url中获取值
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null;//返回参数值
    },
    // 保留两位小数
    toDecimal2(x) {
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    },
    // 生成二维码
    changeQRcode(url,node) {
        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData(url);
        qrcode.make();
        var ctx = node.addComponent(cc.Graphics);
        var tileW = node.width / qrcode.getModuleCount();
        var tileH = node.height / qrcode.getModuleCount();

        // draw in the Graphics
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                // ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                if (qrcode.isDark(row, col)) {
                    ctx.fillColor = cc.Color.BLACK;
                } else {
                    ctx.fillColor = cc.Color.WHITE;
                }
                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                ctx.fill();
            }
        }
    },
    // 简单ajax插件
    setObjData(data, parentName) {
        function encodeData(name, value, parentName) {
            var items = [];
            name = parentName === undefined ? name : parentName + "[" + name + "]";
            if (typeof value === "object" && value !== null) {
                items = items.concat(setObjData(value, name));
            } else {
                name = encodeURIComponent(name);
                value = encodeURIComponent(value);
                items.push(name + "=" + value);
            }
            return items;
        }
        var arr = [],value;
        if (Object.prototype.toString.call(data) == '[object Array]') {
            for (var i = 0, len = data.length; i < len; i++) {
                value = data[i];
                arr = arr.concat(encodeData( typeof value == "object" ? i : "", value, parentName));
            }
        } else if (Object.prototype.toString.call(data) == '[object Object]') {
            for (var key in data) {
                value = data[key];
                arr = arr.concat(encodeData(key, value, parentName));
            }
        }
        return arr.join("&").replace("/%20/g", "+");
    }
});
