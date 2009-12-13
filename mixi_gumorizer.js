tl_queue = [];
fr_queue = [];
ur_queue = [];
    
/*html templates*/
THUMNAIL_TEMP = "<td class='thumbnail'><span><a href='/run_appli.pl?id=7157&owner_id=2404403'><img src='http://i.rekoo.com/static/mixi/farm/images/feed/everyday_login_feed.jpg' alt='「サンシャイン牧場」でログインプレゼントをゲットし…' height='76' width='76' /></a></span></td>";

tmixer = { 
   replaceVoice: function () {
       var doc = jetpack.tabs.focused.contentDocument;
       var replaced_voice = [];
       $.each(tl_queue, function(){
           replaced_voice.push( this.text + " <a href='http://twitter.com/" + this.screen_name + "'>" + this.screen_name + "</a>" );
           //jetpack.tabs.focused.contentWindow.alert(replaced_voice);
       });
       
       //$(doc).find(".echoList>li").html(replaced_voice);
       $(doc).find(".echoList>li").each(function(){
           $(this).html(replaced_voice.shift());
           //replaced_voice.shift();
       });
       
       //change the icon of mixi voice
       cssValue = "url(http://a1.twimg.com/a/1260166426/images/favicon.ico) no-repeat 1px 0";
       var cssValue = $(doc).find(".echoList>li").css("background", cssValue);
       
   },// end replace()
    insertTwitterFriends: function (){
         var doc = jetpack.tabs.focused.contentDocument;
         var mymixiList = $(doc).find("#mymixiList");
         
         
         $(mymixiList).find("h2").text("Twitter friends (" + ur_queue[0].friends_count + ")"); //マイミクシ数
         var iconListTable = $(mymixiList).find(".iconListTable");
         var i=0;
         $(iconListTable).find("tr").each(function(){
             $(this).find("td").each(function(){
                
                // change friend's icon
                //var cssValue = "url(http://a3.twimg.com/profile_images/559224353/22788224_2483160624_normal.jpg) no-repeat 1px 0";
                
                /* change friends icon */
                var cssValue = "url(" + fr_queue[i].profile_image_url + ") no-repeat 1px 0";
                $(this).find("a").css("background", cssValue);
                
                $(this).find("span").text(fr_queue[i].user_name);
                //$(this).find("span").text("hoge");
                i++;
             });
         });
         /*$.each(tl_queue, function(){
            jetpack.tabs.focused.contentWindow.alert(this.text);
         });*/
        
    },
   insertTweet: function(){
         var doc = jetpack.tabs.focused.contentDocument;
         var mymixiList = $(doc).find("#appliUpdate");
         $(mymixiList).find("h3").text("tweet"); //header
         //jetpack.tabs.focused.contentWindow.alert(mymixiList.find(".appliLogBody").html());
         //var tweetLine = $(mymixiList).find(".appliLogBody");
         

         var i = 0;
         $(mymixiList).find(".appliLogItem").each(function() {
            var thum = $(this).find(".thumbnail img");
            if( thum.length != 0 ) {
                thum.attr("src", tl_queue[i].profile_image_url);
            } else {
                $(this).find(".log").before(THUMNAIL_TEMP);
            }
            $(this).find(".log a").html(tl_queue[i].text);
            $(this).find(".log span").html(tl_queue[i].user_name);
            $(this).find(".appliName").html("");
            i++;
         });
   },
   
   initiate: function (tm) {
       $.ajax({
         type: "GET",
         url: "http://twitter.com/statuses/friends_timeline.json",
         dataType: "json",
         success: function (tweets) {
           //console.log(tweets.length + " new tweets");
           $.each(tweets, function () {
               tl_queue.push({
                 user_name: this.user.name,
                 screen_name: this.user.screen_name,
                 text: this.text,
                 profile_image_url: this.user.profile_image_url
               });
           }); //end $.each()
         },
         error: function (req, status, error) {
           console.log(status + ' ' + error);
         }    
       });
       
       /* a user's friends status. */
       $.ajax({
         type: "GET", 
         url: "http://twitter.com/statuses/friends.json?count=10",
         dataType: "json",
         success: function (tweets) {
           //console.log(tweets.length + " new tweets");
           $.each(tweets, function () {
               //jetpack.tabs.focused.contentWindow.alert(this.name);/*
               fr_queue.push({
                 user_name: this.name,
                 screen_name: this.screen_name,
                 text: this.text,
                 profile_image_url: this.profile_image_url
               });
           }); //end $.each()
         },
         error: function (req, status, error) {
           console.log(status + ' ' + error);
         }    
       });
       
       /* a user's status. */
       $.ajax({
         type: "GET", 
         url: " http://twitter.com/statuses/user_timeline.json",
         dataType: "json",
         success: function (tweets) {
           $.each(tweets, function () {
               ur_queue.push({
                 //user_name: this.user.name,
                 //screen_name: this.screen_name,
                 friends_count: this.user.friends_count,
                 //profile_image_url: this.user.profile_image_url
               });
           }); //end $.each()
           //tmixer.replaceVoice();
         },
         error: function (req, status, error) {
           console.log(status + ' ' + error);
         }    
       });
       tmixer.replaceVoice();
       tmixer.insertTwitterFriends();
       tmixer.insertTweet();
     },// end initiate()
     
     test: function(){

     },

}// end tmixer.prototype

jetpack.statusBar.append({
   html:  "<img src='http://a1.twimg.com/a/1260166426/images/favicon.ico'/>",
   onReady:function(tm) {
       //var tm_obj = new tmixer(tm);
       $("body", tm).css({cursor:"pointer"});
       $(tm).click( function(){ tmixer.initiate(tm) } );
       //$(tm).click( function(){ tmixer.test(tm) } );
   }
});

