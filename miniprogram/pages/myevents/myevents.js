/** Developer Notes:
 * Once pull from cloud collection, each event is an object that comes preloaded with id, title, ect. 
 * Then, given an array of favEventId's, each event object is given a isFavorited : boolean that is determined by the 
 * array of favEventId's. The boolean is used to determine whether or not to show a full heart or not.  
 */

const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabs: [],
    activeTab : 0,
    heights: {},
    widths: {
      favImgContainer : "0"
    },
    blankHeartSrc : "https://toppng.com/uploads/preview/heart-icon-transparent-icon-symbol-love-black-11553480202wbkavsmiom.png",
    clickHeartSrc : "https://w7.pngwing.com/pngs/776/399/png-transparent-heart-computer-icons-red-heart-icon-dark-border-love-heart-desktop-wallpaper.png",
    currHeartSrc : "https://toppng.com/uploads/preview/heart-icon-transparent-icon-symbol-love-black-11553480202wbkavsmiom.png",
    fillHeartSrc: '../../img/like-filled.svg',
    unfillHeartSrc: '../../img/like-unfilled.svg'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    //Get and upload the tabsData
    wx.cloud.callFunction({
      name: 'getEventTabData',
      success: function(res){
        console.log(res.result.tabsData);
        that.setData({
          tabs : res.result.tabsData
        });
        console.log(res.result.tabsData);
      },
      fail: console.error
    });

    //Depreacted, takes too long, used static div sizes instead- Try to get the height of favImg-container
    //this.favoriteSize();

    

  


    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onTabClick(e) {
    const index = e.detail.index;
    console.log("tab clicked");
    this.setData({ 
      activeTab: index 
    })
  },

  onChange(e) {
    const index = e.detail.index;
    console.log("Something changed");
    this.setData({ 
      activeTab: index 
    })
  },
  handleClick(e) {
      console.log("Handle Clicked");
  },
  clickHeart(e){
    let that = this;
    //get the current tab index
    let tabindex = e.target.dataset.index;
    //get the eventID
    let eventID = e.target.dataset.id;
    //inverse the isFavorited boolean that is stored in the page tabs
    let changedTabsData = this.data.tabs;
    //change the event data boolean
    changedTabsData[tabindex].data.find(event => event._id === eventID).isFavorited = 
      !changedTabsData[tabindex].data.find(event => event._id === eventID).isFavorited;
    //update the tabs data with the changed boolean
    this.setData({
      tabs: changedTabsData
    });

    //Add or delete the eventID from the user's favEvent list
    wx.cloud.callFunction({
      name: 'addFavEvent',
      data:{
        id: eventID
      },
      success: function(res){
        console.log(res);
      }
    });
  },
  uploadSizes(){
    let that = this;
    //make favImg-container square
    //get the height
    let query = wx.createSelectorQuery();
    query.select('#favImg-container').boundingClientRect(function(rect){
      console.log(rect);
      that.setData({
        'widths.favImgContainer' : String(rect.height)
      });
    }).exec(); 
  },
  favorited: function(event){
    let itemindex = parseInt(event.currentTarget.dataset.itemindex);
    let tabindex = parseInt(event.currentTarget.dataset.index);
    console.log(event.currentTarget.dataset);
    console.log("item index: " + itemindex + " tab index: " + tabindex);

    let tabs = this.data.tabs;
    let currentSrc = tabs[tabindex][1][itemindex].favSrc;
    
    //If current image is empty or blankheart, change to clickHeart and upload that event data 
    if (currentSrc === "" || currentSrc === this.data.blankHeartSrc){
      //change image source to the clicked heart
      tabs[tabindex][1][itemindex].favSrc = this.data.clickHeartSrc;
      //get the event data
      let eventData = this.data.tabs[tabindex][1][itemindex];
      //upload the event data to the favorites global data
      var favoriteEventsTabData = app.globalData.favoriteEventsTabData;
      favoriteEventsTabData[tabindex][itemindex] = eventData;
      app.globalData.favoriteEventsTabData = favoriteEventsTabData;
      this.setData({
        tabs
      });
    }
    else{
      //switch back to blankSrc
      //switch to clickSrc
      tabs[tabindex].data[itemindex].favSrc = this.data.blankHeartSrc;
      this.setData({
        tabs
      });
    }
  },
  navHandler: function(event){
    let that = this;
    let tabindex = event.currentTarget.dataset.index;
    let itemindex = event.currentTarget.dataset.itemindex;
    let navUrl = this.data.tabs[tabindex].data[itemindex].navUrl;
    //DEV NOTE: alternatively, we use some kind of url scheme such that the we can manually create the URL using indices
    

    //redirect to a specific page when the event row is clicked
    wx.switchTab({
      url: navUrl,
    });
  },
  initIsFavorited: function(){
    let numberTabs = this.data.tabs.length;
    var isFavorited = [];
    this.data.tabs.forEach(function(tabData){
      //for each tab, append an array that is of length # of table rows with all false
      var tabArray = []; 
      //init tabArray to be false for each item
      tabData.data.forEach(function(item){
        tabArray.push(false);
      }); 

      //add false array to isFavorited
      isFavorited.push(tabArray); 
    });
    
    //upload the isFavorited
    this.setData({
      isFavorited
    });
  },
  objectToArray: function(obj){
    let outerArray = Object.values(obj);
    var tabs = [];
    outerArray.forEach(function(o){
      let innerArray = Object.values(o);
      tabs.push(innerArray);
    });
    return tabs;
  },
  parseEventsData: function(){
    //pull the eventsData from the cloud and create two tabData objects that contain title of tab and the data (past and upcoming events)
    //then, it sets the data to the pageData
    const db = wx.cloud.database();
    const _ = db.command;
    
    //get the events data ordered chronologically
    const events = db.collection('events').orderBy('datetime', 'desc');
    //query events that are upcoming
    const upcomingEvents = events.where({
      datetime: _.gt(db.serverDate())
    });
    //query events that are past
    const pastEvents = events.where({
      datetime: _.lte(db.serverDate())
    });
    
    var that = this;
    //create the upcoming and past tabData
    upcomingEvents.get()
      .then(function(res){
        const upcomingData = res.data;
        //get the pastData
        pastEvents.get()
          .then(function(res){
            const pastData = res.data;
            //create our tabsData array object
            var tabs = [{
              title : "Upcoming",
              data : upcomingData 
            }, {
              title : "Past",
              data : pastData
            }];
            //upload to tabs
            that.setData({tabs});
            console.log("Events page tabs data set.");
          })
          .catch(err => console.error(err))
      })
      .catch(err => console.error(err));
  },
  favoriteSize: async function(){
    /*function is called when the image of the favoritedHeart is loaded
    upload the width of favoriteImg-container to make it a square */
    console.log("Function favorite size is called");
    let that = this;
    var continueLooping = true;
    var numLoops = 20;
    var waitTimeout;
    //Try to set get the height of the element- if fail, wait another 250ms before trying again
    while(continueLooping && numLoops > 0){
      //Decrease numLoops to allow max 5 seconds
      numLoops -= 1;
      console.log("Trying to get height.....");
      
      //Attempt to get height and set width
      let query = wx.createSelectorQuery();
      
      //convert callback to promise
      const queryPromise = () => {
        return new Promise((resolve, reject) => {
          query.select('#favImg-container').boundingClientRect(function(rect){  
            //Check that the callback actually got the rectangle
            if (!rect){
              console.log("Callback failed to get rect");
              reject("Failed to get rect");
            }
            else{
              //Set the width equal to the height
              that.setData({
                'widths.favImgContainer' : String(rect.height)
              });
              //Set the continueLooping to false to stop looping
              continueLooping = false;
              resolve("Resolved!");
            }
          }).exec();
        });
      }
      //Once the query is complete, we continue
      try{
        let _wait = await queryPromise();
        //Sucessfully commpleted callback
        console.log("successfully completed callback");
      }
      catch(err){
        //Promise failed- callback failed. Wait another 250ms
        await new Promise(resolve => {
          waitTimeout = setTimeout(() => {
            console.log("Waited 250ms");
            resolve("resolved waiting");
          }, 250);
        }); 
      }
      
      /*
      queryPromise()
        .then(() => {
          //successfully completed callback
          console.log("Sucessfully completed callback");
        })
        .catch(async () => {
          //Failed to complete callback- wait another 250ms
          console.log("Failed to complete callback");
          await new Promise(resolve => {
            waitTimeout = setTimeout(() => {
              console.log("Waited 250ms");
              resolve("resolved waiting");
            }, 250);
          }); 
        })*/
    }
    return;
  }
})