console.log("NEXUS iniciado!");


// TESTE DO LOCALSTORAGE

const teste = {
    titulo: "Meu primeiro dado no NEXUS",
    data: new Date().toISOString()
};


NexusStorage.salvar("teste", teste);


const resultado = NexusStorage.buscar("teste");


console.log("Dado salvo:", resultado);