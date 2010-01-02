key_req_url = "http://jlp.yahooapis.jp/KeyphraseService/V1/extract?appid=Xh2nUz6xg64H.liLhwHrCPHHC2fp7EyWnMkya_eewrxcKx466F7lcRSmZSxau.evNRN8&sentence=";
jetpack.future.import("slideBar");
jetpack.future.import("selection");

function YahooAPI() { /* Life if Funny. */ }
YahooAPI.prototype = {
    key_req_url : "http://jlp.yahooapis.jp/KeyphraseService/V1/extract?appid=Xh2nUz6xg64H.liLhwHrCPHHC2fp7EyWnMkya_eewrxcKx466F7lcRSmZSxau.evNRN8&sentence=",
    initiate: function (str, slider) {
        console.log("run YahooAPI()");
        var keyword = "";
        str = encodeURI(str);
        console.log("str=>"+str);
        //self = this;
        // this.keyword = "";
        //jetpack.tabs.focused.contentWindow.alert(self.key_req_url + str);
        $.ajax({
            type: "GET",
            url: this.key_req_url + str,
            dataType: "xml",
            success: function (keys) {
                //console.log(tweets.length + " new tweets");
                console.log("key@=>" + keyword);
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
    run: function(slider) {
        var mainDoc = jetpack.tabs.focused.contentDocument; self = this;
        var yapi = new YahooAPI();
        $(mainDoc).find("*").hover(
            function(){ // mouse over 
                $(this).css({"outline": "none"});
                $(this).css({"outline": "5px dashed blue"});
                $(this).click(function(){
                    if(self.textClicked == 1) {
                        return false;
                    }
                    //jetpack.tabs.focused.contentWindow.alert(jetpack.selection.text);
                    if(jetpack.selection.text != "") {
                        //jetpack.tabs.focused.contentWindow.alert(jetpack.selection.text);
                        self.selectedText = jetpack.selection.text;
                        // $("#keyword", slider.contentDocument).html(self.selectedText);
                        console.log("selected1=> " + self.selectedText);
                        //var keyword = yapi.getKeyWord();
                        yapi.initiate(self.selectedText, slider);
                        return false;
                    }
                    self.selectedText = $(this).text();
                    console.log("call initiate=>" + self.selectedText);
                    yapi.initiate(self.selectedText, slider);
                    //var keyword = yapi.getKeyWord();
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
        console.log("getSelectedText()");
        return self.selectedText;
    },
}




//http://d.hatena.ne.jp/TakiTake/20090616/p1
/*
jetpack.slideBar.append({
  icon: "http://calendar.google.com/googlecalendar/images/favicon.ico",
  width: 350,
  url: "http://www.goto.info.waseda.ac.jp/~junki/test.html",
  persist: true,
  autoReload: true,
  td: new TextDriver(),
  onSelect: function(slider) { slide.slide(350); },
  onReady: function(slider) {
        var macross = $(slider.contentDocument).find("#macross");
        //jetpack.tabs.focused.contentWindow.alert(macross.html());
        //macross.html("iPhone");
        this.td.run(slider);
        var yapi = new YahooAPI();
        var encStr = "%E6%9D%B1%E4%BA%AC%E3%83%9F%E3%83%83%E3%83%89%E3%82%BF%E3%82%A6%E3%83%B3%E3%81%8B%E3%82%89%E5%9B%BD%E7%AB%8B%E6%96%B0%E7%BE%8E%E8%A1%93%E9%A4%A8%E3%81%BE%E3%81%A7%E6%AD%A9%E3%81%84%E3%81%A65%E5%88%86%E3%81%A7%E7%9D%80%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82";
       
       // yapi.run(encStr);
  },
  onClick: function(slider) {
        //var td = new TextDriver();
        //var text = td.getSelectedText();
        var selectedText = this.td.getSelectedText();
        $("#keyword", slider.contentDocument).html(selectedText);
         
         //keyword.text() = selectedText;
        //jetpack.tabs.focused.contentWindow.alert(slider.contentDocument.text());

  },
});
*/

var enabled = false;
jetpack.statusBar.append({
    html: "<body style='white-space:nowrap;'>"+
              "<a href='#' id='enable' style='background:url(http://users.skumleren.net/cers/test/ytpl/off.png) no-repeat center; width:20px; display:block;cursor:pointer;float:left;'>&nbsp;</a>"+
          "</body>",

    onReady: function(widget) {
        jetpack.slideBar.append({
            icon:     "http://users.skumleren.net/cers/test/ytpl/logo.png",
            url:       "http://app-jonki.appspot.com/",
            width:    350,
            persists: true,
            onClick:  function(slider) {slider.slide(this.width, true);},
            onReady:  function(slider) {
                ytpl = slider.contentDocument.wrappedJSObject.ytpl;
                $("a#enable",widget).click(function() {
                    console.log("statubar clicked");
                    enabled = !enabled;
                    var td = new TextDriver();
                    td.run(slider);
                    $(this).css("background-image","url(http://users.skumleren.net/cers/test/ytpl/"+{false:"off",true:"on"}[enabled]+".png)");
                });
                /*jetpack.tabs.onReady(function(doc) {
                    $("a", doc).filter(function() {return testUrl(this.href);})
                               .click( function() {return !(enabled && !onClick(this.href));}); 
                });*/
            }
        });
    }
});