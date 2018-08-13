const baseURL = process.env.REACT_APP_BASE_URL;

export function getVentas(user){
  return fetch( baseURL + '/ventas/' + user )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(ventas=>{
    return ventas
  })
}