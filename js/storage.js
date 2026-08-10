const NexusStorage = {

    salvar(chave, dados) {

        localStorage.setItem(
            `nexus_${chave}`,
            JSON.stringify(dados)
        );

    },


    buscar(chave) {

        const dados = localStorage.getItem(
            `nexus_${chave}`
        );

        return dados ? JSON.parse(dados) : [];

    },


    remover(chave) {

        localStorage.removeItem(
            `nexus_${chave}`
        );

    },


    limparTudo() {

        const prefixo = "nexus_";

        Object.keys(localStorage)
            .filter(chave => chave.startsWith(prefixo))
            .forEach(chave => {
                localStorage.removeItem(chave);
            });

    }

};

console.log("STORAGE carregado!");