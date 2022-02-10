import { GET_CATEGORIES } from "../actionTypes";


const homeReducer=(state=[],action)=>{
      switch(action.type){
          case GET_CATEGORIES:
            
              return action.responseJson.data
              default:return state
      }
     
    

}
export default homeReducer;