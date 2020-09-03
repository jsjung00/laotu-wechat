/**
 * Parameters: isBack (optional) - if true, only render the back sign without any button
 *              isHome (optional) - if true, renders the Home Button [UGLY: DO NOT USE]
 *              isBoth (optional) - if true, renders the capsule button contaning home and back
 *              title (optional) - string.
 */

var app = getApp();
Component({
  properties: {
    title: {
      type: String,
    },
    statusHeight: {
      type: Number,
    },
    navHeight : {
      type: String,
    },
    capsuleContainerWidth : {
      type : String,
    },
    capsuleWidth : {
      type : String
    },
    capsuleHalfWidth : {
      type: String
    },
    isBack : {
      type: Boolean,
      value: false,
    },
    isHome : {
      type: Boolean,
      value: false,
    },
    isBoth : {
      type: Boolean,
      value: false,
    }
  },
  lifetimes : {
    attached: function(){
      this.uploadSizes();
    }
  },
  methods : {
    uploadSizes : function(e){
      console.log("uploadSizes()");
      //Called when component is attached to page
      //Upload the statusHeight and the capsuleWidth
      let statusHeight = app.globalData.statusHeight;
      let capsuleWidth = app.globalData.capsuleWidth;
      this.setData({
        statusHeight : statusHeight,
        capsuleWidth : capsuleWidth
      });
    }  
  }
});
