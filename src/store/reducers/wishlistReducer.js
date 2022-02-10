import { ADD_TO_WISHLIST, GET_WISHLIST, REMOVE_FROM_WISHLIST } from "../actionTypes";


const wishlistReducer=(state=[],action)=>{
    switch(action.type){
        case GET_WISHLIST:
          
            return action.responseJson.data
            case REMOVE_FROM_WISHLIST:{
                const {itemId}=action
                console.log(state.data)
                return state.filter((wish)=>wish.wishlist.id!==itemId)

            }
            case ADD_TO_WISHLIST:{
                console.log(action.item + state +'reducer')
                return  [...state]

              
            }
            default:return state
    }
   
  

}
export default wishlistReducer;