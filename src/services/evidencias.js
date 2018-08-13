const baseURL = process.env.REACT_APP_BASE_URL;

export function createEvidence(evidence){
    return fetch(baseURL + '/evidencia/new', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evidence)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(evidencia=>{
        return evidencia;
    });
}