//production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

export function getNotas(id){
  return fetch( baseURL + '/nota/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(nota=>{
    return nota
  })
}

// export function deleteNote(id){
//   return fetch( baseURL + '/nota/delete/' + id )
//   .then(res=>{
//     if(!res.ok) return Promise.reject(res.statusText);
//     return res.json()
//   })
//   .then(nota=>{
//     return nota
//   })
// }
