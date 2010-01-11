key_req_url = "http://jlp.yahooapis.jp/KeyphraseService/V1/extract?appid=Xh2nUz6xg64H.liLhwHrCPHHC2fp7EyWnMkya_eewrxcKx466F7lcRSmZSxau.evNRN8&sentence=";
jetpack.future.import("slideBar");
jetpack.future.import("selection");

function YahooAPI() { /* Life if Funny. */ }
YahooAPI.prototype = {
    key_req_url : "http://jlp.yahooapis.jp/KeyphraseService/V1/extract?appid=Xh2nUz6xg64H.liLhwHrCPHHC2fp7EyWnMkya_eewrxcKx466F7lcRSmZSxau.evNRN8&sentence=",
    initiate: function (str, slider) {
        var keyword = "";
        str = encodeURI(str);
        //self = this;
        // this.keyword = "";
        //jetpack.tabs.focused.contentWindow.alert(self.key_req_url + str);
        $.ajax({
            type: "GET",
            url: this.key_req_url + str,
            dataType: "xml",
            success: function (keys) {
                var ct = 0;
                jQuery.each($(keys).find("Result"), function() {
                    
                    keyword += $(this).find("Keyphrase").text() + " ";
                    //console.log($(this).find("Keyphrase").text());
                    //console.log($(this).find("Score").text());
                    ct+=1;
                    if(ct>2){return false;}
                }); //end $.each()
                $("#keyword", slider.contentDocument).html(keyword);
            },
            error: function (req, status, error) {
                console.log(status + ' ' + error);
            }
        }); // end ajax
    }, //end initiate
}
function TextDriver() { /* Life if Funny. */ }
TextDriver.prototype = {
    selectedText: "",
    run: function(slider) {
        var mainDoc = jetpack.tabs.focused.contentDocument; self = this;
        var yapi = new YahooAPI();
        jetpack.selection.onSelection(function(){
             if(enabled) {
                 self.selectedText = jetpack.selection.text;
                 yapi.initiate(self.selectedText, slider);
                 return false;
             }
        });
        $(mainDoc).find("*").hover(
            function(){ // mouse over 
                $(this).css({"outline": "none"})
                          .css({"outline": "3px dashed blue"})
                          .click(function(){
                    if(jetpack.selection.text != "") return false;
                    self.selectedText = $(this).text();
                    yapi.initiate(self.selectedText, slider);
                     return false;
                })
                return false;
             },
             function(){ // mouse out
                $(mainDoc).find("*").css({"outline": "none"});
             }
        );
    },
    getSelectedText: function(){
        return self.selectedText;
    },
}

var enabled = false;
var statusBarOnReady = false;
jetpack.statusBar.append({
    /*html: "<body style='white-space:nowrap;'>"+
              "<a href='#' id='enable' style='background:url(http://users.skumleren.net/cers/test/ytpl/off.png) no-repeat center; width:20px; display:block;cursor:pointer;float:left;'>&nbsp;</a>"+
          "</body>",
    */
    html: "<body style='white-space:nowrap;'>"+
              "<a href='#' id='enable' style='background:url(http://www.goto.info.waseda.ac.jp/~junki/ITSP/img/gag/off.png) no-repeat center; width:20px; display:block;cursor:pointer;float:left;margin-top:-1px;'>&nbsp;</a>"+
          "</body>",

    onReady: function(widget) {
        if(statusBarOnReady) return false; // This line prevent duplicate slidebar's action.
        statusBarOnReady = !statusBarOnReady;
        jetpack.slideBar.append({
            //icon:     "http://users.skumleren.net/cers/test/ytpl/logo.png",
            icon:     "http://www.goto.info.waseda.ac.jp/~junki/ITSP/img/gag/logo.png",
            url:       "http://app-jonki.appspot.com/",
            width:    325,
            persists: true,
            onClick:  function(slider) {slider.slide(this.width, true);},
            onReady:  function(slider) {
                console.log("onReady");
                $("a#enable",widget).click(function() {
                    enabled = !enabled;
                    //$(this).css("background-image","url(http://users.skumleren.net/cers/test/ytpl/"+{false:"off",true:"on"}[enabled]+".png)");
                    $(this).css("background-image","url(http://www.goto.info.waseda.ac.jp/~junki/ITSP/img/gag/"+{false:"off",true:"on"}[enabled]+".png)");
                
                    if(enabled){
                        var td = new TextDriver();
                        td.run(slider);
                    }else{
                        var mainDoc = jetpack.tabs.focused.contentDocument; 
                        $(mainDoc).find("*").unbind();
                    }
                });
                
                jetpack.tabs.onFocus(function () {
                    var mainDoc = jetpack.tabs.focused.contentDocument; 
                    $(mainDoc).find("*").unbind();
                    if(enabled){
                        enabled = !enabled;
                        //$("a#enable", widget).css("background-image","url(http://users.skumleren.net/cers/test/ytpl/"+{false:"off",true:"on"}[enabled]+".png)");
                        $("a#enable", widget).css("background-image","url(http://www.goto.info.waseda.ac.jp/~junki/ITSP/img/gag/"+{false:"off",true:"on"}[enabled]+".png)");
                    }
                });
                jetpack.tabs.onReady(function() { // If page loaded another page in content page, stop this future.
                    if(enabled){
                        enabled = !enabled;
                        //$("a#enable", widget).css("background-image","url(http://users.skumleren.net/cers/test/ytpl/"+{false:"off",true:"on"}[enabled]+".png)");
                        $("a#enable", widget).css("background-image","url(http://www.goto.info.waseda.ac.jp/~junki/ITSP/img/gag/"+{false:"off",true:"on"}[enabled]+".png)");
                    }
                    
                });
            } //end onReady
        });
    }
});


