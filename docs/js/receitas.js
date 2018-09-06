var i, dataChart;
var years = ['2015', '2016', '2017', '2018'];

var url = 'https://cors-anywhere.herokuapp.com/http://dadosabertos-custom.azurewebsites.net/receitas?type=json&idCliente=0202202&page=1&pageSize=20&numano=';

$('#receita').on('click', function () {
    $.get(url + '2018',
        function (data) {
            init(data);
        }
    );
    $('#title').html('Receitas');
    $('#contact').addClass('bg-light');
    $('#public-data').removeClass('d-none');
});

var init = function(data) {
    i = 0;
    dataChart = [];
    dataChart.push(['Ano', 'Valor Previsto', 'Valor Realizado']);
    handleTable(data);
    handleCharts();
};

var handleTable = function (data) {
    $('#thead').html('' +
        '<th scope="col">Exercício</th>' +
        '<th scope="col">Descrição</th>' +
        '<th scope="col">Valor Prev.</th>' +
        '<th scope="col">Valor Realiz.</th>'
    );
    var text = '';
    for (var i=0; i<data.length; i++) {
        text += '' +
            '<tr>' +
            '<th class="text-muted">' +data[i].NumExercicio+ '</th>' +
            '<td class="text-muted">' +data[i].DescReceita+ '</td>' +
            '<td class="text-muted"> R$ ' +data[i].VlPrevisto+ '</td>' +
            '<td class="text-muted"> R$ ' +data[i].VlRealizado+ '</td>' +
            '</tr>';
    }
    $('#tbody').html(text);
};

var handleCharts = function () {
    if (i < years.length) {
        $.get(url + years[i], function (data) {
            var valorPrevisto = 0, valorRealizado = 0;
            for (var j=0; j<data.length; j++) {
                valorPrevisto += parseInt(data[j].VlPrevisto);
                valorRealizado += parseInt(data[j].VlRealizado);
            }
            dataChart.push([years[i], valorPrevisto, valorRealizado]);
            i++;
            handleCharts();
        });
    } else {
        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var options = {
                chart: {
                    title: 'Soma dos valores previstos e realizado',
                    subtitle: 'Entre o período de 2014 a 2018',
                }
            };
            var chart = new google.charts.Bar(document.getElementById('columnchart_material'));
            chart.draw(google.visualization.arrayToDataTable(dataChart), google.charts.Bar.convertOptions(options));
        }
    }
};