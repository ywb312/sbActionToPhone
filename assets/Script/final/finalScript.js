cc.Class({
    extends: cc.Component,
    properties: {
        finalStart: {
            default: null,
            type: cc.AudioClip,
        },
        finalTalk: {
            default: null,
            type: cc.AudioClip,
        },
        finalBgMusic: {
            default: null,
            type: cc.AudioClip,
        },
        publicBtnMusic: {
            default: null,
            type: cc.AudioClip,
        },
        rankPre:cc.Prefab,
    },
    onLoad() {
        cc.audioEngine.play(this.finalStart, false, 1);
        cc.audioEngine.play(this.finalTalk, false, 1);
        cc.audioEngine.play(this.finalBgMusic, false, 1);
        this.ajaxEnd();
    },
    start() {
        // 重置复活
        cc.find('resident').getComponent("residentScript").resurgence = 0;
        // 我也发红包
        cc.find("Canvas/btn").on("touchend", () => {
            cc.director.loadScene('again');
        })
    },
    ajaxEnd() {
        var _self = this;
        var baseURL = cc.find('resident').getComponent('residentScript').dealHost('end');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                _self.setRank(res.scores);
            }
        }
        xhr.open('post', baseURL);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
    },
    setRank(data){
        var _self = this;
        var me = cc.find('resident').getComponent('residentScript').me;
        data.sort(function(){
            return function(a,b){
                return a.rank - b.rank
            }
        });
        for (let i = 0; i < data.length; i++) {
            var obj = {
                rank:data[i].rank,
                head:data[i].avatar,
                name:data[i].nickname,
                score:data[i].score/100,
                self:0,
            }
            if(me.openid == data[i].openid){
                cc.find('Canvas/money').getComponent(cc.Label).string = '￥' + cc.find('resident').getComponent("residentScript").toDecimal2(obj.score);
                obj.self = 1;
            }
            var newRankPre = cc.instantiate(_self.rankPre);
            cc.find('Canvas/rankList/list').addChild(newRankPre);
            newRankPre.getComponent('rankScript').createRank(obj);
        }
    },
    // 对对象数组排序成绩
});