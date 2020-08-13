// components/tabs.js

Component({
  /**
   * Component properties
   */
  properties: {
    //this is an array of objects that contain the tab "title" and
    //the "data" (which is also an array)
    tabs : {
      type: Array,
      value : []
    },
    activeTab : {
      type: Number,
      value: 0
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   * NOTE: In the future, consider having the pull data API as a method
   */
  methods: {
    onTabClick: function(e){
      const index = e.detail.index;
      console.log("Tab clicked");
      console.log("This is index: " + index + " and this is the type: " + (typeof index));
      this.setData({ 
        activeTab: index 
      })
    },
    onChange: function(e) {
      const index = e.detail.index;
      console.log("Something changed");
      this.setData({ 
        activeTab: index 
      })
    }
  }
})
