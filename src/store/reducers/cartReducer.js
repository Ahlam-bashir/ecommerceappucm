import { CART_ITEMS, DEC_CART_QUANTITY, REMOVE_FROM_CART ,INC_CART_QUANTITY, REMOVE_ALL_FROM_CART} from "../actionTypes"
const initialState = {
    cartItems: [],
    isLoading: false,
  };
  const findIndex = (cartList, id) => {
    const index = cartList.findIndex((cart) => {
        console.log(cart.userCart.id  + ' gjhgbj '+ id )
      return cart.userCart.id === id;
    });
    return index;
  };
const cartReducer=(state=initialState,action)=>{
    const cartList=state.cartItems
    switch(action.type){  
        case CART_ITEMS:
            return {
                ...state,
                cartItems: action.cartItems,
                isLoading:false
            } 
        case REMOVE_FROM_CART:
            console.log(action.itemId +'action in remove cart' + state.cartItems)
            const { itemId } = action;
        //  const indexItem = findIndex(cartList, itemId);
         // console.log(`index itme = ${indexItem}`)
        //  cartList.splice(indexItem, 1);
        

            return {
                ...state,
               cartItems:   cartList.filter((cart,index)=>cart.userCart.id !== itemId),
                
              
               
                isLoading:false
            };
            case INC_CART_QUANTITY:
              
              const {cartItemId}=action
              const index = findIndex(cartList, cartItemId);
              console.log('action in incrr cart'+  cartItemId )
              if (index >= 0) {
                
                console.log(cartList[index].userCart.quantity+"quantity++")
                  +cartList[index].userCart.quantity + 1
               
              }
              return{
                ...state,
                cartItems:[...state.cartItems],
                isLoading:false
              };
              case DEC_CART_QUANTITY:
                console.log('action in decre cart -----' )
                const {p_id}=action
                const index2 = findIndex(cartList, p_id);   
                console.log('action in decre cart -----' +index2)
                if (index2 >= 0) {
                  console.log(cartList[index2].userCart.quantity+"quantity")
                 
                    cartList[index2].userCart.quantity - 1
                 
                }
                return{
                  ...state,
                  cartItems:[...state.cartItems],
                  isLoading:false
                };
                case REMOVE_ALL_FROM_CART:
                  cartList.length=0
                  return{
                    ...state,
                    cartItems:[],
                    isLoading:false
                  }

              
                

           
        
        
                
       
            default: return state

        
    }
}
export default cartReducer
