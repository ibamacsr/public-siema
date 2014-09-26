// Generated by CoffeeScript 1.7.1
(function() {
  var collapse, deleteTempData, history, showButtonsCadastro, validateUpdate;

  history = [];

  collapse = 2;

  $('#addMeModal').on('showed', function() {
    return $(".modal-footer").hide();
  });

  $('#addMeModal').on('hidden', function() {
    var btnBack;
    history = [];
    collapse = 2;
    btnBack = document.getElementById("modalBtnBack");
    btnBack.href = '#tab1';
    $("#modalBtnBack").tab('show');
    $("#modalBtnBack").show();
    $("#modalBtnNext").show();
    $("#submit").hide();
    $("#modalBtnCancel").hide();
    $("#btnClose").hide();
    deleteTempData();
    return $(".modal-footer").show();
  });

  $("#btn-form").click(function(event) {
    return $(".modal-footer").hide();
  });

  $("#modalBtnBack").click(function(event) {
    var btnNext, tab;
    event.preventDefault();
    btnNext = document.getElementById("modalBtnNext");
    if (history.length > 0) {
      tab = history.pop();
      this.href = tab.tab;
      collapse = tab.collapse;
    }
    $(".modal-footer").hide();
    return $(this).tab('show');
  });

  $("#modalBtnCancel").click(function(event) {
    var btnBack, btnNext, nroOcorrencia, rest, tab;
    event.preventDefault();
    btnNext = document.getElementById("modalBtnNext");
    btnBack = document.getElementById("modalBtnBack");
    nroOcorrencia = $(window.top.form_frame.document.getElementById("comunicado")).val();
    if (history.length > 0) {
      tab = history.pop();
      this.href = tab.tab;
      collapse = tab.collapse;
    }
    $(".modal-footer").show();
    $(btnNext).show();
    $(btnBack).show();
    $("#submit").hide();
    $(this).hide();
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
    rest = new window.parent.H5.Rest({
      url: window.parent.H5.Data.restURL,
      table: "tmp_pon",
      parameters: "nro_ocorrencia%3D" + nroOcorrencia,
      restService: "ws_deletequery.php"
    });
    return $(this).tab('show');
  });

  $("#btnBeginForm").click(function(event) {
    var btnLogout, checkedUser, consultTab, containerProgress, i, manageTab, progressAnimetion, progressBar, textProgress, tipoForm;
    if ((document.getElementById('divLogin')) == null) {
      progressBar = document.getElementById("authProgress");
      textProgress = document.getElementById("textProgress");
      containerProgress = document.getElementById("containerProgress");
      checkedUser = document.getElementById("checkedUser");
      tipoForm = document.getElementById("tipoForm");
      btnLogout = document.getElementById("btnSair");
      consultTab = document.getElementById("btn-consult");
      manageTab = document.getElementById("btn-manag");
      $(tipoForm).hide();
      $(btnLogout).hide();
      i = 0;
      progressAnimetion = setInterval(function() {
        $(progressBar).width(i++ + "0%");
        if (i === 15) {
          $(containerProgress).hide();
          $(textProgress).hide();
          $(textProgress).html('Usuário registrado.');
          $(textProgress).fadeToggle();
          $(checkedUser).show();
          $(tipoForm).show();
          $(btnLogout).show();
          return clearInterval(progressAnimetion);
        }
      }, 100);
    }
    if ($("#containerProgress").is(":hidden")) {
      $(tipoForm).show();
      return $(btnLogout).show();
    }
  });

  $("#modalBtnNext").click(function(event) {
    var btnLogout, checkedUser, containerProgress, hasOleo, i, isAcidOleo, isAtual, isOutros, isPubExt, isServIBAMA, nroOcorrencia, progressAnimetion, progressBar, rest, textProgress, tipoForm, validado;
    event.preventDefault();
    history.push({
      tab: "#tab" + collapse,
      collapse: collapse
    });
    this.href = "#tab" + ++collapse;
    if (("#tab" + collapse) === "#tab2") {
      if ((document.getElementById('divLogin')) == null) {
        progressBar = document.getElementById("authProgress");
        textProgress = document.getElementById("textProgress");
        containerProgress = document.getElementById("containerProgress");
        checkedUser = document.getElementById("checkedUser");
        tipoForm = document.getElementById("tipoForm");
        btnLogout = document.getElementById("btnLogout");
        $(tipoForm).hide();
        $(btnLogout).hide();
        i = 0;
        progressAnimetion = setInterval(function() {
          $(progressBar).width(i++ + "0%");
          if (i === 15) {
            $(containerProgress).hide();
            $(textProgress).hide();
            $(textProgress).html('Usuário registrado.');
            $(textProgress).fadeToggle();
            $(checkedUser).show();
            $(tipoForm).show();
            $(btnLogout).show();
            return clearInterval(progressAnimetion);
          }
        }, 100);
      }
      $(".modal-footer").hide();
    } else {
      $(".modal-footer").show();
      if (("#tab" + collapse) === "#tab4") {
        isPubExt = document.getElementById("radioPubExt").checked;
        if (isPubExt) {
          collapse = 5;
          this.href = "#tab" + 5;
        }
      } else if (("#tab" + collapse) === "#tab8") {
        isAcidOleo = document.getElementById("optionsAcidenteOleo").checked;
        isOutros = document.getElementById("optionsAcidenteOutros").checked;
        isAtual = document.getElementById("optionsAtualizarAcidente").checked;
        hasOleo = document.getElementById("hasOleo");
        isServIBAMA = document.getElementById("isServIBAMA");
        hasOleo.checked = isAcidOleo;
      }
    }
    if (("#tab" + collapse) === "#tab8") {
      if (isAtual) {
        validado = validateUpdate();
        if (validado === "true") {
          nroOcorrencia = $("#inputRegistro").prop("value");
          $("#nroOcorrenciaLoad").val(nroOcorrencia);
          showButtonsCadastro();
          $("#formLoad").submit();
          $(this).tab('show');
        } else {
          $(".modal-footer").show();
          this.href = "#tab" + --collapse;
          history.push({
            tab: "#tab" + 2,
            collapse: 2
          });
        }
      } else {
        $("#formCreate").submit();
        showButtonsCadastro();
        $(this).tab('show');
      }
      rest = new window.parent.H5.Rest({
        url: window.parent.H5.Data.restURL,
        table: "tmp_ocorrencia_produto",
        parameters: "date_part\(\'day\'\,now\(\)\-dt_registro\)\>0",
        restService: "ws_deletequery.php"
      });
      rest = new window.parent.H5.Rest({
        url: window.parent.H5.Data.restURL,
        table: "tmp_pon",
        parameters: "date_part\(\'day\'\,now\(\)\-dt_registro\)\>0",
        restService: "ws_deletequery.php"
      });
      rest = new window.parent.H5.Rest({
        url: window.parent.H5.Data.restURL,
        table: "tmp_pol",
        parameters: "date_part\(\'day\'\,now\(\)\-dt_registro\)\>0",
        restService: "ws_deletequery.php"
      });
      return rest = new window.parent.H5.Rest({
        url: window.parent.H5.Data.restURL,
        table: "tmp_lin",
        parameters: "date_part\(\'day\'\,now\(\)\-dt_registro\)\>0",
        restService: "ws_deletequery.php"
      });
    }
  });

  $("#tipoForm").click(function(event) {
    event.preventDefault();
    history.push({
      tab: "#tab2",
      collapse: collapse
    });
    this.href = "#tab7";
    collapse = 7;
    $(".modal-footer").show();
    return $(this).tab('show');
  });

  $("#denunciaAnonima").click(function(event) {
    event.preventDefault();
    history.push({
      tab: "#tab2",
      collapse: collapse
    });
    this.href = "#tab7";
    collapse = 7;
    $(".modal-footer").show();
    return $(this).tab('show');
  });

  $("#btnCadastrarCTF").click(function(event) {
    event.preventDefault();
    history.push({
      tab: "#tab2",
      collapse: collapse
    });
    this.href = "#tab5";
    collapse = 5;
    $(".modal-footer").show();
    return $(this).tab('show');
  });

  $("#optionCPF").on('click', function(event) {
    $("#fieldCPF").prop('style', '');
    $("#fieldCNPJ").prop('style', 'display:none;');
    return $("#inputCNPJ").val("");
  });

  $("#optionCNPJ").on('click', function(event) {
    $("#fieldCNPJ").prop('style', '');
    $("#fieldCPF").prop('style', 'display:none;');
    return $("#inputCPF").val("");
  });

  deleteTempData = function() {
    var nroOcorrencia, rest;
    nroOcorrencia = $(window.top.form_frame.document.getElementById("comunicado")).val();
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

  validateUpdate = function() {
    var erroMsg, nroOcorrencia, validado;
    nroOcorrencia = $("#inputRegistro").prop("value");
    erroMsg = "";
    validado = false;
    $.ajax({
      url: "http://localhost/siema/index.php/form/validateUpdate",
      data: {
        id: nroOcorrencia
      },
      async: false,
      type: "POST",
      dataType: "json",
      success: function(result) {
        validado = result.status;
        return erroMsg = result.mensagem;
      },
      error: function() {
        validado = false;
        return erroMsg = "A requisição falhou. Não foi possível validar a solicitação.";
      }
    });
    if (validado === "false") {
      $("#divErrorUpdate").show();
      $("#divErrorUpdate").html(erroMsg);
      $("#divErrorUpdate").fadeOut(8500);
    }
    return validado;
  };

  showButtonsCadastro = function() {
    $("#submit").show();
    $("#modalBtnNext").hide();
    $("#modalBtnBack").hide();
    return $("#modalBtnCancel").show();
  };

}).call(this);
