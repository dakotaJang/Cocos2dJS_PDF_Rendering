var HelloWorldLayer = cc.Layer.extend({
    pdfSprite:null,
    pageNumber:1,
    ctor:function () {
        this._super();

        this.pdfSprite = new pdfSprite();
        this.pdfSprite.x = cc.winSize.width / 2
        this.pdfSprite.y = cc.winSize.height / 2
        this.addChild(this.pdfSprite,1)
        this.pdfSprite.displayPDFPage("res/document.pdf", this.pageNumber);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this)

        return true;
    },
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget();
        return true;
    },
    onTouchMoved:function(touch, event){
        var target = event.getCurrentTarget();
    },
    onTouchEnded:function(touch, event){
        var target = event.getCurrentTarget();
        var currentPage = target.pageNumber

        // go to prev/next page based on where touch ended (left/right)
        if(touch.getLocation().x>cc.winSize.width/2){
            if(target.pageNumber<(target.pdfSprite.lastPage-1)){
                target.pageNumber++;
            }
        }else{
            if(target.pageNumber>1){
                target.pageNumber--;
            }
        }
        target.pdfSprite.displayPDFPage("res/document.pdf", target.pageNumber);
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

