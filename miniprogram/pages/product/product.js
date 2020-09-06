/** In order to display the products for a specific category, receives an object from 'getCategoryProducts' which returns
 *    an array of objects that contain 'categoryName' and 'productObjs'   
 *    [{'categoryName' : 'All', 'productObjs' : []}, {'categoryName':'Featured', 'productObjs' : []}, {}]
 *    categoryNames are the values defined by the collection in 'productPageData'
 *    and productObj is an array of product objects of products in that category
 * To control skeleton loading, when categoryProductsArray is set, loading=false
 */
var app = getApp();
 Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex : 0,
    /*loading: true*/
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    var that = this;

    let productsResponse = await wx.cloud.callFunction({
      name: "getCategoryProducts"
    });
    console.log("productsResponse", productsResponse);
    //This is an array of objects which contain {categoryName: str, products : []}
    let categoryProductsArray = productsResponse.result.data;

    //Change the activeTabIndex if the global data specifies to display featured products
    if (app.globalData.displayFeaturedProductsTab === true){
      //Get the tab index for featured
      const featuredTabIndex = categoryProductsArray.findIndex(obj => obj.categoryName === 'Featured');
      //Set the default active tab to the featured tab
      that.setData({activeTabIndex : featuredTabIndex});
    } 


    //Upload the categoryProductsArray to the page
    this.setData({categoryProductsArray});

    //Pass in the array of all productObjects to the searchbar 
    let _productArray = categoryProductsArray.filter(obj => obj.categoryName === 'All');
    let productArray = _productArray[0].products;
    console.log("productArray", productArray);
    this.setData({productArray : productArray});
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
  clickedProductCard: function(e){
    //Called when user clicks a specific product card
    let productID = e.currentTarget.dataset.productid;
    if (productID == null){
      throw new Error("clickedProductCard: product object could not deliver ID");
    }
    //Navigate to the item page and pass the productID
    wx.navigateTo({
      url: "../item/item",
      //Pass in the productID
      success: function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', {id : productID, type : "product"});
      },
      fail: function(err){
        console.error("Failed to pass productID to itempage from index", err);
      }
    });
  }
})