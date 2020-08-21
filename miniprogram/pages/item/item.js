// miniprogram/pages/item.js
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
    console.log(this.data.tabbarHeight);

    //Get the itemID and the type
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(data){
      let id = data.id;
      let type = data.type;
      console.log("id is: ", id, "type is ", type);
      that.uploadItemData(id, type);

    });

    //Upload the item images


  },
  uploadItemData: function(id, type){
    var that = this;
    //Upload the item data that is necessary. Fetches data by calling wx.cloud query using id and type
    const db = wx.cloud.database({
      env: 'laotudata-laotu'
    });

    if (type === "product"){
      //Get the product info using the id
      db.collection('products').doc('product1').get()
        .then(function(res){
          let priceStr = res.data.price;
          let title = res.data.title;
          let itemImages = res.data.swiperImageUrls;
          console.log(itemImages);
          //Upload the data to the page data
          that.setData({
            priceStr : priceStr,
            title: title,
            itemImages: itemImages
          });
        })
        .catch(err => console.error(err));
    }
    else if (type === "event"){
      //Get the event info using the id
      db.collection('events').doc(id).get()
      .then(function(res){
        console.log(res.data);
      })
      .catch(err => console.error(err));
    }
    else{
      console.error("Need to insert either 'product' or 'event' into the searchBar parameter");
    }
  }
  
})