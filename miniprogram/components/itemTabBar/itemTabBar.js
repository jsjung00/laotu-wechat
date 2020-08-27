// components/itemTabBar.js
/**
 * When the component is attached, get the number of items in the user's cart. Set numItems into the local data to render
 * Each time add to cart is clicked, localdata number will be updated and itemID will be uploaded to the cloud database 
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
      //No action: number of items in the shopping cart (Parent should not pass value- component will determine by itself)
      type: Number
    },
    itemType: {
      //Required: parent will pass the item type ('product' or 'event') 
      type: String
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
      //Warning: async function.
      
      //Wait to receive itemType parameter from parent page (item.wxml)
      var that = this;
      var checkItemTypeReceived = function(){
        return new Promise(function(resolve, reject){
          var numLoops = 40;
          (function waitForItemType(){
            if (that.data.itemType == null){
              //Continually loop until the data is set
              console.log("Looping- waiting for itemType...");
              setTimeout(waitForItemType, 100);
              numLoops -= 1;
              //Only allow max 20 loops
              if (numLoops < 1){
                reject("itemTabBar attached(); itemType took too long to be received.");
              }
            }
            else{
              return resolve();
            }
          })();
        });
      }
      await checkItemTypeReceived();
      
      //Get the number of cart items from the cloud and set numItems to the local component data
      const db = wx.cloud.database({
        env: 'laotudata-laotu',
        traceUser: true
      });
      //Get the openID
      const openID = app.globalData.openid
      //Query the user's cart and get the number of items in the cart
      db.collection('userCart').where({'_openid' : openID}).get()
        .then(function(res){
          //Check that the user's record is unique
          if (res.data.length != 1){
            throw new Error("User cart DNE or multiple records exist under user ID");
            return;
          }
          console.log("dat is: ", res.data);
          let cartEvents = res.data[0].cartEvents;
          let cartProducts = res.data[0].cartProducts;
          let numItems = cartEvents.length + cartProducts.length;
          //Upload the numItems to the page data
          that.setData({numItems});
          console.log("Num of Cart Items set!");
        })
        .catch(
          (err) => console.error("Failed to get userCart ", err)
        );
    }
  },

  /**
   * Component methods
   */
  methods: {

  }
})
