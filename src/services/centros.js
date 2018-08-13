const baseURL = process.env.REACT_APP_BASE_URL;

export function getCenters(){
  //console.log("peticion");
  //  localhost  
  // herokuapp  '/auth/profile/'
  return fetch( baseURL + '/ctrconsumo/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(centros=>{
    return centros
  })
}