module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ({

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
      value: '搜索'
    },
    value: {
      type: String,
      value: ''
    },
    search: {
      // 返回Promise的函数
      // @ts-ignore
      type: Function,
      value: null
    },
    throttle: {
      // 500ms内只会调用一次search函数
      type: Number,
      value: 500
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    cancel: {
      type: Boolean,
      value: true
    }
  },
  data: {
    result: [] // 搜索结果

  },

  /* @ts-ignore */
  lastSearch: Date.now(),
  lifetimes: {
    // @ts-ignore
    attached() {
      // @ts-ignore
      if (this.data.focus) {
        this.setData({
          searchState: true
        });
      }
<<<<<<< HEAD
=======

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
        //Get the array of possible search result titles
        let searchResultsTitles = searchResultsObjects.map(obj => obj.title);
       
        if (searchResultsTitles.length < 1){
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
          matchResults = searchResultsTitles.filter(function(res){
            //Lower case the result string so it is not case sensitive
            let lowerRes = res.toLowerCase(); 
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
        
        //Upload the top 5 matching search results
        let topSearchResults = matchResults.slice(0, 5);
        that.setData({
          topSearchResults
        });
        
        //If there are no match results, return an array with a certain text
        if (matchResults.length < 1){
          matchResults = ["Could not find matching results."];
        }

        //Create our array of objects that will be used for the searchbar
        let matchResultsObjects = matchResults.map(function(res, index){
          return ({text: res, value: index + 1});
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
      
>>>>>>> parent of 5765083... fixed search bar. Now I need to transmit type to the searchPage
    }

  },
  methods: {
    clearInput() {
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
      // this.setData({
      //     searchState: true
      // })
      // @ts-ignore
      this.triggerEvent('focus', e.detail);
    },

    // @ts-ignore
    inputBlur(e) {
      this.setData({
        focus: false
      });
      this.triggerEvent('blur', e.detail);
    },

    showInput() {
      this.setData({
        focus: true,
        searchState: true
      });
    },

    hideInput() {
      this.setData({
        searchState: false
      });
    },

    // @ts-ignore
    inputChange(e) {
      this.setData({
        value: e.detail.value
      });
      this.triggerEvent('input', e.detail);

      if (Date.now() - this.lastSearch < this.data.throttle) {
        return;
      }

      if (typeof this.data.search !== 'function') {
        return;
      }

      this.lastSearch = Date.now();
      this.timerId = setTimeout(() => {
        this.data.search(e.detail.value).then(json => {
          this.setData({
            result: json
          });
        }).catch(err => {
          console.error('search error', err);
        });
<<<<<<< HEAD
      }, this.data.throttle);
=======
      }
      checkSearchObjectsLoaded()
        .then(function(){
          //searchObjectsArray is fully loaded- call our search function
          that.lastSearch = Date.now();
          that.timerId = setTimeout(() => {
            //Calls my search function
            
            that.data.search(e.detail.value).then(json => {
            
              that.setData({
                result: json
              });
            }).catch(err => {
              console.error('search error', err);
            });
          }, that.data.throttle);
        })
>>>>>>> parent of 5765083... fixed search bar. Now I need to transmit type to the searchPage
    },

    // @ts-ignore
    selectResult(e) {
<<<<<<< HEAD
=======
      console.log("selectResult called");
      //Pass the item that was selected and the top 5 search results to the parent component (whatever page it is on)
>>>>>>> parent of 5765083... fixed search bar. Now I need to transmit type to the searchPage
      const {
        index
      } = e.currentTarget.dataset;
      const item = this.data.result[index];
<<<<<<< HEAD
      this.triggerEvent('selectresult', {
        index,
        item
=======

      const topSearchResults = this.data.topSearchResults;

      this.triggerEvent('selectresult', {
        item,
        topSearchResults
>>>>>>> parent of 5765083... fixed search bar. Now I need to transmit type to the searchPage
      });
    }

  }
});

/***/ })

/******/ });