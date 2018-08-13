const baseURL = process.env.REACT_APP_BASE_URL;

export function googleUser(userData){
  console.log(process.env)
    return fetch(baseURL + '/auth/google', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(user=>{
        localStorage.setItem('user', JSON.stringify(user))
        return user;
    });
}
export function signup(userData){
    return fetch(baseURL + '/auth/signup', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(user=>{
        localStorage.setItem('user', JSON.stringify(user))
        return user;
    });
}
export function login(userData){
  //  localhost 
  // herokuapp  '/auth/login'
    return fetch( baseURL + '/auth/login' ,{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(userData),
      credentials: "include"
    })
    .then(res=>{
      if(!res.ok) return Promise.reject(res)
      return res.json();
    })
    .then(user=>{
      localStorage.setItem('user',JSON.stringify(user));
      return user;
    })
  }
export function salir(){
  return fetch( baseURL + '/auth/logout' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return 
  })
  .then(logoutUser=>{
    return 'Saliste'
  })
}
export function getSingleUser(id){
  //console.log("peticion");
  //  localhost  
  // herokuapp  '/auth/profile/'
  return fetch( baseURL + '/auth/profile/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(user=>{
    return user
  })
}

export function editProfile(formulario,id){
  //console.log("peticion");
  // localhost  
  // herokuapp '/auth/profile'
  return fetch(  baseURL + '/auth/profile/' + id ,{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formulario),
    credentials:"include"
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(user=>{
    return user
  })
}
