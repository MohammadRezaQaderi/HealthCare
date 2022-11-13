/**
 * 
 * @returns {String} return the Bearer token for Authorization header
 */
 export default function authHeader() {
  /**
   * get the token from local storage
   */
  const user = JSON.parse(localStorage.getItem("user"));
 /**
  * if token is not null then return the token
  */
  if (user && user.access) {
    // For Spring Boot back-end
    return  "Bearer " + user.access ;
    /**
     * else return null
     */
  } else {
    return {
      
    };
  }
}
