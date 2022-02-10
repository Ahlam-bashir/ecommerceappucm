import {combineReducers} from 'redux'
import cartReducer from './reducers/cartReducer'
import homeReducer from './reducers/homeReducer'
import wishlistReducer from './reducers/wishlistReducer'

const rootReducer =combineReducers({
    
    home:homeReducer,
    cart:cartReducer,
    wishlist:wishlistReducer
})
export default rootReducer