/**
 */
Page({

  /**
   * Page initial data
   */
  data: {
   categoryTabs: [{title: "All"}, {title: "Beijing"}, {title:"Yunan Farm"}, {title: "Sichuan Panda"}],
   categoryActiveIndex: 0,
   resultsData: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    //Change the active index if the active index is manually set in the global data
    try{
      let globalCategoryActiveIndex = this.globalData.categoryActiveIndex;
      this.setData({
        categoryActiveIndex: globalCategoryActiveIndex
      });
    }
    catch(err){
      //If categoryActiveIndex is null, throws err.
      //Global active index not set- do nothing. 
    };
    
    //Query the productArray for the given category title
    let categoryTitle = this.data.categoryTabs[this.data.categoryActiveIndex].title;
    let productsResponse = await wx.cloud.callFunction({
      name: "getProductsArray",
      data: {
        category: categoryTitle
      }
    })
    let products = productsResponse.result.products.data;
    
    //Upload our products array into the page data
    this.setData({
      productArray: products
    });

    /* Deprecated- will pass the array of search objects, not search titles 
    let productTitles = products.map(productObj => productObj.title);
    this.setData({
      resultsData: productTitles 
    }); */


    

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
  selectResult: function(e){
    console.log("RESULT SELECTED");
    console.log(e);
  }
})