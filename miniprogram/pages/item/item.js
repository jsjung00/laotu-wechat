// miniprogram/pages/item.js
/**
 * For the favorite functionality, pull the isFavorited boolean from the cloud database (user's favlist)
 * Any updates are made to the local page data boolean. When page closes, update the boolean to the cloud
 * Loading note: takes a while for isFavorited to be set.  
 * [Future speed]: Consider passing the item data from events so it doesn't have to query from the cloud (lazy load?)
 */
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 500,
    vertical: false,
    itemImages : [], //array of imgSrcs which are strings
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    //Set the tabbar Height to pass into the CustomTabBar component
    let tabbarHeight = app.globalData.tabbarHeight;
    this.setData({
      tabbarHeight
    });

    //Get the itemID and the type
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(data){
      let id = data.id;
      let type = data.type;
      //upload the item type and id
      that.setData({
        itemID : id,
        itemType: type
      });
      //upload Item Data
      //DEV: Note the race condition. The item data needs to be uploaded before the page is shown.
      that.uploadItemData(id, type);
      //Check if the item is favorited and set the isFavorited data
      that.setIsFavorited(id, type);
    });

  },
  onUnload: function(){
    //Update the isFavorited boolean
    this.updateIsFavorited();
  },
  uploadItemData: function(itemID, type){
    var that = this;
    //Upload the item data that is necessary. Fetches data by calling wx.cloud query using id and type
    const db = wx.cloud.database({
      env: 'laotudata-laotu'
    });

    if (type === "product"){
      //Get the product info using the id
      db.collection('products').doc(itemID).get()
        .then(function(res){
          let priceStr = res.data.priceStr;
          let title = res.data.title;
          let itemImages = res.data.swiperImageUrls;
          let itemCategories = res.data.itemCategories;
          let descSummary = res.data.descSummary;
          console.log(itemImages);
          //Upload the data to the page data
          that.setData({
            priceStr : priceStr,
            title: title,
            itemImages: itemImages,
            itemCategories: itemCategories,
            descSummary : descSummary 
          });
        })
        .catch(err => console.error(err));
    }
    else if (type === "event"){
      //Get the event info using the id
      db.collection('events').doc(itemID).get()
      .then(function(res){
        let priceStr = res.data.price;
        let title = res.data.title;
        let itemImages = res.data.swiperImageUrls;
        let itemCategories = res.data.itemCategories;
        let descSummary = res.data.descSummary;
        that.setData({
          priceStr: priceStr,
          title: title,
          itemImages : itemImages,
          itemCategories: itemCategories,
          descSummary : descSummary
        });
      })
      .catch(err => console.error(err));
    }
    else{
      console.error("Need to insert either 'product' or 'event' into the searchBar parameter");
    }
  },
  setIsFavorited: function(itemID, type){
    //Parameters: receive itemID and type of item ('product' or 'event')
    var that = this;
    //DEVNOTE: globalData retrieval may be slow (maybe race condition?)
    var openID = app.globalData.openid;

    console.log("setIsFavorited()");
    //Function is called onLoad and sets the isFavorited boolean to the page
    
    //Query the item using its id and type
    const db = wx.cloud.database({
      env: 'laotudata-laotu'
    });

    if (type === 'product'){
      //Assert that openID has been defined
      if (openID.length < 1){
        throw new Error("setIsFavorited(): race condition. OpenID has not been fetched from global data");
      }
      //Query from the userFavProducts
      const products = db.collection('userFavProducts');
      products.doc(openID).get()
        .then(function(res){
          //User's favlist has been init
          //Get user's list of favItems
          let favProducts = res.data.favProducts;
          //Check if item ID is in the favProducts
          let isFavorited = favProducts.includes(itemID);
          console.log("isFav", isFavorited);
          that.setData({
            isFavorited
          });
        })
        .catch(function(err){
          //Need to initialize the user and add an empty favProducts list
          products.add({
            data: {
              _id: openID,
              favProducts: []
            }
          })
            .then(res => console.log("Successfully initialized user"))
            .catch(err => console.error("Failed to initialize user", err));
          //Set the isFavorited to page data as false
          that.setData({
            isFavorited: false
          })
        });

    } 
    else if (type === 'event'){
      //Assert that openID has been defined
      if (openID.length < 1){
        throw new Error("setIsFavorited(): race condition. OpenID has not been fetched from global data");
      }
      //Query from the userFavProducts
      const events = db.collection('userFavEvents');
      events.doc(openID).get()
        .then(function(res){
          //User's favlist has been init
          //Get user's list of favItems
          let favEvents = res.data.favEvents;
          //Check if item ID is in the favProducts
          let isFavorited = favEvents.includes(itemID);
          console.log("isFav", isFavorited);
          that.setData({
            isFavorited
          });
        })
        .catch(function(err){
          //Need to initialize the user and add an empty favEvents list
          events.add({
            data: {
              _id: openID,
              favEvents: []
            }
          })
            .then(res => console.log("Successfully initialized user"))
            .catch(err => console.error("Failed to initialize user", err));
          //Set the isFavorited to page data as false
          that.setData({
            isFavorited: false
          })
        });
    }
    else{
      console.error("In setIsFavorited(): should only have either 'event' or 'product' type available");
    }
  },
  clickHeart: function(){
    console.log("clickHeart()");
    //Function is called when heart is clicked. Inverses the local page boolean
    let pastIsFavorited = this.data.isFavorited;
    let isFavorited = !pastIsFavorited;
    this.setData({isFavorited});
  },
  updateIsFavorited: function(){
    //Function called on page close. Gets current boolean and updates the user's fav item list
    //Check that itemID and type is set
    if (this.data.itemID == null || this.data.itemType == null){
      console.log("updateIsFavorited() race condition: itemID and type not set before page closes");
    }
    let itemID = this.data.itemID;
    let itemType = this.data.itemType;
    let isFavorited = this.data.isFavorited;
    let openID = app.globalData.openid;
    //Check that openID is valid
    if (openID == null){
      console.error("race condition: openID is not set");
    }
    let db = wx.cloud.database({env: 'laotudata-laotu'});
    let _ = db.command;
    if (isFavorited === true){
      //If itemID doesn't exist in user's fav list, add itemID to list
      //Get the current fav list
      if (itemType === 'product'){
        db.collection('userFavProducts').doc(openID).get()
          .then(function(res){
            //add item if doesn't exist
            var favProducts = res.data.favProducts;
            if (!favProducts.includes(itemID)){
              //Item doesn't exist, add itemID to the end of the array
              db.collection('userFavProducts').doc(openID).update({
                data: {
                  favProducts : _.push(itemID) 
                }
              });
            }
            //item exists, do nothing
          })
          .catch(err => console.error(err));
      } 
      else if (itemType === 'event'){
        db.collection('userFavEvents').doc(openID).get()
          .then(function(res){
            //add item if doesn't exist
            var favEvents = res.data.favEvents;
            if (!favEvents.includes(itemID)){
              //Item doesn't exist, add itemID to the end of the array
              db.collection('userFavEvents').doc(openID).update({
                data: {
                  favEvents : _.push(itemID) 
                }
              });
            }
            //item exists, do nothing
          })
          .catch(err => console.error(err));
      }
      else{
        console.error("Should only be either 'product' or 'event");
      }
    }
    else if (isFavorited === false){
      //If itemID exists in fav Items list, delete
      if (itemType === 'product'){
        db.collection('userFavProducts').doc(openID).get()
          .then(function(res){
            var favProducts = res.data.favProducts;
            if (favProducts.includes(itemID)){
              //Item exist, delete itemID from favList
              const itemIndex = favProducts.indexOf(itemID);
              favProducts.splice(itemIndex, 1);
              db.collection('userFavProducts').doc(openID).update({
                data: {
                  favProducts : favProducts 
                },
                fail: function(err){
                  console.error(err)
                }
              });
            }
            //item not in list, do nothing
          })
          .catch(err => console.error(err));
      } 
      else if (itemType === 'event'){
        //If item is in fav list, delete item
        db.collection('userFavEvents').doc(openID).get()
          .then(function(res){
            var favEvents = res.data.favEvents;
            if (favEvents.includes(itemID)){
              //Item exist, delete itemID from favList
              const itemIndex = favEvents.indexOf(itemID);
              favEvents.splice(itemIndex, 1);
              db.collection('userFavEvents').doc(openID).update({
                data: {
                  favEvents : favEvents 
                },
                fail: function(err){
                  console.error(err)
                }
              });
            }
            //item not in list, do nothing
          })
          .catch(err => console.error(err));
      }
      else{
        console.error("Should only be either 'product' or 'event");
      }

    }
    else {
      console.error("Race condition: isFavorited is not set from onLoad before page close");
    }
  }

  
})