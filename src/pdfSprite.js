// reference from: http://discuss.cocos2d-x.org/t/solved-viewing-a-pdf-file/28621/10
var pdfSprite = cc.Sprite.extend({
    lastPage:1,
    ctor: function(){
        this._super();
    },
    displayPDFPage: function(filename, pageNumber) {
        var self = this;

        // Build an URL with specified document file
        var url = filename;

        // Get and open the PDF document
        PDFJS.getDocument(url).then(function(pdfDocument) {
            console.log('Document ' + url + ' contain ' + pdfDocument.numPages + ' page(s)');

            // Render the requested page
            pdfDocument.getPage(pageNumber).then(function(page) {
                self.lastPage = page.view.length + 1;

                // Get PDF page width & height
                var scale = 1;
                var viewport = page.getViewport(scale);

                // Create a canvas and get the corresponding 2d drawing context, in which the PDF page will be rendered
                var PDFcanvas = document.createElement('Canvas');
                PDFcanvas.width = viewport.width;
                PDFcanvas.height = viewport.height;
                var PDFcontext = PDFcanvas.getContext('2d');
                
                var renderContext = {
                    canvasContext: PDFcontext,
                    viewport: viewport,
                    intent: "display"
                };
                // Render the PDF page with this context 
                page.render(renderContext).then(function() {

                    // Build a spriteFrame and use that context as texture source
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(PDFcanvas);
                    texture2d.handleLoadedTexture();
                    
                    self.setSpriteFrame(new cc.SpriteFrame.createWithTexture(texture2d, cc.rect(0, 0, PDFcanvas.width, PDFcanvas.height)));

                    // Adjust height of the sprite according to document aspect ratio
                    var ratio = PDFcanvas.height / PDFcanvas.width;
                    self.height = self.width * ratio;
                }, function(failureReason) {
                    console.log('**!!** An error occured when rendering page ' + pageNumber + ' : ' + failureReason);
                });

                return page;

            }, function(failureReason) {
                console.log('**!!** An error occured when accessing page ' + pageNumber + ' : ' + failureReason);
            });

        }, function(failureReason) {
            console.log('**!!** An error occured with PDF file ' + url + ' : ' + failureReason);
        });
    }
});