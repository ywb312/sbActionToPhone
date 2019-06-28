cc.Class({
    extends: cc.Component,
    properties: {
        coin:cc.Prefab,
        person:0
    },
    start () {
        this.nowCoin=0;
    },
    boomNone(){
        // 清除瓶内钱币
        // this.nowCoin=0;
        // this.node.destroyAllChildren();
        // 获取货币数量
        var num = 0;
        switch (this.person) {
            case 1:
                num = cc.find("Canvas/control").getComponent("gameScript").scoreOne;
                cc.find("Canvas/control").getComponent("gameScript").scoreOne = 0;
                break;
            case 2:
                num = cc.find("Canvas/control").getComponent("gameScript").scoreTwo;
                cc.find("Canvas/control").getComponent("gameScript").scoreTwo = 0;
                break;
            case 3:
                num = cc.find("Canvas/control").getComponent("gameScript").scoreThree;
                cc.find("Canvas/control").getComponent("gameScript").scoreThree = 0;
                break;
            case 4:
                num = cc.find("Canvas/control").getComponent("gameScript").scoreFour;
                cc.find("Canvas/control").getComponent("gameScript").scoreFour = 0;
                break;
            case 5:
                num = cc.find("Canvas/control").getComponent("gameScript").scoreFive;
                cc.find("Canvas/control").getComponent("gameScript").scoreFive = 0;
                break;
            case 6:
                num = cc.find("Canvas/control").getComponent("gameScript").scoreSix;
                cc.find("Canvas/control").getComponent("gameScript").scoreSix = 0;
                break;
            default:
                break;
        }
        this.fallMoney(num,this.coin);
        // this.fallMoney(obj.yb,this.yuanbao)
        // this.fallMoney(obj.silver,this.silver)
    },
    fallMoney(num,who){
        for (let i = 0; i < num;i++) {
            let newPrefab = cc.instantiate(who);
            this.node.addChild(newPrefab);
            let a = {
                x : Math.random()*141-70,
                y : 0
            }
            newPrefab.position = a;
             // 获取杯子位置
            cc.find("Canvas/fall").position = this.node.parent.position;
            newPrefab.setParent(cc.find("Canvas/fall"))
        }
    },
});
