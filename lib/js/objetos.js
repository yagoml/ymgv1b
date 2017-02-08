// Classes construtoras de objetos

var Celula = function (l, c, status) {
    this.linha = l;
    this.coluna = c;
    this.status = status;
    this.vizinhos = new Vizinhos(l, c);
};

var Vizinhos = function (l, c) {
    var acima = {linha: (l - 1), coluna: c};
    var abaixo = {linha: (l + 1), coluna: c};
    var esquerda = {linha: l, coluna: (c - 1)};
    var direita = {linha: l, coluna: (c + 1)};

    this.acima = CelulaClass.validarCelula(acima);
    this.abaixo = CelulaClass.validarCelula(abaixo);
    this.esquerda = CelulaClass.validarCelula(esquerda);
    this.direita = CelulaClass.validarCelula(direita);
};

/**
 * Objeto Objetivo
 * @param inicio Object
 * @param fim Object
 * @example inicio = {linha: 1, coluna: 1};
 * @example fim = {linha: 10, coluna: 10};
 */
var Objetivo = function (inicio, fim) {
    this.inicio = inicio;
    this.fim = fim;
};