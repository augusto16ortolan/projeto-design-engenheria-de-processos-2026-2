// Assincronismo no JavaScript
const axios = require("axios");

/*console.log(1);

setTimeout(() => {
  console.log(2);
}, 3000);

console.log(3);*/

/*async function digaOla(numero) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (numero % 2 == 0) {
        resolve("Promise resolvida com sucesso");
      }

      reject("Promise rejeitada, o valor é ímpar");
    }, 2000);
  });
}

const func = async () => "Teste";

digaOla(5)
  .then((valorResolvido) => console.log(valorResolvido))
  .catch((valorRejeitado) => console.log(valorRejeitado));

async function mostraInter() {
  try {
    const response = await digaOla(5);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

mostraInter();*/

/*fetch("https://viacep.com.br/ws/01001000/json").then((valor) =>
  valor.json().then((resposta) => console.log(resposta.logradouro)),
);

async function getEndereco(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
    const objetoRetornado = await response.json();
    console.log(objetoRetornado);
  } catch (error) {
    console.error(error);
  }
}*/

/*async function getEndereco(cep) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    console.log(response.data.localidade);
  } catch (error) {
    console.error(error);
  }
}

getEndereco("99980000");
//getEndereco("99072445");

*/

//https://jsonplaceholder.typicode.com/users

async function getUsers() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users",
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function manipularUsuarios() {
  try {
    let users = await getUsers();

    //map => percorre cada dado da lista transformando em outro dado
    //filter => filtrar os dados da lista
    //reduce => reduz uma lista em um unico valor

    let nameAndEmails = users.map((usuario) => {
      let usuarioSimplificado = {
        name: usuario.name,
        email: usuario.email,
      };

      return usuarioSimplificado;
    });

    let usuariosComIdImpar = users.filter((usuario) => usuario.id % 2 != 0);

    let usuariosConcatenadosPorNome = users.reduce((acumulador, usuario) => {
      if (acumulador == "") {
        return `${usuario.name}`;
      }

      return `${acumulador}, ${usuario.name}`;
    }, "");

    console.table(usuariosConcatenadosPorNome);
  } catch (error) {
    console.error(error);
  }
}

manipularUsuarios();
