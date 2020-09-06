// miniprogram/pages/item.js
/**
 * To display the item, the page accepts the itemID through the wx.navigateTo(?itemid="exampleID")
 * For the favorite functionality, pull the isFavorited boolean from the cloud database (user's favlist)
 *    Any updates are made to the local page data boolean. When page closes, update the boolean to the cloud
 *    NOTE: the user's record id is in fact the openID. We query the user's record by using doc(openID)  
 * [Future speed]: Consider passing the item data from events so it doesn't have to query from the cloud (lazy load?)
 * 
 * Race condition: user clicks on heart and closes page before local boolean is uploaded.
 *  Solution: Have a rendering page until everything is loaded. Add a small delay before page closes
 * 
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
    circular: true,
    itemImages : [], //array of imgSrcs which are strings,
    pageLoaded : false, //changes to true once page loads
    //isFavorited : (will be set in setIsFavorited which is called onLoad)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;

    //Get the itemID and the type and set to local storage
    let itemID = options.itemid;
    //Upload the itemid
    this.setData({
      itemID : itemID
    });
    //Upload Item Data
    this.uploadItemData(itemID);
    //Check if the item is favorited and set the isFavorited data
    that.setIsFavorited(itemID);

    /*//Set pageLoaded to true
    console.log("Item page just loaded");
    that.setData({pageLoaded : true});*/

  },
  onUnload: function(){
    var that = this;
    //Consider having a timeout to prevent race condition with clickHeart updating local boolean and updateIsFavorited uploading
    //local boolean to cloud
    setTimeout(() => that.updateIsFavorited(), 500);
  },
  onShow : function(){
    //Called onLoad and also when page comes from higher layer
    //Check whether or not page just loaded- if not, uploadDotActive
    var that = this;
    if (this.data.pageLoaded){
      //Page did not just load
      console.log("Page did not just load. Race depends on onShow() coming before onLoad() finishes");
      //Upload dot active
      that.uploadDotActive();
    }  

  },
  onHide : function(){
    var that = this;
    //Consider having a timeout to prevent race condition with clickHeart updating local boolean and updateIsFavorited uploading
    //local boolean to cloud
    setTimeout(() => that.updateIsFavorited(), 500);
  },
  uploadItemData: function(itemID){
    var that = this;
    //Upload the item data that is necessary. Fetches data by calling wx.cloud query using id and type
    const db = wx.cloud.database({
      env: 'laotudata-laotu'
    });
    //Get the event info using the id
    db.collection('events').doc(itemID).get()
    .then(function(res){
      let title = res.data.title;
      let swiperImageUrls = res.data.swiperImageUrls;
      let descSummary = res.data.descSummary;
      let thumbUrl = res.data.thumbUrl;
      that.setData({
        title,
        swiperImageUrls,
        descSummary,
        thumbUrl
      });
    })
    .catch(err => console.error(err));
  },
  setIsFavorited: async function(itemID){
    //Function is called on load. Determines if the item is favorited from the cloud (checks if item in user's favitem list)
    // and sets to the local data
    //Parameters: itemID
    var that = this;
    //Wait for openID to be passed
    var openID = app.globalData.openid;
    var checkOpenID = function(){
      return new Promise(function(resolve, reject){
        var numLoops = 40;
        (function waitForOpenID(){
          openID = app.globalData.openid;
          if (openID == null){
            //Continually loop until the data is set
            setTimeout(waitForOpenID, 250);
            numLoops -= 1;
            //Only allow max 20 loops
            if (numLoops < 1){
              reject("setisFavorited(): openID took too long to set.");
            }
          }
          else{
            return resolve();
          }
        })();
      });
    }
    await checkOpenID();
    
    //Query the item using its id and type
    const db = wx.cloud.database({
      env: 'laotudata-laotu'
    });

    //Query from the userFavEvents
    const events = db.collection('userFavEvents');
    events.doc(openID).get()
      .then(function(res){
        //User's favlist has been init
        //Get user's list of favItems
        let favEvents = res.data.favEvents;
        //Check if item ID is in the favEvents
        if (favEvents == null){
          //favEvents is empty, current event is not favorited
          that.setData({isFavorited : false});
        }
        else{
          let isFavorited = favEvents.includes(itemID);
          console.log("isFav", isFavorited);
          that.setData({
            isFavorited
          });
        }
      })
      //Query throws an error when trying to get data from a non-existent record
      .catch(function(err){
        //Need to initialize the user and add an empty favProducts list
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
  },
  clickHeart: async function(){
    //Note: Heart logo can only be clicked after isFavorited is set 
    var that = this;
    console.log("clickHeart()");
    //Called when heart is clicked. Inverses the local page boolean
    //In order to prevent a race condition where pull data from isFavorited before isFavorited is set, wait
    //until isFavorited != null. Therefore, I know that the user's cart has been init by setIsFavorited()
    var checkIsFavoritedSet = function(){
      return new Promise(function(resolve, reject){
        var numLoops = 20;
        (function waitForIsFavorited(){
          if (that.data.isFavorited == null){
            //Continually loop until the data is set
            setTimeout(waitForIsFavorited, 250);
            numLoops -= 1;
            //Only allow max 20 loops
            if (numLoops < 1){
              reject("clickHeart(): Is Favorited took too long to set.");
            }
          }
          else{
            return resolve();
          }
        })();
      });
    }
    //Wait for isFavorited to be set into the data
    await checkIsFavoritedSet();

    let pastIsFavorited = this.data.isFavorited;
    let isFavorited = !pastIsFavorited;
    this.setData({isFavorited});
  },
  onShareAppMessage: function (shareParams) {
    console.log("function onShareAppMessage")
    console.log(shareParams)
  },
  updateIsFavorited: function(){
    console.log("updateIsFav()");
    //Function called on page close. Gets current isFavorited boolean and updates the user's fav item list
    //Return immediately if itemID or itemType were not set and no changes were made
    if (this.data.itemID == null){
      console.log("itemID not set before page close: isFavorited not set, no changes were made.");
      return;
    }
    let itemID = this.data.itemID;
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
    else if (isFavorited === false){
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
    else {
      console.log("User closed page before isFavorited set. No changes were made.");
    }
  }  
})