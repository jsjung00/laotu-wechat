// components/itemTabBar.js
/**
 * When the component is attached, it gets the number of items in the user's cart.
 * We set numItems to the component local data for the shopping cart icon to render with a quantity.
 * On addToCart(), increase numItems locally +=1 and will be updated and itemID will be uploaded to the cloud database 
 */
var app = getApp();
Component({
  /**
   * Component properties
   */
  properties: {
    tabbarHeight: {
      //Required: Parent will pass the height.
      type: Number
    },
    numItems : {
      //Required: number of items in the shopping cart. Parent will pass in the numItems
      type: Number, 
      observer: function(newVal, oldVal, changedPath){
        console.log("Received ", newVal);
        //Allows the component to re-render when the parent passes in a new numItems value
        this.setData({_numItems : newVal})
      }
    },
    _numItems : {
      //Copy of the value above. This value is set whenever numItems is set (passed from the parent).
      //This exists so there is not an infinite loop (see https://blog.csdn.net/zhangzeshan/article/details/83927582)
      type: Number
    },
    itemType: {
      //Required: parent will pass the item type ('product' or 'event') 
      type: String
    },
    isTabBarHidden : {
      //Required: Used to hide the component. Item page passes this 
      type: Boolean,
      observer: function(newVal, oldVal, changedPath){
        console.log("my old value is: ", oldVal);
        console.log("my new value is: ", newVal);
        //Get the new value and set _isTabBarHidden which is used to render the component
        this.setData({_isTabBarHidden : newVal})
      }
    },
    _isTabBarHidden : {
      // This is a (copy) of the variable above. Whenever isTabBarHidden is changed, its value will placed here
      //By default, tabBar is not hidden
      type: Boolean,
      value: false 
    }
  },

  /**
   * Component initial data
   */
  data: {
  
  },
  /* Component lifecycle */
  lifetimes: {
    ready: function(){ 
      console.log("Component is ready");
    },
    attached: async function(){
    }
  },

  /**
   * Component methods
   */
  methods: {
    addItem: function(e){
      //Function is called when the user clicks on the add to Cart button
      //Trigger the event "addToCart" in the parent page which should
      this.triggerEvent('addToCart');
    },
    handleContact: function(e) {
      console.log("function handleContact")
      console.log(e.detail.path)
      console.log(e.detail.query)
    },
    clickCartIcon : function(e){
      //Function is called when user clicks on the cart icon. Should redirect to shopping cart page
      console.log("clickCartIcon()");
      wx.navigateTo({
        url: '../../pages/shoppingCart/shoppingCart',
      });
    }
  }
})
