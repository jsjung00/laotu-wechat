/* NOTES: every text needs a unique container (one to one) named "myId-container" 
Do not set height and width for text container*/
//获取应用实例
const app = getApp();


Page({
  data: {
    sizes_finished : false,
    heights: {
      "picture_container": "",
    },
    widths: {
      "picture_container": "",
    },
    texts: {
      "icons_container": "",
      "profile_text": "Justin Jung",
    },
    font_sizes: {
      "profile_text": "4",
      "favorite" : "2",
      "coupons" : "2",
      "more" : "2"
    },
    pics : {
      "profile" : ""
    },
    tr_textID : ["event", "order", "faq", "customer", "support", "settings"], 
    width: "100",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    var that = this;
    that.sizes();

    //NOTE: I am not going to use fitText because it is too slow. Rather, I will hard code the values.
    /*
    //wait for sizes to update and userInfo to be uploaded
    let sizes_promise = this.waitfor(()=>{
      let sizes_finished = that.data.sizes_finished;
      let userinfo_finished = that.data.hasUserInfo;
      return sizes_finished && userinfo_finished;
    });
    //after sizes finished (the finished flag in data is set to true), then run fonts()
    sizes_promise.then(()=>{
      that.fitText("profile_text", 1);
      that.fitText("favorite", 1);
      that.fitText("coupons", 1);
      that.fitText("more", 1);
      //for each text in table rows, increase the font size
      let ids = that.data.tr_textID;
      ids.forEach(id => {
        that.fitText(id, 0.8);
      });
    });*/

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
         
      };
      

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    };
    
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  waitfor(conditionFunction){
    const poll = resolve => {
      console.log("function resolved");
      if (conditionFunction()){
        resolve();
      }
      else{
        setTimeout(_ => {poll(resolve);}, 40);
      }
    };
    return new Promise(poll);
  },
  //changes the size of the divs for dynamic sizing
  sizes(){
    //change size of picture container
    var that = this;
    //try uploading the height
    wx.createSelectorQuery().select('#picture_container').boundingClientRect(function(rect){
      var picture_container_width = String(rect.height);
      //upload the width data
      that.setData({
        "widths.picture_container": picture_container_width,
      });
    }).exec();
    //upload the height of the circle_icon
    wx.createSelectorQuery().select('.icon_container').boundingClientRect(function(rect){
      var circle_icon_width = String(rect.height);
      //upload the width data
      that.setData({
        "widths.icon_container": circle_icon_width,
        //[UPDATE] may be async race condition here
        "sizes_finished": true
      });
    }).exec();
    

  },
  /* takes id of the <text> and a scale (0-1), 1 is normal */
  fitText(id, scale){
    /* NOTE: THE TEXT CONTAINER OF TEXT MYID MUST BE "MYID-container"
        <TEXT> MUST NOT HAVE PREDEFINED WIDTH AND HEIGHT*/
    var that = this;
    //given id of container, maximize the font of the text
    let query = wx.createSelectorQuery();
    query.select('#' + id + '-container').boundingClientRect(function(rect){
      console.log("Getting parent size of " + id);
      let parent_height = rect.height;
      let parent_width = rect.width;
      console.log("Parent height: " + parent_height);
      console.log("Parent width: " + parent_width);
      that.fitText_helper(id, parent_height, parent_width, scale);  
    }).exec();
  },
  fitText_helper(id, parent_height, parent_width, scale){
    var that = this;
    wx.createSelectorQuery().select('#' + id).boundingClientRect(function(rect){
      let child_height = rect.height * (1 / scale);
      let child_width = rect.width * (1 / scale);
      console.log(id + " child height is: " + child_height);
      console.log(id + " child width is: " + child_width);
      //keep increasing font by 5px until the text goes beyond container
      if (child_height < parent_height && child_width < parent_width){
        
        //text is still smaller than container, increase font
        var current_font_size = that.data.font_sizes[id];
        if (current_font_size === undefined){
          //initialize our font size to 10px
          let font_size_data = that.data.font_sizes;
          font_size_data[id] = "5";
          that.setData({"font_sizes" : font_size_data});
          current_font_size = that.data.font_sizes[id];
        }
        console.log("Is my font-size still undefined? " + current_font_size === undefined);
        //increase font by 5px
        var new_font = String(parseInt(current_font_size) + 5);
        console.log(id + " increasing Font to " + new_font);
        //upload the new font
        var data = that.data.font_sizes;
        data[id] = new_font;
        that.setData({font_sizes : data}); 
        //call function again recursively
        that.fitText_helper(id, parent_height, parent_width, scale);
      }
      else{
        //text is too large
        //console.log("Text is too large. Reducing font-size");
        //reduce font size by 5px
        var current_font_size = that.data.font_sizes[id];
        var new_font_size = String(parseInt(current_font_size) - 5);
        console.log(id + " reduced font size is: " + new_font_size);
        //upload the new font size
        var data = that.data.font_sizes;
        data[id] = new_font_size;
        that.setData({font_sizes : data});
        return;
      }
    }).exec();
  }

})


function set_picture(){
  //get the height of the profile container
  /*let query = wx.createSelectorQuery()
  console.log(typeof query);
  console.log(query.select('#picture_container').boundingClientRect());*/
  wx.createSelectorQuery().select('#picture_container').boundingClientRect(function(rect){
    console.log(rect.height);
    //set the width of the height to something else
    rect.width = "20px";
    console.log(rect.width);
  }).exec();

}

//OLD CODE
/*
//change the font sizes
fonts(){
  //set the font-size to be width container (in vm) / #of characters
  //change picture_container font size
  //get the number of characters in text
  var that = this;
  //set the fontSize of the container
  this.set_fontSize("text_container", that.data.texts.profile_text.length);
},
//given id of element, num of chars, we 
// 1) calculate width of element in (vm) 2) divide by numChars 3) set font-size using vm
//NOTE: WE do not take into account the height of font being larger than the container.
set_fontSize(id, numChars){
  console.log("Num Chars: " + numChars);
  var that = this;
  wx.getSystemInfo({
    success: (result) => {
      let total_width = result.screenWidth;
      console.log("Total width(px): " + total_width);
      wx.createSelectorQuery().select('#' + id).boundingClientRect(function (rect){
        console.log("Width selected");
        //get the width of the id container
        let width = rect.width;
        console.log("Width of container(px): " + width);
        
        //this is the width (in vm) of id container
        let vw_width = width / total_width * 100;
        let vw_font_size = vw_width / numChars;
        console.log("Font Size (vw): " + vw_font_size);
        //upload the font size of the container


      }).exec();
    },
  });
},*/

