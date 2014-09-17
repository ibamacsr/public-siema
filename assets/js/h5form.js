(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  H5.Data.restURL = "http://" + document.domain + "/siema/rest";

  $(document).ready(function() {
    var GeoSearch, Marker, addSelection, bingKey, binghybrid, date, doubleClick, drawAPI, idLin, idOcorrencia, idPol, isLoadForm, lineTable, minimapView, nroComunicado, nroOcorrencia, onuTable, otherTable, pointTable, polygonTable, productsOnu, productsOutro, rest, seconds, shapeLoadedFromDB, validationString, _municipios, _shownAccordion, _tipoDanoIdentificado, _tipoEvento, _tipoFonteInformacao, _tipoInstituicaoAtuando, _tipoLocalizacao, _tipoProdutoOnu, _tipoProdutoOutro;
    _tipoLocalizacao = null;
    _tipoEvento = null;
    _tipoDanoIdentificado = null;
    _tipoInstituicaoAtuando = null;
    _tipoFonteInformacao = null;
    _tipoProdutoOnu = null;
    _tipoProdutoOutro = null;
    _municipios = null;
    idOcorrencia = null;
    rest = new H5.Rest({
      url: H5.Data.restURL,
      fields: "nextval('tmp_pol_id_tmp_pol_seq') as lastval",
      table: "tipo_fonte_informacao",
      limit: "1"
    });
    idPol = rest.data[0].lastval;
    rest = new H5.Rest({
      url: H5.Data.restURL,
      fields: "nextval('tmp_lin_id_tmp_lin_seq') as lastval",
      table: "tipo_fonte_informacao",
      limit: "1"
    });
    idLin = rest.data[0].lastval;
    _shownAccordion = null;
    if (!$("#comunicado").val()) {
      date = new Date();
      seconds = parseInt(date.getSeconds() + (date.getHours() * 60 * 60), 10);
      nroComunicado = "" + parseInt(date.getFullYear(), 10) + parseInt(date.getMonth() + 1, 10) + parseInt(date.getDate(), 10) + seconds;
      $("#comunicado").val(nroComunicado);
      $("#nroComunicado").html(nroComunicado);
    }
    rest = new H5.Rest({
      url: H5.Data.restURL,
      table: "ocorrencia",
      fields: "id_ocorrencia",
      parameters: "nro_ocorrencia%3D'" + $("#comunicado").prop('value') + "'"
    });
    $.each(rest.data, function(e, prop) {
      return $.each(prop, function(nameField, nameValue) {
        return idOcorrencia = nameValue;
      });
    });
    rest = new H5.Rest({
      url: H5.Data.restURL,
      table: "produto_onu",
      fields: "id_produto_onu,nome,num_onu,classe_risco",
      order: "nome"
    });
    _tipoProdutoOnu = rest.data;
    rest = new H5.Rest({
      url: H5.Data.restURL,
      table: "produto_outro",
      fields: "id_produto_outro,nome",
      order: "nome"
    });
    _tipoProdutoOutro = rest.data;
    nroOcorrencia = $("#comunicado").val();
    rest = new H5.Rest({
      url: H5.Data.restURL,
      table: "municipio",
      fields: "id_municipio as id, nome as value, id_uf",
      order: "value"
    });
    _municipios = rest.data;
    $(".accordion-body").on("shown", function() {
      var delay, stop;
      if (_shownAccordion !== this) {
        _shownAccordion = this;
        stop = $(this).offset().top - 40;
        delay = 300;
        $("body, html").animate({
          scrollTop: stop
        }, delay);
        return false;
      }
    });
    bingKey = "AsyRHq25Hv8jQbrAIVSeZEifWbP6s1nq1RQfDeUf0ycdHogebEL7W2dxgFmPJc9h";
    binghybrid = new L.BingLayer(bingKey, {
      type: "AerialWithLabels",
      attribution: ""
    });
    $('#minimap').css("height", "371px");
    $('#minimap').css("width", "100%");
    $('#minimap').css("box-shadow", "0 0 0 1px rgba(0, 0, 0, 0.15)");
    $('#minimap').css("border-radius", "4px");
    Marker = new L.Marker([0, 0], {
      draggable: true
    });
    doubleClick = true;
    if (window.parent.H5.isMobile.any()) {
      doubleClick = false;
    }
    minimapView = new L.Map("minimap", {
      center: new L.LatLng(-10.0, -50.0),
      zoom: 3,
      layers: [binghybrid],
      zoomControl: true,
      doubleClickZoom: doubleClick
    });
    isLoadForm = $(window.top.document.getElementById("optionsAtualizarAcidente")).is(":checked");
    shapeLoadedFromDB = $("#shapeLoaded").prop("checked");
    drawAPI = new H5.Draw({
      map: minimapView,
      url: H5.Data.restURL,
      uniquePoint: true,
      reloadShape: shapeLoadedFromDB,
      srid: '4674',
      buttons: {
        marker: true,
        polyline: true,
        polygon: true,
        rectangle: true,
        circle: true,
        edit: false,
        remove: true
      },
      tables: {
        marker: {
          table: "tmp_pon",
          fields: ["id_tmp_pon", "descricao", "shape", "nro_ocorrencia"],
          uniqueField: "id_tmp_pon",
          defaultValues: {
            nro_ocorrencia: nroOcorrencia
          }
        },
        polyline: {
          table: "tmp_lin",
          fields: ["id_tmp_lin", "descricao", "shape", "nro_ocorrencia"],
          uniqueField: "id_tmp_lin",
          defaultValues: {
            nro_ocorrencia: nroOcorrencia
          }
        },
        polygon: {
          table: "tmp_pol",
          fields: ["id_tmp_pol", "descricao", "shape", "nro_ocorrencia"],
          uniqueField: "id_tmp_pol",
          defaultValues: {
            nro_ocorrencia: nroOcorrencia
          }
        }
      }
    });
    if (isLoadForm && !shapeLoadedFromDB) {
      pointTable = {
        fields: ['id_ocorrencia_pon as id_tmp_pon', 'descricao', 'shape', nroOcorrencia + ' as nro_ocorrencia'],
        name: 'ocorrencia_pon',
        parameters: {
          field: 'id_ocorrencia',
          value: idOcorrencia
        }
      };
      polygonTable = {
        fields: ['id_ocorrencia_pol as id_tmp_pol', 'descricao', 'shape', nroOcorrencia + ' as nro_ocorrencia'],
        name: 'ocorrencia_pol',
        parameters: {
          field: 'id_ocorrencia',
          value: idOcorrencia
        }
      };
      lineTable = {
        fields: ['id_ocorrencia_lin as id_tmp_lin', 'descricao', 'shape', nroOcorrencia + ' as nro_ocorrencia'],
        name: 'ocorrencia_lin',
        parameters: {
          field: 'id_ocorrencia',
          value: idOcorrencia
        }
      };
      drawAPI.editShapes(pointTable, polygonTable, lineTable);
    }
    GeoSearch = {
      _provider: new L.GeoSearch.Provider.Google,
      _geosearch: function(qry, showAddress) {
        var error, results, url;
        try {
          if (typeof this._provider.GetLocations === "function") {
            return results = this._provider.GetLocations(qry, (function(results) {
              return this._processResults(results, showAddress);
            }).bind(this));
          } else {
            url = this._provider.GetServiceUrl(qry);
            return $.getJSON(url, data((function() {
              var error;
              try {
                results = this._provider.ParseJSON(data);
                return this._processResults(results);
              } catch (_error) {
                error = _error;
                return this._printError(error);
              }
            }).bind(this)));
          }
        } catch (_error) {
          error = _error;
          return this._printError(error);
        }
      },
      _processResults: function(results, showAddress) {
        if (results) {
          if (showAddress) {
            return this._showAddres(results[0].Label);
          } else {
            return this._showLocation(results[0]);
          }
        }
      },
      _showLocation: function(location) {
        var latlng;
        latlng = new L.LatLng(location.Y, location.X);
        drawAPI.setPoint(latlng);
        minimapView.setView(latlng, 15, false);
        if (!window.parent.H5.isMobile.any()) {
          window.parent.H5.Map.base.setView(latlng, 10, false);
        }
        $("#inputLat").val(location.Y);
        return $("#inputLng").val(location.X);
      },
      _showAddres: function(label) {
        var address;
        $("#inputMunicipio").val("");
        $("#inputUF").val("");
        $("#inputEndereco").val("");
        return address = this._parseLabel(label);
      },
      _parseLabel: function(label) {
        var address, cepRegExp, i, indexCity, labelParts, result, ret, strAdd, _i;
        labelParts = label.split(", ");
        address = {};
        if (labelParts.length <= 1) {
          return null;
        }
        cepRegExp = new RegExp("[0-9]{1,}-[0-9]{1,}");
        result = cepRegExp.test(labelParts[labelParts.length - 2]);
        if (result) {
          console.log(labelParts[labelParts.length - 2]);
          indexCity = labelParts.length - 3;
        } else {
          indexCity = labelParts.length - 2;
        }
        ret = this._parseCidade(labelParts[indexCity]);
        strAdd = "";
        for (i = _i = 0; _i < indexCity; i = _i += 1) {
          strAdd += labelParts[i] + " ";
        }
        return $("#inputEndereco").val(strAdd);
      },
      _parseCidade: function(string) {
        var subCidade, _this;
        subCidade = string.split(" - ");
        if (subCidade.length > 1) {
          this._parseEstado(subCidade[1]);
          _this = this;
          $('#dropdownMunicipio option').filter(function() {
            return $(this).text().latinise() === subCidade[0].latinise();
          }).prop('selected', true);
        } else {
          this._parseEstado(string);
          $("#dropdownMunicipio").val("0");
        }
        return $("#dropdownMunicipio").trigger('change');
      },
      _parseEstado: function(string) {
        var estados, uf;
        estados = ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espirito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"];
        uf = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
        if (__indexOf.call(estados, string) >= 0 || __indexOf.call(uf, string) >= 0) {
          if (string.length > 2) {
            $('#dropdownUF option').filter(function() {
              return $(this).text() === uf[estados.indexOf(string)];
            }).prop('selected', true);
          } else {
            $('#dropdownUF option').filter(function() {
              return $(this).text() === string;
            }).prop('selected', true);
          }
          return $("#dropdownUF").trigger('change');
        }
      },
      _printError: function(error) {
        return alert("Erro na Busca: " + error);
      }
    };
    minimapView.on('draw:created', function(event) {
      var layer, qry, type;
      type = event.layerType;
      layer = event.layer;
      if ((type === 'marker') && (($("#inputLat").prop("value")) !== "") && (($("#inputLng").prop("value")) !== "")) {
        qry = ($("#inputLat").prop("value")) + "," + ($("#inputLng").prop("value"));
        return GeoSearch._geosearch(qry, true);
      }
    });
    $("#inputLat").add("#inputLng").on("change", function() {
      var lat, latlng, lng;
      if (($("#inputLat").val() !== "") && ($("#inputLng").val() !== "")) {
        lat = drawAPI.DMS2DecimalDegree($("#inputLat").val());
        lng = drawAPI.DMS2DecimalDegree($("#inputLng").val());
        latlng = new L.LatLng(lat, lng);
        return drawAPI.setPoint(latlng, '4674');
      }
    });
    $("#inputEndereco").on('keyup', function(event) {
      var enterKey, municipio, municipioVal, uf, ufVal;
      enterKey = 13;
      if ($(this).val() !== "") {
        if ($("#oceano").is(":checked")) {
          $("#oceano").click();
        }
        $("#oceano").attr("disabled", "disabled");
        $("#dropdownBaciaSedimentar").val("");
      } else {
        $("#oceano").removeAttr("disabled");
      }
      if (event.keyCode === enterKey) {
        municipioVal = document.getElementById('dropdownMunicipio').value;
        municipio = $("#dropdownMunicipio option[value='" + municipioVal + "']");
        ufVal = document.getElementById('dropdownUF').value;
        uf = $("#dropdownUF option[value='" + ufVal + "']");
        if (municipio.html().length === 0 && uf.html().length === 0) {
          return GeoSearch._geosearch(this.value);
        } else {
          return GeoSearch._geosearch(this.value + ", " + municipio.html() + " - " + uf.html());
        }
      }
    });
    addSelection = function(idField, value) {
      var field;
      field = document.getElementById(idField);
      return field.innerHTML = value;
    };
    $(function() {
      var labelOutros, productsOnu, tipoDanoIdentificado, tipoEvento, tipoFonteInformacao, tipoInstituicaoAtuando, tipoLocalizacao, total;
      tipoLocalizacao = document.getElementById("tipoLocalizacao");
      rest = new H5.Rest({
        url: H5.Data.restURL,
        table: "tipo_localizacao",
        fields: "id_tipo_localizacao, des_tipo_localizacao",
        order: "id_tipo_localizacao"
      });
      total = rest.data.length;
      labelOutros = "";
      $.each(rest.data, function(key, value) {
        var input, label, span;
        input = document.createElement("input");
        input.id = "TL" + value.id_tipo_localizacao;
        input.name = "tipoLocalizacao[]";
        input.type = "checkbox";
        input.value = value.id_tipo_localizacao;
        if (($("#semOrigem").attr("checked")) != null) {
          input.disabled = "disabled";
        }
        $("span[data-id='postTL']").each(function() {
          if (this.innerHTML === input.value) {
            input.checked = "checked";
            return $(this).remove();
          }
        });
        span = document.createElement("span");
        span.innerHTML = value.des_tipo_localizacao;
        label = document.createElement("label");
        $(label).addClass("checkbox");
        $(label).append(input, span);
        if (value.des_tipo_localizacao !== "Outro(s)") {
          return $(tipoLocalizacao).append(label);
        } else {
          return labelOutros = label;
        }
      });
      $(tipoLocalizacao).append(labelOutros);
      _tipoLocalizacao = tipoLocalizacao;
      tipoEvento = document.getElementById("tipoEvento");
      rest = new H5.Rest({
        url: H5.Data.restURL,
        table: "tipo_evento",
        fields: "id_tipo_evento, nome",
        order: "id_tipo_evento"
      });
      total = rest.data.length;
      labelOutros = "";
      $.each(rest.data, function(key, value) {
        var input, label, span;
        input = document.createElement("input");
        input.id = "TE" + value.id_tipo_evento;
        input.name = "tipoEvento[]";
        input.type = "checkbox";
        input.value = value.id_tipo_evento;
        if (($("#semEvento").attr("checked")) != null) {
          input.disabled = "disabled";
        }
        $("span[data-id='postTE']").each(function() {
          if (this.innerHTML === input.value) {
            input.checked = "checked";
            return $(this).remove();
          }
        });
        span = document.createElement("span");
        span.innerHTML = value.nome;
        label = document.createElement("label");
        $(label).addClass("checkbox");
        $(label).append(input, span);
        if (value.nome !== "Outro(s)") {
          return $(tipoEvento).append(label);
        } else {
          return labelOutros = label;
        }
      });
      $(tipoEvento).append(labelOutros);
      _tipoEvento = tipoEvento;
      tipoDanoIdentificado = document.getElementById("tipoDanoIdentificado");
      rest = new H5.Rest({
        url: H5.Data.restURL,
        table: "tipo_dano_identificado",
        fields: "id_tipo_dano_identificado, nome",
        order: "id_tipo_dano_identificado"
      });
      total = rest.data.length;
      labelOutros = "";
      $.each(rest.data, function(key, value) {
        var input, label, span;
        input = document.createElement("input");
        input.id = "TDI" + value.id_tipo_dano_identificado;
        input.name = "tipoDanoIdentificado[]";
        input.type = "checkbox";
        input.value = value.id_tipo_dano_identificado;
        if (($("#semDanos").attr("checked")) != null) {
          input.disabled = "disabled";
        }
        $("span[data-id='postTDI']").each(function() {
          if (this.innerHTML === input.value) {
            input.checked = "checked";
            return $(this).remove();
          }
        });
        span = document.createElement("span");
        span.innerHTML = value.nome;
        label = document.createElement("label");
        $(label).addClass("checkbox");
        $(label).append(input, span);
        if (value.nome !== "Outro(s)") {
          return $(tipoDanoIdentificado).append(label);
        } else {
          return labelOutros = label;
        }
      });
      $(tipoDanoIdentificado).append(labelOutros);
      _tipoDanoIdentificado = tipoDanoIdentificado;
      tipoInstituicaoAtuando = document.getElementById("tipoInstituicaoAtuando");
      rest = new H5.Rest({
        url: H5.Data.restURL,
        table: "instituicao_atuando_local",
        fields: "id_instituicao_atuando_local, nome",
        order: "id_instituicao_atuando_local"
      });
      total = rest.data.length;
      labelOutros = "";
      $.each(rest.data, function(key, value) {
        var input, label, span;
        input = document.createElement("input");
        input.id = "IAL" + value.id_instituicao_atuando_local;
        input.name = "instituicaoAtuandoLocal[]";
        input.type = "checkbox";
        input.value = value.id_instituicao_atuando_local;
        if (($("#semInstituicao").attr("checked")) != null) {
          input.disabled = "disabled";
        }
        $("span[data-id='postIAL']").each(function() {
          if (this.innerHTML === input.value) {
            input.checked = "checked";
            return $(this).remove();
          }
        });
        span = document.createElement("span");
        span.innerHTML = value.nome;
        label = document.createElement("label");
        $(label).addClass("checkbox");
        $(label).append(input, span);
        if (value.nome !== "Outra(s)") {
          return $(tipoInstituicaoAtuando).append(label);
        } else {
          return labelOutros = label;
        }
      });
      $(tipoInstituicaoAtuando).append(labelOutros);
      _tipoInstituicaoAtuando = tipoInstituicaoAtuando;
      tipoFonteInformacao = document.getElementById("tipoFonteInformacao");
      rest = new H5.Rest({
        url: H5.Data.restURL,
        table: "tipo_fonte_informacao",
        fields: "id_tipo_fonte_informacao, nome",
        order: "id_tipo_fonte_informacao"
      });
      total = rest.data.length;
      labelOutros = "";
      $.each(rest.data, function(key, value) {
        var input, label, span;
        input = document.createElement("input");
        input.id = "TFI" + value.id_tipo_fonte_informacao;
        input.name = "tipoFonteInformacao[]";
        input.type = "checkbox";
        input.value = value.id_tipo_fonte_informacao;
        $("span[data-id='postTFI']").each(function() {
          if (this.innerHTML === input.value) {
            input.checked = "checked";
            $(this).remove();
            if (input.value === "5") {
              return $("#descOutrasFontInfo").show();
            }
          }
        });
        span = document.createElement("span");
        span.innerHTML = value.nome;
        label = document.createElement("label");
        $(label).addClass("checkbox");
        $(label).append(input, span);
        if (value.nome !== "Outra(s)") {
          return $(tipoFonteInformacao).append(label);
        } else {
          return labelOutros = label;
        }
      });
      $(tipoFonteInformacao).append(labelOutros);
      _tipoFonteInformacao = tipoFonteInformacao;
      productsOnu = [];
      $.each(_tipoProdutoOnu, function() {
        return productsOnu.push(this.nome);
      });
      $("#dropdownUF").on('change', function() {
        if ($(this).val() !== '') {
          $("#dropdownMunicipio").find('option').remove();
          $('<option>').val("0").text("Sem Município").appendTo('#dropdownMunicipio');
          return $.each(_municipios, function() {
            var value;
            value = $("#dropdownUF").val();
            if (this.id_uf.toString() === value) {
              return $('<option>').val(this.id).text(this.value).appendTo('#dropdownMunicipio');
            }
          });
        }
      });
      $("#oceano").on('click', function() {
        if ($(this).is(":checked")) {
          return $("#spanBaciaSed").removeAttr("style");
        } else {
          return $("#spanBaciaSed").attr("style", "display:none;");
        }
      });
      $("#semNavioInstalacao").on('click', function() {
        if ($(this).is(":checked")) {
          $("#inputNomeNavio").attr("disabled", "disabled");
          $("#inputNomeInstalacao").attr("disabled", "disabled");
          $("#navio").attr("disabled", "disabled");
          return $("#instalacao").attr("disabled", "disabled");
        } else {
          if (!$("#instalacao").is(":checked")) {
            $("#inputNomeNavio").removeAttr("disabled");
          }
          if (!$("#navio").is(":checked")) {
            $("#inputNomeInstalacao").removeAttr("disabled");
          }
          $("#navio").removeAttr("disabled");
          return $("#instalacao").removeAttr("disabled");
        }
      });
      $("#semDataObs").on('click', function() {
        if ($(this).is(":checked")) {
          $("#inputDataObs").attr("disabled", "disabled");
          $("#inputHoraObs").attr("disabled", "disabled");
          $("#PerObsMatu").attr("disabled", "disabled");
          $("#PerObsVesper").attr("disabled", "disabled");
          $("#PerObsNotu").attr("disabled", "disabled");
          return $("#PerObsMadru").attr("disabled", "disabled");
        } else {
          $("#inputDataObs").removeAttr("disabled");
          $("#inputHoraObs").removeAttr("disabled");
          $("#PerObsMatu").removeAttr("disabled");
          $("#PerObsVesper").removeAttr("disabled");
          $("#PerObsNotu").removeAttr("disabled");
          return $("#PerObsMadru").removeAttr("disabled");
        }
      });
      $("#semDataInci").on('click', function() {
        if ($(this).is(":checked")) {
          $("#inputDataInci").attr("disabled", "disabled");
          $("#inputHoraInci").attr("disabled", "disabled");
          $("#PerInciMatu").attr("disabled", "disabled");
          $("#PerInciVesper").attr("disabled", "disabled");
          $("#PerInciNotu").attr("disabled", "disabled");
          $("#PerInciMadru").attr("disabled", "disabled");
          return $("#dtFeriado").attr("disabled", "disabled");
        } else {
          $("#inputDataInci").removeAttr("disabled");
          $("#inputHoraInci").removeAttr("disabled");
          $("#PerInciMatu").removeAttr("disabled");
          $("#PerInciVesper").removeAttr("disabled");
          $("#PerInciNotu").removeAttr("disabled");
          $("#PerInciMadru").removeAttr("disabled");
          return $("#dtFeriado").removeAttr("disabled");
        }
      });
      $("#semOrigem").on('click', function() {
        if ($(this).is(":checked")) {
          $("input[name='tipoLocalizacao[]']").each(function() {
            return $(this).attr("disabled", "disabled");
          });
          $("#inputOrigemOutro").attr("disabled", "disabled");
          return $("#inputCompOrigem").attr("disabled", "disabled");
        } else {
          $("input[name='tipoLocalizacao[]']").each(function() {
            return $(this).removeAttr("disabled");
          });
          $("#inputOrigemOutro").removeAttr("disabled");
          return $("#inputCompOrigem").removeAttr("disabled");
        }
      });
      $("#semEvento").on('click', function() {
        if ($(this).is(":checked")) {
          $("input[name='tipoEvento[]']").each(function() {
            return $(this).attr("disabled", "disabled");
          });
          $("#inputEventoOutro").attr("disabled", "disabled");
          return $("#inputCompEvento").attr("disabled", "disabled");
        } else {
          $("input[name='tipoEvento[]']").each(function() {
            return $(this).removeAttr("disabled");
          });
          $("#inputEventoOutro").removeAttr("disabled");
          return $("#inputCompEvento").removeAttr("disabled");
        }
      });
      $("#semProduto").on('click', function() {
        if ($(this).is(":checked")) {
          $("#myTable").attr("style", "display:none;");
          return $("#productsInfo").attr("style", "display:none;");
        } else {
          $("#myTable").removeAttr("style");
          return $("#productsInfo").removeAttr("style");
        }
      });
      $("#semSubstancia").on('click', function() {
        if ($(this).is(":checked")) {
          $("#inputTipoSubstancia").attr("disabled", "disabled");
          return $("#inputVolumeEstimado").attr("disabled", "disabled");
        } else {
          $("#inputTipoSubstancia").removeAttr("disabled");
          return $("#inputVolumeEstimado").removeAttr("disabled");
        }
      });
      $("#semCausa").on('click', function() {
        if ($(this).is(":checked")) {
          return $("#inputCausaProvavel").attr("disabled", "disabled");
        } else {
          return $("#inputCausaProvavel").removeAttr("disabled");
        }
      });
      $("#TFI5").on('click', function() {
        if ($(this).is(":checked")) {
          return $("#descOutrasFontInfo").show();
        } else {
          return $("#descOutrasFontInfo").hide();
        }
      });
      $("#semDanos").on('click', function() {
        if ($(this).is(":checked")) {
          $("input[name='tipoDanoIdentificado[]']").each(function() {
            return $(this).attr("disabled", "disabled");
          });
          $("#inputDanoOutro").attr("disabled", "disabled");
          $("#inputCompDano").attr("disabled", "disabled");
          return $("#inputDesDanos").attr("disabled", "disabled");
        } else {
          $("input[name='tipoDanoIdentificado[]']").each(function() {
            return $(this).removeAttr("disabled");
          });
          $("#inputDanoOutro").removeAttr("disabled");
          $("#inputCompDano").removeAttr("disabled");
          return $("#inputDesDanos").removeAttr("disabled");
        }
      });
      $("#semInstituicao").on('click', function() {
        if ($(this).is(":checked")) {
          $("input[name='instituicaoAtuandoLocal[]']").each(function() {
            return $(this).attr("disabled", "disabled");
          });
          $("#inputInstituicaoOutro").attr("disabled", "disabled");
          $("#inputCompInstituicao").attr("disabled", "disabled");
          $("#inputInfoInstituicaoNome").attr("disabled", "disabled");
          return $("#inputInfoInstituicaoTelefone").attr("disabled", "disabled");
        } else {
          $("input[name='instituicaoAtuandoLocal[]']").each(function() {
            return $(this).removeAttr("disabled");
          });
          $("#inputInstituicaoOutro").removeAttr("disabled");
          $("#inputCompInstituicao").removeAttr("disabled");
          $("#inputInfoInstituicaoNome").removeAttr("disabled");
          return $("#inputInfoInstituicaoTelefone").removeAttr("disabled");
        }
      });
      $("#semResponsavel").on('click', function() {
        if ($(this).is(":checked")) {
          $("#inputResponsavel").attr("disabled", "disabled");
          $("#inputCPFCNPJ").attr("disabled", "disabled");
          return $("#slctLicenca").attr("disabled", "disabled");
        } else {
          $("#inputResponsavel").removeAttr("disabled");
          $("#inputCPFCNPJ").removeAttr("disabled");
          return $("#slctLicenca").removeAttr("disabled");
        }
      });
      return $("#semProcedimentos").on('click', function() {
        if ($(this).is(":checked")) {
          $("#planoEmergNao").attr("disabled", "disabled");
          $("#planoEmergSim").attr("disabled", "disabled");
          $("#planoEmergSemInformacao").attr("disabled", "disabled");
          $("#planoAcionado").attr("disabled", "disabled");
          $("#outrasMedidas").attr("disabled", "disabled");
          return $("#inputMedidasTomadas").attr("disabled", "disabled");
        } else {
          $("#planoEmergNao").removeAttr("disabled");
          $("#planoEmergSim").removeAttr("disabled");
          $("#planoEmergSemInformacao").removeAttr("disabled");
          $("#planoAcionado").removeAttr("disabled");
          $("#outrasMedidas").removeAttr("disabled");
          return $("#inputMedidasTomadas").removeAttr("disabled");
        }
      });
    });
    $("#inputDataObs").on('change', function() {
      var actualDate, ano, dia, mes, valiDate;
      if ($(this).val() !== "") {
        dia = $(this).val().split("/")[0];
        mes = $(this).val().split("/")[1];
        ano = $(this).val().split("/")[2];
        date = new Date(mes + "/" + dia + "/" + ano);
        actualDate = new Date();
        valiDate = $.datepicker.formatDate('dd/mm/yy', date);
        if ((valiDate === $(this).val()) && (actualDate.getFullYear() === date.getFullYear())) {
          return $("#diaObsSemana").val(date.getDay());
        } else {
          $(this).val("");
          return $("#diaObsSemana").val("");
        }
      }
    });
    $("#inputDataInci").on('change', function() {
      var actualDate, ano, dia, mes, valiDate;
      if ($(this).val() !== "") {
        dia = $(this).val().split("/")[0];
        mes = $(this).val().split("/")[1];
        ano = $(this).val().split("/")[2];
        date = new Date(mes + "/" + dia + "/" + ano);
        actualDate = new Date();
        valiDate = $.datepicker.formatDate('dd/mm/yy', date);
        if ((valiDate === $(this).val()) && (actualDate.getFullYear() === date.getFullYear())) {
          return $("#diaInciSemana").val(date.getDay());
        } else {
          $(this).val("");
          return $("#diaInciSemana").val("");
        }
      }
    });
    $("#inputDataObs").change();
    $("#inputDataInci").change();
    $("#inputHoraObs").on('change', function() {
      var hora, minuto, obsHour;
      if (($(this).prop('value')) !== "") {
        hora = $(this).val().split(":")[0];
        minuto = $(this).val().split(":")[1];
        if (((-1 < hora && hora < 23)) && ((-1 < minuto && minuto < 60))) {
          obsHour = parseInt($(this).prop('value').split(':')[0], 10);
          if (obsHour < 6) {
            return $("#PerObsMadru").prop('checked', 'checked');
          } else if (obsHour < 12) {
            return $("#PerObsMatu").prop('checked', 'checked');
          } else if (obsHour < 18) {
            return $("#PerObsVesper").prop('checked', 'checked');
          } else {
            $("#PerObsNotu").prop('checked', 'checked');
            return $("#divPeriodoObs").css('display', 'none');
          }
        } else {
          $("#divPeriodoObs").prop('style', '');
          return $(this).val("");
        }
      } else {
        return $("#divPeriodoObs").prop('style', '');
      }
    });
    $("#inputHoraInci").on('change', function() {
      var hora, minuto, obsHour;
      if (($(this).prop('value')) !== "") {
        hora = $(this).val().split(":")[0];
        minuto = $(this).val().split(":")[1];
        if (((-1 < hora && hora < 23)) || ((-1 < minuto && minuto < 60))) {
          obsHour = parseInt($(this).prop('value').split(':')[0], 10);
          if (obsHour < 6) {
            return $("#PerInciMadru").prop('checked', 'checked');
          } else if (obsHour < 12) {
            return $("#PerInciMatu").prop('checked', 'checked');
          } else if (obsHour < 18) {
            return $("#PerInciVesper").prop('checked', 'checked');
          } else {
            $("#PerInciNotu").prop('checked', 'checked');
            return $("#divPeriodoInci").css('display', 'none');
          }
        } else {
          $("#divPeriodoInci").css('display', 'auto;');
          return $(this).val("");
        }
      } else {
        return $("#divPeriodoInci").prop('style', 'display:auto;');
      }
    });
    if (($("#inputHoraObs").prop('value')) !== '') {
      $("#divPeriodoObs").prop('style', 'display:none;');
    }
    if (($("#inputHoraInci").prop('value')) !== '') {
      $("#divPeriodoInci").prop('style', 'display:none;');
    }
    $("#inputNomeNavio").on('change', function() {
      if ($(this).val() === "") {
        return $("#inputNomeInstalacao").removeAttr("disabled");
      } else {
        $("#inputNomeInstalacao").attr("disabled", "disabled");
        return $("#inputNomeNavio").removeAttr("disabled");
      }
    });
    $("#inputNomeInstalacao").on('change', function() {
      if ($(this).val() === "") {
        return $("#inputNomeNavio").removeAttr("disabled");
      } else {
        $("#inputNomeNavio").attr("disabled", "disabled");
        return $("#inputNomeInstalacao").removeAttr("disabled");
      }
    });
    validationString = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW" + "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW" + "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    $("#inputLat").mask("S99\°99\'99.99999999999", {
      'translation': {
        S: {
          pattern: /^-/,
          optional: true
        }
      }
    });
    $("#inputLng").mask("S99\°99\'99.99999999999", {
      'translation': {
        S: {
          pattern: /^-/,
          optional: true
        }
      }
    });
    $("#inputDataObs").mask("99/99/9999");
    $("#inputHoraObs").mask("99:99");
    $("#inputDataInci").mask("99/99/9999");
    $("#inputHoraInci").mask("99:99");
    $("#inputInfoInstituicaoNome").mask(validationString, {
      'translation': {
        W: {
          pattern: /[A-Za-z ]/
        }
      }
    });
    $("#inputInfoInstituicaoTelefone").mask("(99)999999999");
    $("#inputCPFCNPJ").mask("99999999999999");
    $("#inputVolumeEstimado").mask("9999999999999999999999999999");
    $("#inputNomeInformante").mask(validationString, {
      'translation': {
        W: {
          pattern: /[A-Za-z ]/
        }
      }
    });
    $("#inputTelInformante").mask("(99)999999999");
    $('#inputCompOrigem').add('#inputCompEvento').add('#inputCompInstituicao').add('#inputCompDano').add('#inputCausaProvavel').add('#inputMedidasTomadas').add('#inputDesOcorrencia').add('#inputDesObs').add('#inputDesDanos').maxlength({
      alwaysShow: true,
      threshold: 10,
      warningClass: "label label-info",
      limitReachedClass: "label label-important",
      placement: 'bottom',
      preText: '',
      separator: ' de ',
      postText: ' caracteres'
    });
    productsOnu = [];
    $.each(_tipoProdutoOnu, function() {
      var element;
      element = {
        value: this.id_produto_onu,
        text: $.trim(this.nome) + '-' + $.trim(this.num_onu) + '-' + $.trim(this.classe_risco)
      };
      return productsOnu.push(element);
    });
    productsOutro = [];
    $.each(_tipoProdutoOutro, function() {
      var element;
      element = {
        value: this.id_produto_outro,
        text: $.trim(this.nome)
      };
      return productsOutro.push(element);
    });
    if (isLoadForm) {
      onuTable = new H5.Table({
        container: "productOnuTable",
        url: H5.Data.restURL,
        table: "ocorrencia_produto%20join%20produto_onu%20on%20(produto_onu.id_produto_onu%3Docorrencia_produto.id_produto_onu)%20left%20join%20ocorrencia%20on%20(ocorrencia_produto.id_ocorrencia%3Docorrencia.id_ocorrencia)",
        primaryTable: 'ocorrencia_produto',
        parameters: "ocorrencia_produto.id_ocorrencia%3D'" + idOcorrencia + "'",
        fields: {
          id_ocorrencia_produto: {
            columnName: "Identificador",
            isVisible: false
          },
          nome: {
            columnName: "Substância - Nº ONU - CR",
            tableName: "trim(nome) || '-' || trim(num_onu) || '-' || trim(classe_risco) as nome",
            primaryField: "id_produto_onu",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            },
            searchData: productsOnu
          },
          quantidade: {
            columnName: "Qtd.",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              } else if (isNaN(value)) {
                text = 'Não é permitido letras ou caracteres especiais.';
              }
              return text;
            }
          },
          unidade_medida: {
            columnName: "Unidade",
            selectArray: [
              {
                value: "m3",
                text: "Metro Cúbico (m3)"
              }, {
                value: "l",
                text: "Litro (L)"
              }, {
                value: "t",
                text: "Tonelada (T)"
              }, {
                value: "kg",
                text: "Quilograma (Kg)"
              }
            ],
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            }
          },
          id_ocorrencia: {
            columnName: "Nro. Ocorrencia",
            tableName: "ocorrencia_produto.id_ocorrencia",
            defaultValue: idOcorrencia,
            isVisible: false
          }
        },
        uniqueField: {
          field: "id_ocorrencia_produto"
        }
      });
      otherTable = new H5.Table({
        container: "productOutroTable",
        url: H5.Data.restURL,
        table: "ocorrencia_produto%20join%20produto_outro%20on%20(produto_outro.id_produto_outro%3Docorrencia_produto.id_produto_outro)%20left%20join%20ocorrencia%20on%20(ocorrencia_produto.id_ocorrencia%3Docorrencia.id_ocorrencia)",
        primaryTable: 'ocorrencia_produto',
        parameters: "ocorrencia_produto.id_ocorrencia%3D'" + idOcorrencia + "'",
        insertNewType: 'produto_outro',
        fields: {
          id_ocorrencia_produto: {
            columnName: "Identificador",
            isVisible: false
          },
          nome: {
            columnName: "Substância",
            tableName: "trim(nome) as nome",
            primaryField: "id_produto_outro",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            },
            searchData: productsOutro
          },
          quantidade: {
            columnName: "Qtd.",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              } else if (isNaN(value)) {
                text = 'Não é permitido letras ou caracteres especiais.';
              }
              return text;
            }
          },
          unidade_medida: {
            columnName: "Unidade",
            selectArray: [
              {
                value: "m3",
                text: "Metro Cúbico (m3)"
              }, {
                value: "l",
                text: "Litro (L)"
              }, {
                value: "t",
                text: "Tonelada (T)"
              }, {
                value: "kg",
                text: "Quilograma (Kg)"
              }
            ],
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            }
          },
          id_ocorrencia: {
            columnName: "Nro. Ocorrencia",
            tableName: "ocorrencia_produto.id_ocorrencia",
            defaultValue: idOcorrencia,
            isVisible: false
          }
        },
        uniqueField: {
          field: "id_ocorrencia_produto"
        }
      });
    } else {
      onuTable = new H5.Table({
        container: "productOnuTable",
        url: H5.Data.restURL,
        registUpdate: true,
        table: "tmp_ocorrencia_produto%20join%20produto_onu%20on%20(produto_onu.id_produto_onu%3Dtmp_ocorrencia_produto.id_produto_onu)",
        primaryTable: 'tmp_ocorrencia_produto',
        parameters: "nro_ocorrencia%3D'" + nroOcorrencia + "'",
        fields: {
          id_ocorrencia_produto: {
            columnName: "Identificador",
            isVisible: false
          },
          nro_ocorrencia: {
            columnName: " ",
            defaultValue: nroOcorrencia,
            isVisible: false
          },
          nome: {
            columnName: "Substância - Nº ONU - CR",
            tableName: "trim(nome) || '-' || trim(num_onu) || '-' || trim(classe_risco) as nome",
            primaryField: "id_produto_onu",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            },
            searchData: productsOnu
          },
          quantidade: {
            columnName: "Qtd.",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              } else if (isNaN(value)) {
                text = 'Não é permitido letras ou caracteres especiais.';
              }
              return text;
            }
          },
          unidade_medida: {
            columnName: "Unidade",
            selectArray: [
              {
                value: "m3",
                text: "Metro Cúbico (m3)"
              }, {
                value: "l",
                text: "Litro (L)"
              }, {
                value: "t",
                text: "Tonelada (T)"
              }, {
                value: "kg",
                text: "Quilograma (Kg)"
              }
            ],
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            }
          }
        },
        uniqueField: {
          field: "id_ocorrencia_produto"
        }
      });
      otherTable = new H5.Table({
        container: "productOutroTable",
        url: H5.Data.restURL,
        registUpdate: true,
        table: "tmp_ocorrencia_produto%20join%20produto_outro%20on%20(produto_outro.id_produto_outro%3Dtmp_ocorrencia_produto.id_produto_outro)",
        primaryTable: 'tmp_ocorrencia_produto',
        parameters: "nro_ocorrencia%3D'" + nroOcorrencia + "'",
        insertNewType: 'produto_outro',
        fields: {
          id_ocorrencia_produto: {
            columnName: "Identificador",
            isVisible: false
          },
          nro_ocorrencia: {
            columnName: " ",
            defaultValue: nroOcorrencia,
            isVisible: false
          },
          nome: {
            columnName: "Substância",
            tableName: "trim(nome) as nome",
            primaryField: "id_produto_outro",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            },
            searchData: productsOutro
          },
          quantidade: {
            columnName: "Qtd.",
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              } else if (isNaN(value)) {
                text = 'Não é permitido letras ou caracteres especiais.';
              }
              return text;
            }
          },
          unidade_medida: {
            columnName: "Unidade",
            selectArray: [
              {
                value: "m3",
                text: "Metro Cúbico (m3)"
              }, {
                value: "l",
                text: "Litro (L)"
              }, {
                value: "t",
                text: "Tonelada (T)"
              }, {
                value: "kg",
                text: "Quilograma (Kg)"
              }
            ],
            validation: function(value) {
              var text;
              text = '';
              if (value === '' || value === 'Empty') {
                text = 'Valor não pode ser vazio';
              }
              return text;
            }
          }
        },
        uniqueField: {
          field: "id_ocorrencia_produto"
        }
      });
    }
    $("#uploadButton").on('click', function() {
      return $('#inputFile').click();
    });
    if (!parent.H5.logged_in) {
      $("#inputNomeInformante").removeAttr("disabled");
      return $("#inputEmailInformante").removeAttr("disabled");
    }
  });

}).call(this);
