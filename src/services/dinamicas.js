const baseURL = 'http://localhost:3000';

export function getDinamics(){
  //console.log("peticion");
  //  localhost  
  // herokuapp  '/auth/profile/'
  return fetch( baseURL + '/dinamica/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(dinamicas=>{
    return dinamicas
  })
}

export function getSingleDinamic(id) {
  return fetch( baseURL + '/dinamica/' + id)
  .then(r=>r.json())
  .then(dinamic=>{
    return dinamic
  })
}
