// Generated by CoffeeScript 1.9.1
(function() {
  var deleteTempData, html, i, key, properties, ref, ref1, ref2, ref3, ref4, reg, rest;

  H5.Data.restURL = "//" + document.location.host + document.location.pathname + "/rest";

  H5.DB.ocorrencia = {};

  H5.DB.ocorrencia.table = "vw_ocorrencia_consulta";

  H5.DB.ocorrencia.data = {
    init: function() {
      return this.ocorrencia = {};
    },
    populate: function(nro_ocorrencia, municipio, uf, dt_ocorrencia, validado, legado) {
      var self;
      self = this.ocorrencia;
      self[nro_ocorrencia] = {};
      self[nro_ocorrencia].nro_ocorrencia = nro_ocorrencia;
      self[nro_ocorrencia].municipio = municipio;
      self[nro_ocorrencia].uf = uf;
      self[nro_ocorrencia].dt_ocorrencia = dt_ocorrencia;
      self[nro_ocorrencia].validado = validado;
      return self[nro_ocorrencia].legado = legado;
    }
  };

  rest = new H5.Rest({
    url: H5.Data.restURL,
    table: H5.DB.ocorrencia.table,
    fields: "nro_ocorrencia, municipio, uf, dt_ocorrencia, validado, legado",
    order: "validado ASC, dt_ocorrencia ASC"
  });

  H5.DB.ocorrencia.data.init();

  ref = rest.data;
  for (i in ref) {
    properties = ref[i];
    H5.DB.ocorrencia.data.populate(properties.nro_ocorrencia, properties.municipio, properties.uf, properties.dt_ocorrencia, properties.validado, properties.legado);
  }

  H5.DB.usuarios = {};

  H5.DB.usuarios.table = "usuarios";

  H5.DB.usuarios.data = {
    init: function() {
      return this.usuarios = {};
    },
    populate: function(id_usuario, id_perfil, cpf, nome) {
      var self;
      self = this.usuarios;
      self[id_usuario] = {};
      self[id_usuario].id_usuario = id_usuario;
      self[id_usuario].id_perfil = id_perfil;
      self[id_usuario].cpf = cpf;
      return self[id_usuario].nome = nome;
    }
  };

  rest = new H5.Rest({
    url: H5.Data.restURL,
    table: H5.DB.usuarios.table,
    fields: "id_usuario, id_perfil, cpf, nome",
    order: "nome ASC, cpf ASC"
  });

  H5.DB.usuarios.data.init();

  ref1 = rest.data;
  for (i in ref1) {
    properties = ref1[i];
    H5.DB.usuarios.data.populate(properties.id_usuario, properties.id_perfil, properties.cpf, properties.nome);
  }

  $("#btn_manage1").addClass("active");

  $(".nav-sidebar a").on("click", function(event) {
    $(this).each(function() {
      return $(".nav-sidebar a").parent().removeClass("active");
    });
    $(this).parent().addClass("active");
    if ($(this).prop("id") === "btn-manage1") {
      $("#manage1").show();
      $("#manage2").hide();
      $("#manage3").hide();
      return $("#manage4").hide();
    } else if ($(this).prop("id") === "btn-manage2") {
      $("#manage1").hide();
      $("#manage2").show();
      $("#manage3").hide();
      return $("#manage4").hide();
    } else if ($(this).prop("id") === "btn-manage3") {
      $("#manage1").hide();
      $("#manage2").hide();
      $("#manage3").show();
      return $("#manage4").hide();
    } else if ($(this).prop("id") === "btn-manage4") {
      $("#manage1").hide();
      $("#manage2").hide();
      $("#manage3").hide();
      return $("#manage4").show();
    }
  });

  html = '';

  html = '<table class="table table-striped">';

  html += '  <thead>';

  html += '    <tr>';

  html += '      <th>CPF</th>';

  html += '      <th>Nome</th>';

  html += '      <!-- <th>Perfil</th> -->';

  html += '      <th>Excluir</th>';

  html += '    </tr>';

  html += '  </thead>';

  html += '  <tbody id="fbody" class="fbody">';

  ref2 = H5.DB.usuarios.data.usuarios;
  for (key in ref2) {
    reg = ref2[key];
    if (reg.id_perfil === 2) {
      html += '    <tr>';
      html += '      <td>' + reg.cpf + '</td>';
      html += '      <td>' + reg.nome + '</td>';
      html += '      <!-- <td>' + reg.id_perfil + '</td> -->';
      html += '      <td><a class="removeUsuario" data-usuario="' + reg.id_usuario + '"href="#"><i class="icon-trash icon-white"></i></a></td>';
      html += '    </tr>';
    }
  }

  html += '  </tbody>';

  html += '</table>';

  $("#tableUsuario").html(html);

  html = '';

  html = '<table class="table table-striped">';

  html += '  <thead>';

  html += '    <tr>';

  html += '      <th>Número da Ocorrência</th>';

  html += '      <th>Município</th>';

  html += '      <th>UF</th>';

  html += '      <th>Validado</th>';

  html += '      <th>Editar</th>';

  html += '      <th>Excluir</th>';

  html += '    </tr>';

  html += '  </thead>';

  html += '  <tbody id="fbody" class="fbody">';

  ref3 = H5.DB.ocorrencia.data.ocorrencia;
  for (key in ref3) {
    reg = ref3[key];
    if (!reg.legado && reg.validado === 'N') {
      html += '    <tr>';
      html += '      <td>' + reg.nro_ocorrencia + '</td>';
      html += '      <td>' + reg.municipio + '</td>';
      html += '      <td>' + reg.uf + '</td>';
      html += reg.validado === 'S' ? '      <td><span style="color:#0088CC;"><i class="icon-thumbs-up icon-white"></i></span></td>' : '      <td><span style="color:#D80000;"><i class="icon-thumbs-down icon-white"></i></span></td>';
      html += '      <td><a data-toggle="modal" class="editOcorrencia" data-ocorrencia="' + reg.nro_ocorrencia + '"href="#editMeModal"><i class="icon-edit icon-white"></i></a></td>';
      html += '      <td><a class="removeOcorrencia" data-ocorrencia="' + reg.nro_ocorrencia + '"href="#"><i class="icon-trash icon-white"></i></a></td>';
      html += '    </tr>';
    }
  }

  html += '  </tbody>';

  html += '</table>';

  $("#tableNaoValidado").html(html);

  html = '';

  html = '<table class="table table-striped">';

  html += '  <thead>';

  html += '    <tr>';

  html += '      <th>Número da Ocorrência</th>';

  html += '      <th>Município</th>';

  html += '      <th>UF</th>';

  html += '      <th>Validado</th>';

  html += '      <th>Editar</th>';

  html += '      <th>Excluir</th>';

  html += '    </tr>';

  html += '  </thead>';

  html += '  <tbody id="fbody" class="fbody">';

  ref4 = H5.DB.ocorrencia.data.ocorrencia;
  for (key in ref4) {
    reg = ref4[key];
    if (!reg.legado && reg.validado === 'S') {
      html += '    <tr>';
      html += '      <td>' + reg.nro_ocorrencia + '</td>';
      html += '      <td>' + reg.municipio + '</td>';
      html += '      <td>' + reg.uf + '</td>';
      html += reg.validado === 'S' ? '      <td><span style="color:#0088CC;"><i class="icon-thumbs-up icon-white"></i></span></td>' : '      <td><span style="color:#D80000;"><i class="icon-thumbs-down icon-white"></i></span></td>';
      html += '      <td><a data-toggle="modal" class="editOcorrencia" data-ocorrencia="' + reg.nro_ocorrencia + '"href="#editMeModal"><i class="icon-edit icon-white"></i></a></td>';
      html += '      <td><a class="removeOcorrencia" data-ocorrencia="' + reg.nro_ocorrencia + '"href="#"><i class="icon-trash icon-white"></i></a></td>';
      html += '    </tr>';
    }
  }

  html += '  </tbody>';

  html += '</table>';

  $("#tableValidado").html(html);

  $("#searchInput").keyup(function() {
    var data, jo;
    data = this.value.split(" ");
    jo = $(".fbody").find("tr");
    if (this.value === "") {
      jo.show();
      return;
    }
    jo.hide();
    return jo.filter(function(i, v) {
      var $t, element, index, j, len;
      $t = $(this);
      for (index = j = 0, len = data.length; j < len; index = ++j) {
        element = data[index];
        if ($t.is(":contains('" + data[index] + "')")) {
          return true;
        }
      }
      return false;
    }).show();
  }).focus(function() {
    this.value = "";
    return $(this).unbind('focus');
  });

  $('#editMeModal').modal({
    keyboard: false,
    backdrop: false,
    show: false
  });

  $("#editMeModal").draggable({
    handle: ".modal-header"
  });

  $('#editMeModal').on('hidden', function() {
    return deleteTempData();
  });

  deleteTempData = function() {
    var nroOcorrencia;
    nroOcorrencia = $(window.top.form_frame_edit.document.getElementById("comunicado")).val();
    rest = new window.parent.H5.Rest({
      url: window.parent.H5.Data.restURL,
      table: "tmp_ocorrencia_produto",
      parameters: "nro_ocorrencia%3D" + nroOcorrencia,
      restService: "ws_deletequery.php"
    });
    rest = new window.parent.H5.Rest({
      url: window.parent.H5.Data.restURL,
      table: "tmp_pol",
      parameters: "nro_ocorrencia%3D" + nroOcorrencia,
      restService: "ws_deletequery.php"
    });
    rest = new window.parent.H5.Rest({
      url: window.parent.H5.Data.restURL,
      table: "tmp_lin",
      parameters: "nro_ocorrencia%3D" + nroOcorrencia,
      restService: "ws_deletequery.php"
    });
    return rest = new window.parent.H5.Rest({
      url: window.parent.H5.Data.restURL,
      table: "tmp_pon",
      parameters: "nro_ocorrencia%3D" + nroOcorrencia,
      restService: "ws_deletequery.php"
    });
  };

  $("a.removeUsuario").on("click", function(event) {
    var id_usuario;
    event.preventDefault();
    if (confirm("Você deseja excluir essa linha do banco de dados?")) {
      id_usuario = $(this).attr("data-usuario");
      rest = new window.parent.H5.Rest({
        url: window.parent.H5.Data.restURL,
        table: "usuarios",
        parameters: "id_usuario%3D" + id_usuario,
        restService: "ws_deletequery.php"
      });
      if (rest.data.length === 1) {
        return $(this).closest('tr').remove();
      }
    } else {
      return alert("Operação cancelada");
    }
  });

  $("a.editOcorrencia").on("click", function(event) {
    var nroOcorrencia;
    nroOcorrencia = $(this).attr("data-ocorrencia");
    $("#nroOcorrenciaLoadAdmin").val(nroOcorrencia);
    H5.formType = 'validation';
    $("#validationSubmit").attr('style', 'display:none');
    return $("#formLoadAdmin").submit();
  });

  $("a.removeOcorrencia").on("click", function(event) {
    var nroOcorrencia;
    event.preventDefault();
    if (confirm("Você deseja excluir essa linha do banco de dados?")) {
      nroOcorrencia = $(this).attr("data-ocorrencia");
      rest = new H5.Rest({
        url: H5.Data.restURL,
        functionName: "f_deleteOcorrencia",
        parameters: nroOcorrencia,
        restService: "ws_functioncall.php"
      });
      if (rest.data.length === 1) {
        return $(this).closest('tr').remove();
      }
    } else {
      return alert("Operação cancelada");
    }
  });

  $("#manag").hide();

  $("#searchCPF").mask("99999999999");

  $("#searchPerson").on("click", function() {
    console.log("search for persons info");
    $("#errorBox").slideUp('fast');
    $("#infoBox").slideUp('fast');
    return $.ajax({
      url: window.location.href.replace("#", "") + "index.php/Auth/search_user",
      dataType: 'json',
      type: 'get',
      data: {
        'cpf': $("#searchCPF").val()
      },
      success: function(data) {
        if (data) {
          $("#inputNome").val(data.Nome);
          $("#inputEmail").val(data.Desc_Email);
          $("#inputEmail").val(data.Desc_Email);
          $("#infoBox").html("CPF encontrado!").slideDown('slow');
          $("#storePerson").slideDown('slow');
          return console.log('CPF encontrado!');
        } else {
          $("#inputNome").val("");
          $("#inputEmail").val("");
          $("#inputEmail").val("");
          $("#inputTelefone").val("");
          $("#errorBox").html("CPF não encontrado*!").slideDown('slow');
          return console.log('CPF não cadastrado na CNT!');
        }
      },
      error: function(data, status) {
        $("#inputNome").val("");
        $("#inputEmail").val("");
        $("#inputEmail").val("");
        $("#inputTelefone").val("");
        $("#errorBox").html("CPF inválido").slideDown('slow');
        return console.log('CPF inválido!');
      }
    });
  });

  $("#storePerson").on("click", function() {
    console.log("send form to save");
    $("#errorBox").slideUp('fast');
    $("#infoBox").slideUp('fast');
    return $.ajax({
      url: window.location.href.replace("#", "") + "index.php/Auth/create_intern_user",
      dataType: 'json',
      type: 'post',
      data: {
        'id_perfil': document.getElementById('selectPerfil').value,
        'cpf': $('#searchCPF').val(),
        'nome': $('#inputNome').val()
      },
      success: function(data) {
        if (data) {
          $("#infoBox").html("Usuário cadastrado com sucesso!").slideDown('slow');
          $("#storePerson").slideUp('slow');
          return console.log('Usuário cadastrado com sucesso!');
        } else {
          $("#errorBox").html("Usuário já cadastrado!").slideDown('slow');
          $("#storePerson").slideUp('slow');
          return console.log('Usuário já cadastrado!');
        }
      },
      error: function(data, status) {
        $("#inputNome").val("");
        $("#inputEmail").val("");
        $("#inputEmail").val("");
        $("#inputTelefone").val("");
        $("#errorBox").html("Não foi possível cadastrar usuário!").slideDown('slow');
        $("#storePerson").slideUp('slow');
        return console.log('Não foi possível cadastrar usuário!');
      }
    });
  });

  $("#validationSubmit").on('click', function() {
    var input;
    input = document.createElement('input');
    input.style = 'display:none;';
    input.id = 'generatepdf';
    input.name = 'generatepdf';
    input.value = 'true';
    window.top.form_frame_edit.document.formAcidentes.appendChild(input);
    return window.top.form_frame_edit.document.formAcidentes.submit();
  });

}).call(this);
