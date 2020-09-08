# laotu-wechat
The Laotu Wechat Miniprogram which lists events and products.

 ## Documentation:
 ### Pages (only used pages are listed)
 * checkout
    * Represents the checkout page which the user can navigate only from the shoppingcart page.
 * editShippingInfo
    * Represents the page where the user can edit the shipping info. Can be acccessed through the profile page or through the checkout page if the user clicks
      to edit the shipping info. Note the JS doc: the user can either edit his default shipping info which is stored in the cloud collection 'userInfo' or simply       edit the info for the order.
 * eventItem
    * Page that displays a specific event. Accessed when user navigates to a specific event. The equivalent is item.wxml
 * events
    * Displays all events.
 * favorites
    * Displays the users favorites, which is accessed through the cloud collection 'userFavEvents' and 'userFavProducts'
 * index
    * Displays the home page. Uses the collection 'featuredIDs' to figure out which events and products to display.
 * item
    * Displays a specific product. Contains itemTabBar which allows the user to view and add item to cart.
 * my orders
    * Displays the orders that the user has made. (NOTE: this functionality may not be working correctly. The relevant collection is 'userInfo'
 * product
    * Displays all of the product items.
 * profile
    * Contains various links to pages.
 * searchPage
    * Page is only opened when the user clicks on the searchBar component. Contains a search bar
 * shoppingCart
    * Contains users's items in the shopping cart. Navigates to checkout. Can be navigated from itemTabBar and item.wxml (popup)
 
 ### Components (only relevant components listed)
 * checkoutTabBar
    * Used in checkout.wxml. Will trigger payment
 * itemCard
    * A component that allows developer to easy create a product or event card.
 * itemTabBar
    * Used in item.wxml and can navigate to cart and trigger add to cart in item.js
 * mySearchBar
    * Used in product.wxml and also searchPage. If isNavigator is true, clicking on it will navigate to searchPage, which will have a searchBar.
 * navBar
    * Used to display a custom nav bar.
 * productCard
    * Similar to itemCard except fixed dimensions.
 
 ### Database
 * eventPageData
    * Contains one record of an array of strings that represent the category tab names to be displayed in events. Should always include 'All' and 'Featured'
 * events
    * Contains a list of records which represent event objects.
        * expirationDateTime is the last datetime of the event (if the current time is past that datetime, does not display)\
        * categories is an array of strings that will determine which categories the item should be displayed in
* featuredIDs
    * contains strings of IDs that is used by index to figure out which objects to display
* homePageData
    * contains swiper image urls
* orders
    * contains records of transaction orders
* productPageData
    * similar to eventpagedata
* products
    * similar to events
* userCart
    * Each record represents the user's cart
* userFavEvents
    * Each record contains the IDs of favorited events for that user.
* userFavProducts
    * See above
* userInfo
    * Contains the userInfo, such as default shipping address and order info.

### Other
Vant-weapp is used in this program, as well as weUI.
 
 
    
 
