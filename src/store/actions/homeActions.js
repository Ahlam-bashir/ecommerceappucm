import { API_URL } from "../../utils/Config";

export default getCategories=()=>{
    return async(dispatch)=>{
       await fetch(API_URL + 'HomeApi', {
            method: 'GET',
            //Request Type
          })
            .then(response => response.json())
      
            .then(responseJson => {
              
      
              if (responseJson.statusCode === 200) {
                  dispatch({
                      type:'GET_CATEGORIES',
                      responseJson

                  })    
                //setSlides(responseJson.data.slides);
                //setData(responseJson.data.categories);
                // setArrival(responseJson.data.Products)
                //setSuperCategories(responseJson.data.superCategories);
              }
              //Success
            })
            .catch(error => {
              //Error
      
              console.error(error);
            });

    }


}