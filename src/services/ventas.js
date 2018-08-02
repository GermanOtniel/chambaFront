const baseURL = 'http://localhost:3000';

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