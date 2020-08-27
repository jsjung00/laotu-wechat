// components/mySearchBar.js
/**
 * parmeters: searchResultsObjects, isNavigator, type
 */
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    focus: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: 'Search'
    },
    value: {
      type: String,
      value: ''
    },
    search: {
      // Optional function that returns a promise. See wechat searchbbar for more details
      type: Function,
      value: null
    },
    throttle: {
      // 500ms内只会调用一次search函数
      //CHANGE TO 0 in order to solve race condition problems
      type: Number,
      value: 0
    },
    cancelText: {
      type: String,
      value: 'Cancel'
    },
    cancel: {
      type: Boolean,
      value: true
    },
    searchResultsData: {
      //An array of strings of the search results
      type: Array,
      value: []
    },
    isNavigator: {
      //[REQUIRED] Parent page should pass is this boolean to determine whether or not the search bar should redirect to the searchPage
      type: Boolean
    },
    searchObjectsArray: {
      //[REQUIRED] An array of search result objects that contain the ID and title and other descriptors
      //ex: [{"_id" : "product1", "title" : "Organic Carrots"}, {}] 
      type: Array
    },
    type: {
      //[REQUIRED] Either "product" or "event"
      type: String
    }
  },
  data: {
    result: [], // 搜索结果,
    topSearchResults: [] //top five matching search results to the user's input. Contains strings
  },

  /* @ts-ignore */
  lastSearch: Date.now(),
  lifetimes: {
    // @ts-ignore
    attached() {
      var that = this;
      
      // @ts-ignore
      if (this.data.focus) {
        this.setData({
          searchState: true
        });
      }

      //If the searchbar is not a navigator (aka on the searchPage), should immediately be focused and in searchState === true
      if (!this.data.isNavigator){
        this.setData({
          searchState: true
        });

      }

      


      //Add our default search function. If user adds own search function to parameter, default will be overridden
      var defaultSearch = function (value) {
        
        //Should return a promise containing an array of result values
        //Lowercase all of user input so search results are not case sensitive
        let userInput = value.toLowerCase();
       
        //Get the array of possible search results objects
        let searchResultsObjects = that.data.searchObjectsArray;
        //Get the array of possible search results (each object contains just the title and the unique ID)
        let searchResultsData = searchResultsObjects.map(function(obj){
          return {
            title: obj.title,
            id: obj._id
          }
        });
       
        if (searchResultsData.length < 1){
          //Developer did not enter enough search results in to the component
          console.error("Forgot to add possible search results to the component");
        }

        /*Search result generation: find all results that match the first n letters of the input- if none are found, try n-1.
        If not a single letter matches, return an array containing text ["Could not find matching results."] */
        let numChars = userInput.length;
        if (numChars < 1){
         
          //User backspaced all the way, should hide input
          that.setData({
            searchState: false
          });
          //Return an empty array so that no search results pop up
          return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([])
            }, 200)
          }); 
        }
        var matchResults = [];
        for (let n = numChars; n > 0 ; n--){
          //Try getting only results where the first n letters match. Continue to n-1, n-2... 1 letters match
          let userInputSubStr = userInput.substring(0, n);
          //Expect an array as a return value from filter
          matchResults = searchResultsData.filter(function(res){
            //Lower case the result string so it is not case sensitive
            let lowerRes = res.title.toLowerCase(); 
            return lowerRes.startsWith(userInputSubStr);
          });
          if (matchResults.length > 0){
            //Got results that matches the first n chars
            break;
          }
          else{
            //Didn't get any results that match the first n chars. Continue...
          }
        }
        
        //If there are no match results, return an array with a certain text
        if (matchResults.length < 1){
          matchResults = [{title: "Could not find matching results.", id: ""}];
        }

        //Limit to max 10 match results
        matchResults = matchResults.slice(0,10);
        console.log("matchResults: ", matchResults);

        //Create our array of objects that will be used for the searchbar
        let matchResultsObjects = matchResults.map(function(res, index){
          return ({text: res.title, value: index + 1, id: res.id});
        });
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(matchResultsObjects)
            }, 200)
        });
      }
      this.setData({
        search: defaultSearch
      });
    },
    ready() {
      console.log(this.data.type);
    }

  },
  methods: {
    clearInput() {
      console.log("Clear Input called");
      // @ts-ignore
      this.setData({
        value: '',
        focus: true,
        result: []
      }); // @ts-ignore

      this.triggerEvent('clear');
    },

    // @ts-ignore
    inputFocus(e) {
      console.log("inputFocus called");
      // this.setData({
      //     searchState: true
      // })
      // @ts-ignore
      //If the search bar is a navigator, it should do nothing here
      if (!this.data.isNavigator){
        this.triggerEvent('focus', e.detail);
      }
      
    },

    // @ts-ignore
    inputBlur(e) {
      console.log("inputBlur called");
      this.setData({
        focus: false
      });
      this.triggerEvent('blur', e.detail);
    },

    showInput() {
      console.log("showInput called");
      //If the search bar is a navigator, it should do nothing here
      if (!this.data.isNavigator){
        this.setData({
          focus: true,
          searchState: true
        });
      }
    },

    hideInput() {
      console.log("Hide input is called");
      this.setData({
        searchState: false
      });
    },

    // @ts-ignore
    inputChange: function(e) {
      var that = this;
      
      this.setData({
        value: e.detail.value
      });
      this.triggerEvent('input', e.detail);
      
      
      if (Date.now() - this.lastSearch < this.data.throttle) {
        return;
      }


      //This prevents any input from triggering if search is not a function in the paramters
      if (typeof this.data.search !== 'function') {
        return;
      }
      
      //Wait for the searchObjectsArray to be initialized before we call the search function
      var checkSearchObjectsLoaded = function(){
        return new Promise(function(resolve, reject){
          (function waitForArray(){
            if (that.data.searchObjectsArray.length > 0){
              return resolve();
            }
            else{
              //Continually loop until the data is set
              setTimeout(waitForArray, 250);
            }
          })();
        });
      }
      checkSearchObjectsLoaded()
        .then(function(){
          //searchObjectsArray is fully loaded- call our search function
          that.lastSearch = Date.now();
          that.timerId = setTimeout(() => {
            //Calls my search function
            
            that.data.search(e.detail.value).then(json => {
              console.log("result is: ", json);
              that.setData({
                result: json
              });
            }).catch(err => {
              console.error('search error', err);
            });
          }, that.data.throttle);
        })
    },

    // @ts-ignore
    selectResult(e) {
      console.log("selectResult called");
      const {
        index
      } = e.currentTarget.dataset;
      const item = this.data.result[index];
      //Going to trigger the selectresult bind in the searchPage.wxml
      //Navigate to item page and pass the itemID
      this.triggerEvent('selectresult', {
        item
      });
    },
    tapped(){
      console.log("tapped called");
      var that = this;
      
      //Function is called when user clicks on the search bar. 
      //If search bar is supposed to act as a navigator (isNavigator === true), redirect to searchPage
      if (this.data.isNavigator){
        console.log("inside if navigator block");
       
        //Wait for searchObjectsArray. Function returns a promise only when the searchObjectsArray is not an empty array
        var checkSearchObjectsLoaded = function(){
          return new Promise(function(resolve, reject){
            var numLoops = 20;
            (function waitForArray(){
              if (that.data.searchObjectsArray.length > 0){
                //Data is set
                return resolve();
              }
              else{
                console.log("Looping for searchObjectsArray...");
                //Continually loop until the data is set
                setTimeout(waitForArray, 250);
                numLoops -= 1;
                if (numLoops < 1){
                  return reject("Failed to get searchObjectsArray within reasonable time.");
                }
              }
            })();
          });
        }
        console.log("Navigating to searchPage...");
        //Redirect to searchPage
        wx.navigateTo({
          //Can pass the list of search result objects to the searchPage
          url: '../../pages/searchPage/searchPage',
          success: async function(res){
            //Wait for searchObjectsArray to be sent (aka length > 0)
            try{
              await checkSearchObjectsLoaded();
            } catch{
              console.error("mySearchBar: check that searchObjectsArray was correctly passed as a parameter. Failed to get");
            }
            //Send our data to the searchPage
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              type: that.data.type,
              searchObjectsArray: that.data.searchObjectsArray
            });
          },
          fail: function(err){
            console.log("Failed to navigate to searchPage");
          }
        })
        //Clear the search page to the original state
        this.setData({
          searchState: false
        });
      }
      else{
        //Do nothing
        console.log("Not a navigator. Do nothing");
      } 
    }
  }
});
