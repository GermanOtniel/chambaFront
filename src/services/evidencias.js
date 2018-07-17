const baseURL = 'http://localhost:3000';

export function createEvidence(evidence,idUser,idDinamic){
  // localhost 
  //herokuapp '/auth/signup'
  let todo = evidence;
  todo.creador = idUser;
  todo.dinamica = idDinamic;
    return fetch(baseURL + '/evidencia/new', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(evidencia=>{
        return evidencia;
    });
}