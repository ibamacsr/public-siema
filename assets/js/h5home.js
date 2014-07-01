// Generated by CoffeeScript 1.4.0
(function() {
  var consultarOcorrencias, setFilter;

  $(document).ready(function() {
    var roundNumber;
    $("#login").load("http://" + document.domain + "/siema/index.php/login/login_window");
    $("#login").hide();
    $("#map").show();
    $('#addMeModal').modal({
      keyboard: false,
      backdrop: false,
      show: true
    });
    $("#addMeModal").draggable({
      handle: ".modal-header"
    });
    $('.selectpicker').selectpicker();
    $(".dropdown-menu input, .dropdown-menu label").click(function(e) {
      return e.stopPropagation();
    });
    $(".navbar a").on("click", function(event) {
      var where;
      $(".nav-collapse a").parent().removeClass("active");
      $(this).parent().addClass("active");
      if ($(this).prop("id") === "btn-map") {
        $("#dash").hide();
        $("#login").hide();
        $("#map").show();
        $("#consultas").hide();
        $("#manag").hide();
        if (H5.Data.changed) {
          if (H5.Data.state === "Todos") {
            where = "ano='" + H5.Data.selectedYear + "'";
          } else {
            where = "estado='" + H5.Data.state + "' AND ano='" + H5.Data.selectedYear + "'";
          }
          H5.Map.layer.alerta.setOptions({
            where: where
          });
          H5.Map.layer.clusters.setOptions({
            where: where
          });
          H5.Map.layer.alerta.redraw();
          H5.Map.layer.clusters.redraw();
          H5.Data.changed = false;
        }
      } else if ($(this).prop("id") === "btn-charts") {
        $("#login").hide();
        $("#map").hide();
        $("#dash").show();
        $("#consultas").hide();
        $("#manag").hide();
      } else if ($(this).prop("id") === "btn-login") {
        $("#dash").hide();
        $("#map").show();
        $("#login").show();
        $("#consultas").hide();
      } else if ($(this).prop("id") === "btn-consult") {
        $("#login").hide();
        $("#map").hide();
        $("#dash").hide();
        $("#consultas").show();
        $("#manag").hide();
      } else if ($(this).prop("id") === "btn-manag") {
        $("#login").hide();
        $("#map").hide();
        $("#dash").hide();
        $("#manag").show();
        $("#btn-manage1").click();
      }
      return $('.nav-collapse').collapse('hide');
    });
    $("#chkAllDates").on("click", function(event) {
      if ($(this).is(":checked")) {
        $("#dateStart").attr("disabled", "disabled");
        return $("#dateFinish").attr("disabled", "disabled");
      } else {
        $("#dateStart").removeAttr("disabled", "disabled");
        return $("#dateFinish").removeAttr("disabled", "disabled");
      }
    });
    $("#tipoProd").on("change", function(event) {
      return setFilter();
    });
    $("#dropConsultUF").on("change", function(event) {
      return setFilter();
    });
    $("#originsConsultSlct").on("change", function(event) {
      return setFilter();
    });
    $("#dateFinish").on("change", function(event) {
      return setFilter();
    });
    $("#chkAllDates").on("change", function(event) {
      if ($(this).is(":checked")) {
        return setFilter();
      } else {
        if ($("#dateStart").value() !== "" && $("#dateFinish").value() !== "") {
          return setFilter();
        }
      }
    });
    String.prototype.toProperCase = function() {
      return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
    roundNumber = function(number, digits) {
      var multiple, rndedNum;
      multiple = Math.pow(10, digits);
      rndedNum = Math.round(number * multiple) / multiple;
      return rndedNum;
    };
    $("#dateStart").datepicker({
      format: "dd/mm/yyyy",
      language: "pt-BR",
      autoclose: true,
      orientation: "auto right",
      clearBtn: true,
      startView: 1,
      endDate: "today"
    });
    $("#dateFinish").datepicker({
      format: "dd/mm/yyyy",
      language: "pt-BR",
      autoclose: true,
      orientation: "auto right",
      clearBtn: true,
      startView: 1,
      endDate: "today"
    });
    $("#dash").fadeOut(1);
    $("#consultas").hide();
    return $(".loading").fadeOut(2000);
  });

  /*
  tpProd -> Tipo de produto(lista ONU)
  uf -> Estado
  origem -> Origem Acidente
  dtIni -> Data Inicial
  dfFim -> Data final
  */


  consultarOcorrencias = function(tpProd, uf, origem, dtIni, dtFim) {
    var query, registroTemp, rest;
    registroTemp = new Array();
    query = "";
    if (tpProd !== "") {
      query += " tipoProd = " + tpProd;
    }
    if (uf !== "") {
      if (query.length !== 0) {
        query += " AND ";
      }
      query += "sigla='" + uf + "'";
    }
    if (origem !== "") {
      if (query.length !== 0) {
        query += " AND ";
      }
      query += " origem = '{" + origem + "}'";
    }
    if (dtIni !== "" && dtFim !== "") {
      if (query.length !== 0) {
        query += " AND ";
      }
      query += " (dt_registro >= '" + dtIni + "' AND " + "dt_registro <= '" + dtFim + "')";
    }
    H5.Data.restURL = "http://" + document.domain + "/siema/rest";
    rest = new H5.Rest({
      url: H5.Data.restURL,
      table: "vw_ocorrencia",
      fields: "id_ocorrencia,to_char(dt_registro,'DD/MM/YYYY') AS dt_registro,periodo_ocorrencia, regiao, sigla, array_to_string(origem,';') AS origem, array_to_string(tipos_danos_identificados,';') AS tipos_danos_identificados, array_to_string(institiuicoes_atuando_local,';') AS institiuicoes_atuando_local, array_to_string(tipos_fontes_informacoes,';') AS tipos_fontes_informacoes",
      parameters: query
    });
    $.each(rest.data, function(index, dt) {
      return registroTemp[registroTemp.length] = new Array(dt.id_ocorrencia, dt.dt_registro, dt.periodo_ocorrencia, dt.regiao, dt.sigla, dt.origem, dt.tipos_danos_identificados, dt.institiuicoes_atuando_local, dt.tipos_fontes_informacoes);
    });
    $('#resultsConsult').html('<table cellpadding="0" cellspacing="0" border="0"  id="resultTable"></table>');
    return $('#resultTable').dataTable({
      dom: "T<'clear'>lfrtip",
      "data": registroTemp,
      "columns": [
        {
          "title": "Código"
        }, {
          "title": "Data de Cadastro"
        }, {
          "title": "Período"
        }, {
          "title": "Região"
        }, {
          "title": "UF"
        }, {
          "title": "Origem"
        }, {
          "title": "Danos Identificados"
        }, {
          "title": "Inst. Atuando no Local"
        }, {
          "title": "Fontes de Informação"
        }
      ],
      /*
          "oTableTools":
              "sSwfPath": "http://" + document.domain + "/siema/assets/img/copy_csv_xls_pdf.swf"
              "aButtons": [
                {
                  "sExtends": "xls"
                  "sButtonText": "Exportar para XLS"
                  "sFileName": "*.xls"
                  "sFieldSeperator": ","
                  "sTitle": "Consulta de ocorrências SIEMA(Sistema Nacional de Emergências Ambientais)"
                },
                {
                  "sExtends": "pdf"
                  "sButtonText": "Exportar para PDF"
                  "sTitle": "Consulta de ocorrências SIEMA(Sistema Nacional de Emergências Ambientais)"
                  "sPdfOrientation": "landscape"
                }
              ]
      */

      "oLanguage": {
        "sLengthMenu": "Mostrar _MENU_ registros por página",
        "sZeroRecords": "Nenhum registro encontrado",
        "sInfo": "Mostrando _END_ de _TOTAL_ registro(s)",
        "sInfoEmpty": "Mostrando 0 de 0 registros",
        "sInfoFiltered": "(filtrado de _MAX_ registros)",
        "sSearch": "Pesquisar: ",
        "oPaginate": {
          "sFirst": "Início",
          "sPrevious": "Anterior",
          "sNext": "Próximo",
          "sLast": "Último"
        }
      }
    });
  };

  setFilter = function() {
    var dtFim, dtIni, filterOrigem, filterTipo, filterUF;
    filterTipo = $("#tipoProd").val() === "Todos" ? "" : $("#tipoProd").val();
    filterUF = $("#dropConsultUF").val() === "Todos" ? "" : $("#dropConsultUF").val();
    filterOrigem = $("#originsConsultSlct").val() === "Todos" ? "" : $("#originsConsultSlct").val();
    if ($("#chkAllDates").is(":checked")) {
      dtIni = "";
      dtFim = "";
    } else {
      dtIni = $("#dateStart").val();
      dtFim = $("#dateFinish").val();
    }
    return consultarOcorrencias(filterTipo, filterUF, filterOrigem, dtIni, dtFim);
  };

}).call(this);
