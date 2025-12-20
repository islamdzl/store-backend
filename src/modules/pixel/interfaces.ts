

declare global {
  namespace Pixle {
    enum Events {
      CART_ADD      = "CART_ADD",
      CART_REMOVE   = "CART_REMOVE",
      LIKE_ADD      = "LIKE_ADD",
      LIKE_REMOVE   = "LIKE_REMOVE",
      VIEW_PAGE     = "VIEW_PAGE",
      VIEW_PRODUCT  = "VIEW_PRODUCT",
      LOGGEDIN      = "LOGGEDIN",
      BUY           = "BUY"
    } 
    type Platforms = ('FACEBOOK' | 'TIKTOK')
  }
}