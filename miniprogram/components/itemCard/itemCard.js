// components/itemCard.js
Component({
  /**
   * Component properties
   */
  options : {
    multipleSlots : true,
    virtualHost : false, //true allows the component to grow to the container of the parent (parent container has display: flex)
    styleIsolation : 'apply-shared' //parent page can change the CSS
  },
   properties: {
    imageSrc : {
      type: String,
      value: "https://www.jessicagavin.com/wp-content/uploads/2019/02/carrots-7-1200.jpg"
    },
    /*style: {
      type: String //see virtualHost documentation. Allows parent to pass in style through databinding
      //<itemCard style=""></itemcard>
    }*/
  },
  //externalClasses : ['class'],

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {

  }
})
