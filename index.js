//estadoInicial
let tab = [
  ["2", "1", "3"],
  ["2", "1", "3"],
  ["2", "1", ""],
];

function testeDeObjectivo(estadoAtual) {
  let auxiliar,
    contador,
    contador2 = 0;
  for (let i = 0; i < estadoAtual.length; i++) {
    (contador = 0), (contadorLinha = 0);
    for (let j = 0; j < estadoAtual[i].length; j++) {
      if (j == 0) {
        auxiliar = estadoAtual[j][i];
      }

      //verificar se alguma linha esta completa

      //incrementa contador caso uma conluna esteja completa
      if (estadoAtual[j][i] == auxiliar) {
        contador++;
      }
    }
    //incrementa contador caso as 3 colunas inteira estejam completas
    if (contador == 3) {
      contador2++;
    }
  }

  if (contador2 == 2) {
    return true;
  }

  return false;
}

// console.log(testeDeObjectivo(tab))

function copiarValorArray(array) {
  let array2 = [];

  for (let i = 0; i < array.length; i++) {
    array2.push([...array[i]]);
  }

  return array2;
}

let copiaTab = copiarValorArray(tab);


function modeloDeTransicao(tabuleiro) {
  const copiaTabuleiro = copiarValorArray(tabuleiro);
  let proximasJogadas = [];

  for (let linha = 0; linha < tabuleiro.length; linha++) {
    for (let coluna = 0; coluna < tabuleiro.length; coluna++) {
      //verificar frente
      if (tabuleiro[linha][coluna + 1] == "") {
        tabuleiro[linha][coluna + 1] = tabuleiro[linha][coluna];
        tabuleiro[linha][coluna] = "";
        proximasJogadas.push(tabuleiro);
        tabuleiro = copiarValorArray(copiaTabuleiro);
      }

      //verificar tras
      if (tabuleiro[linha][coluna - 1] == "") {
        tabuleiro[linha][coluna - 1] = tabuleiro[linha][coluna];
        tabuleiro[linha][coluna] = "";
        proximasJogadas.push(tabuleiro);
        tabuleiro = copiarValorArray(copiaTabuleiro);
      }

      //verificar cima
      if (tabuleiro[linha - 1]) {
        if (tabuleiro[linha - 1][coluna] == "") {
          tabuleiro[linha - 1][coluna] = tabuleiro[linha][coluna];
          tabuleiro[linha][coluna] = "";
          proximasJogadas.push(tabuleiro);
          tabuleiro = copiarValorArray(copiaTabuleiro);
        }
      }
      //verificar baixo
      if (tabuleiro[linha + 1]) {
        if (tabuleiro[linha + 1][coluna] == "") {
          tabuleiro[linha + 1][coluna] = tabuleiro[linha][coluna];
          tabuleiro[linha][coluna] = "";
          proximasJogadas.push(tabuleiro);
          tabuleiro = copiarValorArray(copiaTabuleiro);
        }
      }
    }
  }
  return proximasJogadas;
}

//console.log(modeloDeTransicao(tab))

class No {
  constructor(dado) {
    this.dado = dado;
    this.filhos = [];
    this.pai = null;
    this.caminhos = [];
  }
}

class Arvore {
  constructor(dado) {
    this.raiz = new No(dado);
    this.pilha = [this.raiz];
    this.solucoes = [];
    this.contador = 0;
  }

  buscaPorProfundidade(arvore, profundidade = 0) {
    // passar arvore e profundidade maxima...
    if (arvore && profundidade < 4000) {
      ++profundidade;
      // copiar dados disponivel no jogo antes de movimentar....
      let copia = copiarValorArray(arvore.dado);
      //verificar se alcansou alguma solucao
      if (testeDeObjectivo(arvore.dado)) {
        this.solucoes.push(arvore);

        // if (this.solucoes.length >= 3) {
        //   return this.solucoes;
        // }
        // return;
      }

      // chamar funcao de transicao para gerar caminhos e adicionar caminhos....
      let transacao = modeloDeTransicao(arvore.dado);
      // verficar se existe algum caminho...
      if (transacao.length > 0) {
        let no;
        // adcionar todos caminhos....
        for (let i = 0; i < transacao.length; i++) {
          no = new No(transacao[i]);
          no.caminhos.push(arvore);
          arvore.dado = copia;
          no.pai = arvore;
          for (let j = 0; j < arvore.caminhos.length; j++) {
            no.caminhos.push(arvore.caminhos[j]);
          }

          arvore.filhos.push(no);
        }
      }
      this.pilha.shift();
      for (let i = 0; i < arvore.filhos.length; i++) {
        this.pilha.push(arvore.filhos[i]);
      }

      this.buscaPorProfundidade(this.pilha[0], profundidade);
    }
    return this.solucoes;
  }
}

// let arvore = new Arvore(tab);
// console.log(arvore.buscaPorProfundidade(arvore.raiz))

//console.log(testeDeObjectivo(tab))

//console.log(modeloDeTransicao(tab))

let tabuleiroInterface = document.querySelectorAll(".tab");
let caminhos = document.querySelector(".caminhos");

function inicializar(estado) {
  let x = 0;
  for (let i = 0; i < copiaTab.length; i++) {
    for (let j = 0; j < copiaTab[i].length; j++) {
      tabuleiroInterface[x].innerHTML = copiaTab[i][j];

      if (copiaTab[i][j] == "1") {
        tabuleiroInterface[x].style.background = "red";
      } else if (copiaTab[i][j] == "2") {
        tabuleiroInterface[x].style.background = "green";
      } else if (copiaTab[i][j] == "3") {
        tabuleiroInterface[x].style.background = "blue";
      } else {
        tabuleiroInterface[x].style.background = "black";
      }

      tabuleiroInterface[x].addEventListener("click", () => {
        movimentar(i, j, x);
      });

      x++;
    }
  }

  //  console.log(modeloDeTransicao(estado))

  //mostrar todas solucoes
  caminhos.innerHTML = ""
  tab = copiarValorArray(copiaTab);
  let arvore = new Arvore(tab);

  let resultado = arvore.buscaPorProfundidade(arvore.raiz);
  for (let i = 0; i < 3; i++) {
    let dv = document.createElement("div");

    for (let j = resultado[i].caminhos.length - 1; j >= 0; j--) {
      let dv2 = document.createElement("div");
      for (let k = 0; k < resultado[i].caminhos[j].dado.length; k++) {
        for (
          let l = 0;
          l < resultado[i].caminhos[j].dado[k].length;
          l++
        ) {
          let backup = resultado[i].caminhos[j].dado[k][l];

          if (backup == "") {
            dv2.innerHTML += "0&nbsp;&nbsp;";
          } else {
            dv2.innerHTML += backup + "&nbsp;&nbsp;";
          }

          if (l == 2) {
            dv2.innerHTML += "<br>";
          }
        }
      }
      dv2.innerHTML += "<br><br>";
      dv.appendChild(dv2);
    }
    let dv3 = document.createElement("div");
    dv3.innerHTML += "Estado Final<br>";
    for (let k = 0; k < resultado[i].dado.length; k++) {
      for (let l = 0; l < resultado[i].dado[k].length; l++) {
        let backup = resultado[i].dado[k][l];

        if (backup == "") {
          dv3.innerHTML += "0&nbsp;&nbsp;";
        } else {
          dv3.innerHTML += backup + "&nbsp;&nbsp;";
        }

        if (l == 2) {
          dv3.innerHTML += "<br>";
        }
      }
    }
    dv.appendChild(dv3);
    caminhos.appendChild(dv);
  }

    //
}

window.onload = function () {
  inicializar(tab);
};

function movimentar(i, j, x) {
  //frente
  if (copiaTab[i][j + 1] == "") {
    copiaTab[i][j + 1] = copiaTab[i][j];
    copiaTab[i][j] = "";
    inicializar(copiaTab);
  }

  //tras
  if (copiaTab[i][j - 1] == "") {
    copiaTab[i][j - 1] = copiaTab[i][j];
    copiaTab[i][j] = "";
    inicializar(copiaTab);
  }

  //baixo
  if (copiaTab[i + 1]) {
    if (copiaTab[i + 1][j] == "") {
      copiaTab[i + 1][j] = copiaTab[i][j];
      copiaTab[i][j] = "";
      inicializar(copiaTab);
    }
  }

  //cima

  if (copiaTab[i - 1]) {
    if (copiaTab[i - 1][j] == "") {
      copiaTab[i - 1][j] = copiaTab[i][j];
      copiaTab[i][j] = "";
      inicializar(copiaTab);
    }
  }
}

// let arvore = new Arvore(copiaTab);

// let resultado = arvore.buscaPorProfundidade(arvore.raiz);

// console.log(resultado);
