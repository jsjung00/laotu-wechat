// miniprogram/pages/addUserInfo.js
var app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    countryCodes : ['+86','+80','+84','+87'], //represent the phone number country code used in picker
    countryCodeIndex : 0,
    regionCityDistrictArray:  ["北京市", "北京市", "东城区"], //first ['region', 'city', 'district']
    name: '',
    streetName : '',
    phoneNumber : '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
  },
  onChange : function(event){
    console.log(event.detail);
  },
  bindCountryCodeChange : function(e){
    //Called whenever the user clicks on a different index in the picker options. 
    //Upload code index for picker and also picker value
    console.log('picker country index', e.detail.value);
    this.setData({countryCodeIndex : e.detail.value});
    this.setData({phoneCode : this.data.countryCodes[e.detail.value]});
  },
  bindRegionChange: function (e) {
    //Called whenever user selects a certain region
    //Upload an array of ['Province','City','District']
    console.log('picker region values', e.detail.value)
    this.setData({
      regionCityDistrictArray: e.detail.value
    })
  },
  nameInputChange: function(e){
    //Called whenever the input is changed
    let name = e.detail.value;
    this.setData({name})
  },
  streetInputChange: function(e){
    //Called whenever the input is changed
    let streetName = e.detail.value;
    this.setData({streetName})
  },
  mobileInputChange: function(e){
    //Called whenever the input is changed
    let phoneNumber = e.detail.value;
    this.setData({phoneNumber})
  },
  submitForm : function(e){
    //Called when user clicks confirm button
    //Verify whether or not the input is valid
    var valid;
    let name = this.data.name;
    let streetName = this.data.streetName;
    let phoneNumber = this.data.phoneNumber;
    let phoneCode = this.data.countryCodes[this.data.countryCodeIndex];
    let regionCityDistrictArray = this.data.regionCityDistrictArray;

    console.log("phoneCode is: ", phoneCode);

    //Make sure that all input have some length
    if (name.length < 1 || streetName.length < 1 || phoneNumber.length < 1){
      valid = false;
    }
    //Make sure that phoneNumber only has digits
    else if (!/^\d+$/.test(phoneNumber)){
      valid = false;
    }
    else{
      valid = true;
    }
    //Display an error test if not valid
    if (!valid){
      wx.showToast({
        title : "Invalid/Missing Info",
        icon : 'none',
        duration: 1000
      })
    }
    else{
      //display success
      wx.showToast({
        title : "Updated",
        icon: "success",
        duration: 1000
      });
      //Upload the user's info to the cloud, under 'userInfo'
      wx.cloud.callFunction({
        name : 'addShippingInfo',
        data: {
          name : name, 
          streetName : streetName,
          regionCityDistrictArray : regionCityDistrictArray,
          phoneCode : phoneCode,
          phoneNumber : phoneNumber
        }
      });
    }
    
  }
  
})