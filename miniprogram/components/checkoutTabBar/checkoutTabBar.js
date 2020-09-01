// components/checkoutTabBar.js
Component({
  /**
   * Component properties
   */
  properties: {
    tabBarHeight : {
      type: Number
    },
    buttonMarginTop : {
      type: Number
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    attached: function(){
    },
    payClicked: function(){
      console.log("checkout in tabbar");
      this.triggerEvent('pay');
    }

  }
})
