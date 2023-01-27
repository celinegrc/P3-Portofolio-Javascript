
let email=document.querySelector("#email");
let password=document.querySelector("#password")

document.querySelector("form").addEventListener("submit",function(event){
  event.preventDefault() 
  
let emailValue=(email).value;
let passwordValue = (password).value;

 fetch("http://localhost:5678/api/users/login", {
    
      method: 'POST', 
      headers: {
        
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ 
        "email": emailValue,
        "password": passwordValue})
    })
      .then(response => response.json())
      .then(data => {
        if(data.token==undefined){
        alert("Adresse email ou mot de passe incorrect")
        }else{
          //let token = data.token
          //console.log(token)
          window.location.replace('index.html')
          let newH2= document.querySelector("h2")
          newH2.innerText= "Je viens du Log In"
        }
      })

      .catch((error) => {
        console.log('Erreur : ' + error.message);

      });
    })

  