// Escopo Global

var listaMatriz = [];
var configMatriz = {};
var objetivo = {};
var rotas = [];

$('#novaMatrizForm').submit(function (e) {
    e.preventDefault();

    var linhaInicial = $('#inicioLinha').val();
    var linhaFinal = $('#fimLinha').val();
    var colunaInicial = $('#inicioColuna').val();
    var colunaFinal = $('#fimColuna').val();

    configMatriz = {
        linhas: $('#linhas').val(),
        colunas: $('#colunas').val(),
        pInicial: linhaInicial + ',' + colunaInicial,
        pFinal: linhaFinal + ',' + colunaFinal
    };

    objetivo = new Objetivo({linha: linhaInicial, coluna: colunaInicial}, {linha: linhaFinal, coluna: colunaFinal});

    MatrizClass.criarMatriz(configMatriz);
    RotasClass.buscarRotas(objetivo.inicio, [objetivo.inicio]);
    RotasClass.botoesRotas(rotas);

    $('#btnForm').remove();
});

$('#btnNovaMatriz').click(function () {
    location.reload();
});