function novaMatriz() {
    listaMatriz = [];
    rotas = [];
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

    $('#titleMatriz').empty();
    $('#table-matriz').empty();
    $('#rotas').empty();
    $('#infoRotas').empty();

    MatrizClass.criarMatriz(configMatriz);
    RotasClass.buscarRotas(objetivo.inicio, [objetivo.inicio]);
}