// Generated by CoffeeScript 1.7.1
(function() {
  var drawTable, i, properties, rest, _ref;

  H5.Data.restURL = "http://" + document.domain + "/siema/rest";

  H5.DB.ocorrencia = {};

  H5.DB.ocorrencia.table = "ocorrencia";

  H5.DB.ocorrencia.data = {
    init: function() {
      return this.ocorrencia = {};
    },
    populate: function(id_ocorrencia, des_ocorrencia) {
      var self;
      self = this.ocorrencia;
      self[id_ocorrencia] = {};
      self[id_ocorrencia].id_ocorrencia = id_ocorrencia;
      return self[id_ocorrencia].des_ocorrencia = des_ocorrencia;
    }
  };

  rest = new H5.Rest({
    url: H5.Data.restURL,
    table: H5.DB.ocorrencia.table,
    fields: "id_ocorrencia, des_ocorrencia"
  });

  H5.DB.ocorrencia.data.init();

  _ref = rest.data;
  for (i in _ref) {
    properties = _ref[i];
    H5.DB.ocorrencia.data.populate(properties.id_ocorrencia, properties.des_ocorrencia);
  }

  $("#btn_manage1").addClass("active");

  $(".nav-sidebar a").on("click", function(event) {
    $(this).each(function() {
      return $("a").parent().removeClass("active");
    });
    $(this).parent().addClass("active");
    if ($(this).prop("id") === "btn-manage1") {
      $("#manage2").hide();
      return $("#manage1").show();
    } else if ($(this).prop("id") === "btn-manage2") {
      $("#manage1").hide();
      return $("#manage2").show();
    }
  });

  drawTable = function() {
    var html, key, reg, _ref1;
    html = '<table class="table table-striped">';
    html += '              <thead>';
    html += '                <tr>';
    html += '                  <th>ID da Ocorrência</th>';
    html += '                  <th>Descrição da Ocorrência</th>';
    html += '                  <th>Editar</th>';
    html += '                </tr>';
    html += '              </thead>';
    html += '              <tbody>';
    _ref1 = H5.DB.ocorrencia.data.ocorrencia;
    for (key in _ref1) {
      reg = _ref1[key];
      html += '                <tr>';
      html += '                  <td>' + reg.id_ocorrencia + '</td>';
      html += '                  <td>' + reg.des_ocorrencia + '</td>';
      html += '                  <td>Editar</td>';
      html += '                </tr>';
    }
    html += '              </tbody>';
    html += '            </table>';
    return $("#table-ocorrencia").html(html);
  };

  drawTable();

  $("#manag").hide();

}).call(this);
