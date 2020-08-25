// components/itemDesc.js
Component({
  /**
   * Component properties
   */
  properties: {
    type: {
      //either "product" or "event"
      type: String
    }
  },

  /**
   * Component initial data
   */
  data: {

  },
  options : {
    /* the item page can change the size of the itemDesc container */
    styleIsolation: 'isolated',
    virtualHost: true
  },
  /**
   * Component methods
   */
  methods: {

  }
})
