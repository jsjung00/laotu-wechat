/** In order to display the products for a specific category, receives an object from 'getCategoryProducts' which returns
 *    an array of objects that contain 'categoryName' and 'productObjs'   
 *    [{'categoryName' : 'All', 'productObjs' : []}, {'categoryName':'Featured', 'productObjs' : []}, {}]
 *    categoryNames are the values defined by the collection in 'productPageData'
 *    and productObj is an array of product objects of products in that category 
 */
Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex : 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    
    let productsResponse = await wx.cloud.callFunction({
      name: "getCategoryProducts"
    });
    console.log(productsResponse);
    //This is an array of objects which contain {categoryName: str, products : []}
    let categoryProductsArray = productsResponse.result.data;
    //Upload the categoryProductsArray to the page
    this.setData({categoryProductsArray});
  },
  clickCategoryTab: async function(event){
    //Get the tab's index and change the active tab
    let newCategoryActiveIndex = event.currentTarget.dataset.index;
    this.setData({
      categoryActiveIndex: newCategoryActiveIndex
    });
    //Using category title, call cloud function to reset tableData
    let categoryTitle = this.data.categoryTabs[newCategoryActiveIndex].title;
    let productsResponse = await wx.cloud.callFunction({
      name: "getProductsArray",
      data: {
        category: categoryTitle
      }
    });
   
    var products = productsResponse.result.products.data;
    //If products is undefined, change to [] instead
    if (!products){
      products = [];
    }
    
    //Upload our products array into the page data
    this.setData({
      productArray: products
    });
  },
  productClicked: function(e){
    //Function is called when the user clicks on the product card
    //Navigate to the item page
   
    let type = 'product';
    let itemID = e.currentTarget.dataset.itemid;
    console.log("event itemID is", itemID);

    wx.navigateTo({
      url: '../item/item',
      success: function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', {type: type, id: itemID});
      },
      fail: function(err){
        console.error(err);
      }
    });
  },
  onTabChange: function(e){
    
  }
})