/*console.log("Ola, mundo");
console.error("Ocorreu um erro!");
console.warn("Aviso!");
console.log(["Augusto", "Joao", "Maria", "Bruno"]);
console.table(["Augusto", "Joao", "Maria", "Bruno"]);

lista = [
  { name: "Augusto", idade: 25 },
  { name: "Bruno", idade: 30 },
];
console.table(lista);*/

/*const NOME_DO_APLICATIVO = "Ubeen";
var teste = 5; //nao respeita o escopo, por isso nao é mais utilizado
let numero = 10; //respeita o escopo, é a convencao mais utilizada

let nome = "Augusto"; //string
let idade = 25; //number
let altura = 1.66; //number
let vivo = true; //boolean
let pessoa = {
  //object
  nome,
  idade,
  altura,
  vivo,
};
console.table(pessoa);
let listaPessoas = [pessoa]; //object != array
console.log(typeof listaPessoas);
console.log(Array.isArray(listaPessoas));*/

// Operadores aritmeticos
//soma +
//diminuicao -
//multiplicacao *
//divisao /
//resto %

// Operadores logicos
// and = &&
// or = ||
// igualdade (comparacao) == (compara valores) | === (compara valores e tipagens)
// diferente (comparacao) !=

// Estruturas de condicao - if - else if - else

/*nota = 7;

if (nota >= 7) {
  console.log("Aprovado");
} else if (nota >= 3) {
  console.log("Pegou exame");
} else {
  console.log("Reprovado");
}

estado = "RS";

switch (estado) {
  case "SP":
    console.log("Paulista");
    break;
  case "RJ":
    console.log("Carioca");
    break;
  case "RS":
    console.log("Gaúcho");
    break;
  default:
    console.log("Estado não listado");
    break;
}*/

// Estruturas de repetição - FOR (for in, for of, for on) - WHILE

// FOR loop

/*for (i = 0; i <= 10; i++) {
  console.log(i);
}*/

lista = [
  { name: "Augusto", idade: 25 },
  { name: "Bruno", idade: 30 },
  { name: "Maria", idade: 20 },
  { name: "Joao", idade: 25 },
];

for (pessoa of lista) {
  //console.log(`Nome: ${pessoa.name}, idade ${pessoa.idade}`);
}

contador = 0;

while (contador <= 10) {
  if (contador == 5) {
    break;
  }

  //console.log(contador);
  contador++;
}

// Funções

function digaOla() {
  return "Ola";
}

console.log(digaOla());

function apresentacao(name, nickname) {
  console.log(`My name is ${nickname}, ${name}`);
}

apresentacao("James Bond", "Bond");

const mostraInter = () => console.log("Internacional");
mostraInter();

const mostraDuplaGrenal = (inter, gremio) => {
  console.log(inter);
  console.log(gremio);
};

mostraDuplaGrenal("inter", "gremio");
