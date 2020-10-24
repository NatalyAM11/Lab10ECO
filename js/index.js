//constantes
const idRegistro=document.getElementById('idRegistro');
const nombre=document.getElementById('nombre');
const bRegistro=document.getElementById('bRegistrar');
const idVotacion=document.getElementById('idVotacion');
const bVotacion= document.getElementById('bVotar');

const verCandidatos= document.getElementById('verCandidatos');
const verVotacion= document.getElementById('verVotaciones');


//Database
var database=firebase.database();

//votos de los candidatos
let votosC;

let idV;

//Objeto
let objetoCandidato

//Arrays de candidatos y votos
let listCandidatos=[];
let listVotos= [];


registrar= ()=> {

    //inputs
    let idR=idRegistro.value;
    let nombreC= nombre.value;
    
    let yaEsta=false;
    
    objetoCandidato={
        ID:idR,
        Nombre:nombreC,
    }

    database.ref('candidatos').on('value',
    function(data){

        data.forEach(
        candidato =>{ 
        let valor=candidato.val();
        let id=valor.ID;

        if(id===idR){
            yaEsta=true;
        }
    });

    if(yaEsta===false){
        database.ref('candidatos/'+objetoCandidato.ID).set(objetoCandidato);
    }
    });

    //Aca ocurre un pequeño error, porque si es un candidato que no esta registrado
    //deja registrarlo normal  y aparece en firebase, pero el alert dice que no pudo registrarlo

    if(yaEsta=false){
    alert("Candidato registrado");
    }else{
        alert("El candidato con el ID que acaba de ingresar ya esta registrado");
    }

    console.log(objetoCandidato);

}

votar= ()=>{
    //input 
    idV=idVotacion.value;

    objetoVoto={
        IDV: idV,
    }
    
    //enviamos el voto
    database.ref('votos/').push().set(objetoVoto);
}



//Funcion para ver los candidatos
verCandi=()=>{
    database.ref('candidatos').on('value',
    function(data){

        var arrayCandi=[];
        data.forEach(
        candidato =>{ 

        arrayCandi.push(candidato.val().Nombre+'\n');
    });
    alert(arrayCandi);
    });
}


//funcion para ver los votos
verVotes=()=>{

let listCandidatos=[];
let listVotos= [];

//Obtengo los candidatos y votos del firebase y los metemos al arraylist
database.ref('candidatos').on('value',
function(data){

    var arrayCandi=[];
    data.forEach(
    candidato =>{ 

    arrayCandi.push(candidato.val());
    listCandidatos=arrayCandi;
});
});


database.ref('votos').on('value',
function(data){

    var arrayVotos=[];
    data.forEach(
    votes=>{
    arrayVotos.push(votes.val());
    listVotos=arrayVotos;
    });

    contadorVotes(listCandidatos,listVotos);
});



}


contadorVotes=(arrayCandi,arrayVotos)=>{

    //Traigo los arraylist con la info del firebase y comparo los datos para
    //el contador de votos

    let listVotosFinal= [];
    let totalVotos=arrayVotos.length;
    
    arrayCandi.forEach(candidato=>{
        votosC=0;

        arrayVotos.forEach(votes=>{
            if(candidato.ID==votes.IDV){
                votosC++;
            }
        }); 

        //Hago el calculo para el porcentaje
        if(votosC!==0){
          porcentaje= (votosC/totalVotos)*100;
        }

        listVotosFinal.push(candidato.Nombre +" "+porcentaje+ "% "+'\n');  
        
    });
    
    alert(listVotosFinal); 
    
    
}




bRegistro.addEventListener('click',registrar);
bVotacion.addEventListener('click', votar);
verCandidatos.addEventListener('click', verCandi);
verVotacion.addEventListener('click', verVotes);