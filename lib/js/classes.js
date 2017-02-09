// Classes Principais

var MatrizClass = {
    criarMatriz: function criarMatriz(data) {
        var interfaceMatriz = '';

        for (l = 1; l <= data.linhas; l++) {
            interfaceMatriz += '<tr>';
            for (c = 1; c <= data.colunas; c++) {
                var celula = (l + ',' + c).toString();
                var randomStatus = CelulaClass.randomStatus();

                listaMatriz[l + ',' + c] = new Celula(l, c, randomStatus);

                interfaceMatriz += '<td id="m' + l + ',' + c + '"><i class="icon-circle' + (randomStatus ? ' ativa' : '') + (celula === data.pInicial || celula === data.pFinal ? ' pontosIF' : '') + '"></i> <span>[' + l + ',' + c + ']</span></td>';

            }
            interfaceMatriz += '</tr>';
        }

        $('#titleMatriz').html('<h4>Matriz ' + configMatriz.linhas + 'x' + configMatriz.colunas + '</h4><div class="row text-center"><b>Objetivo: <span class="alert-danger pad5">Início [' + objetivo.inicio.linha + ', ' + objetivo.inicio.coluna + ']</span> - <span class="alert-danger pad5">Fim [' + objetivo.fim.linha + ', ' + objetivo.fim.coluna + ']</span></b></div>');
        $('.table-matriz').html(interfaceMatriz);
    }
};

var RotasClass = {
    visitadasAtual: [],
    transicoes: [],
    deslocamento: function (Objetivo) {
        return {
            linhas: Objetivo.fim.linha - Objetivo.inicio.linha,
            colunas: Objetivo.fim.coluna - Objetivo.inicio.coluna
        };
    },
    buscarRotas: function (celula, rota) {
        var vizinhos = listaMatriz[celula.linha + ',' + celula.coluna].vizinhos;

        if (this.isCelulaFinal(vizinhos, rota) || this.isDestino(celula)) {
            rotas.push(rota.slice());
            var proxCelula = null;
        } else {
            var proxCelula = this.buscarVizinhoValido(celula, vizinhos, rota);
        }

        if (proxCelula) {
            rota.push(proxCelula);
            this.transicoes.push({celula: celula, destino: proxCelula});
            this.buscarRotas(proxCelula, rota);
        } else {
            rota.pop();
            if (rota.length > 0) {
                this.buscarRotas(rota[rota.length - 1], rota);
            }
        }
    },
    buscarVizinhoValido: function (celula, vizinhos, rota) {
        if (vizinhos.acima && this.validarRota(celula, vizinhos.acima, rota)) {
            return vizinhos.acima;
        }
        if (vizinhos.abaixo && this.validarRota(celula, vizinhos.abaixo, rota)) {
            return vizinhos.abaixo;
        }
        if (vizinhos.esquerda && this.validarRota(celula, vizinhos.esquerda, rota)) {
            return vizinhos.esquerda;
        }
        if (vizinhos.direita && this.validarRota(celula, vizinhos.direita, rota)) {
            return vizinhos.direita;
        }

        return null;
    },
    isCelulaFinal: function (vizinhos, rota) {
        var acima, abaixo, esquerda, direita;

        if (vizinhos.acima && this.isAtiva(vizinhos.acima)) {
            acima = this.checkRota(vizinhos.acima, rota) ? false : true;
        } else {
            acima = false;
        }

        if (vizinhos.abaixo && this.isAtiva(vizinhos.abaixo)) {
            abaixo = this.checkRota(vizinhos.abaixo, rota) ? false : true;
        } else {
            abaixo = false;
        }

        if (vizinhos.esquerda && this.isAtiva(vizinhos.esquerda)) {
            esquerda = this.checkRota(vizinhos.esquerda, rota) ? false : true;
        } else {
            esquerda = false;
        }

        if (vizinhos.direita && this.isAtiva(vizinhos.direita)) {
            direita = this.checkRota(vizinhos.direita, rota) ? false : true;
        } else {
            direita = false;
        }

        if (!acima && !abaixo && !esquerda && !direita) {
            return true;
        } else {
            return false;
        }
    },
    isAtiva: function (celula) {
        return listaMatriz[celula.linha + ',' + celula.coluna].status;
    },
    isDestino: function (celula) {
        return objetivo.fim.linha == celula.linha && objetivo.fim.coluna == celula.coluna;
    },
    checkRota: function (celula, rota) {
        return rota.some(function (celulaRota, index) {
            if (celula.linha == celulaRota.linha && celula.coluna == celulaRota.coluna) {
                return true;
            }
        });
    },
    checkTransicao: function (celula, destino) {
        return this.transicoes.some(function (transicaoData, index) {
            if (celula.linha == transicaoData.celula.linha && celula.coluna == transicaoData.celula.coluna) {
                if (destino.linha == transicaoData.destino.linha && destino.coluna == transicaoData.destino.coluna) {
                    return true;
                }
            }
        });
    },
    validarRota: function (celula, vizinho, rota) {
        if (this.isAtiva(vizinho)) {
            if (!this.checkRota(vizinho, rota)) {
                if (!this.checkTransicao(celula, vizinho)) {
                    return true;
                }
            }
        }

        return false;
    },
    mostrarRota: function (rota, num) {
        $('.rota').removeClass('rota');

        var transicoesView = '';

        rota.forEach(function (celula, index) {
            var celulaRota = {
                linha: celula.linha,
                coluna: celula.coluna
            };

            $('.table-matriz tr td').each(function (i, element) {
                var celulaMatriz = {
                    linha: $(this).attr('id').split(',')[0].replace(/^\D+/g, ''),
                    coluna: $(this).attr('id').split(',')[1]
                };
                var celulaElement = $(this).children('i');

                if (celulaMatriz.linha == celulaRota.linha && celulaMatriz.coluna == celulaRota.coluna) {
                    setTimeout(function () {
                        celulaElement.addClass('rota');
                    }, index * 200);
                }
            });

            transicoesView += (index > 0 ? ' -> ' : '') + '<label class="pad5 alert-info"><b>' + celulaRota.linha + ', ' + celulaRota.coluna + '</b></label>';

        });

        var titleRota = '<h4>Rota ' + num + ': ' + rota.length + ' células</h4>';
        $('#rotaAtual').html(titleRota + transicoesView);
    },
    botoesRotas: function (rotas) {
        var menorRota = 1;
        var maiorRota = 1;
        var indexMenorRota = 0;
        var indexMaiorRota = 0;
        var possivel = false;
        var validas = [];
        var rotasView = '<div class="col-sm-1 col-xs-3 boxBtnRota"><button title="Limpar Rota" class="btn btn-default resetRota" id="resetRota"> X </button></div>';

        rotas.forEach(function (rota, index) {
            var valida = false;
            if (rota[rota.length - 1].linha == objetivo.fim.linha && rota[rota.length - 1].coluna == objetivo.fim.coluna) {
                validas.push({numero: index + 1, celulas: rota.length});
                valida = true;
                possivel = true;
            }

            if (index < 1) {
                menorRota = rota.length;
                maiorRota = rota.length;
            }
            if (rota.length < menorRota) {
                menorRota = rota.length;
                indexMenorRota = index;
            }
            if (rota.length > maiorRota) {
                maiorRota = rota.length;
                indexMaiorRota = index;
            }

            rotasView += '<div class="col-sm-1 col-xs-3 boxBtnRota"><button title="Rota ' + (index + 1) + '" id="rota' + index + '" class="btn btn-primary ' + (valida ? 'alert-success' : '') + ' btnRota">' + (index + 1) + '</button></div>';
        });

        var title = '<h4 class="text-center">Rotas encontradas: <b>' + rotas.length + '</b></h4>';
        var info = '';

        if (possivel) {
            var menorValida = {};
            var maiorValida = {};

            validas.forEach(function (valida, index) {
                if (index < 1) {
                    menorValida = valida;
                    maiorValida = valida;
                }
                if (valida.celulas < menorValida.celulas) {
                    menorValida = valida;
                }
                if (valida.celulas > maiorValida.celulas) {
                    maiorValida = valida;
                }
            });

            info += '<div class="col-xs-12 alert alert-success fitContent"><b>Destino possível!</b><br>';
            info += '<u>Menor possível: <b>' + menorValida.numero + '</b> (' + menorValida.celulas + ' células)</u> / ';
            info += '<u>Maior possível: <b>' + maiorValida.numero + '</b> (' + maiorValida.celulas + ' células)</u></div>';
        } else {
            info += '<div class="col-xs-12 alert alert-danger fitContent"><b>Destino impossível!</b><br>';
            info += '<u>Menor rota: <b>' + (indexMenorRota + 1) + '</b> (' + menorRota + ' células)</u> / ';
            info += '<u>Maior rota: <b>' + (indexMaiorRota + 1) + '</b> (' + maiorRota + ' células)</u></div>';
        }

        $('#rotas').html(title + rotasView);

        $('#infoRotas').html(info);

        $('#rota' + indexMenorRota).addClass('alert-warning');

        $('.btnRota').click(function () {
            $('.btnRota').removeClass('btn-danger');
            $('.btnRota').prop('disabled', true);
            $('.resetRota').prop('disabled', true);
            $(this).addClass('btn-danger');

            $('html,body').animate({scrollTop: $("#titleMatriz").offset().top}, 'slow');
            
            var indexRota = $(this).attr('id').replace(/^\D+/g, '');
            var rota = rotas[indexRota];
            RotasClass.mostrarRota(rota, (parseInt(indexRota) + 1));
            setTimeout(function () {
                $('.btnRota').prop('disabled', false);
                $('.resetRota').prop('disabled', false);
            }, rota.length * 200);
        });

        $('#resetRota').click(function () {
            $('.rota').removeClass('rota');
            $('.btnRota').removeClass('btn-danger');
        });
    }
};

var CelulaClass = {
    randomStatus: function () {
        return Math.floor(Math.random() * 100) < 70 ? 1 : 0;
    },
    validarCelula: function (celula) {
        if (celula.linha > 0 && celula.linha <= configMatriz.linhas) {
            if (celula.coluna > 0 && celula.coluna <= configMatriz.colunas) {
                return celula;
            }
        }
        return null;
    }
};