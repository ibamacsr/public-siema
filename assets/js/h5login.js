// Generated by CoffeeScript 1.4.0
(function() {

  $(document).ready(function() {
    var btnLogout, checkedUser, consultTab, containerProgress, divLogin, divLogout, i, inputLoadForm, loggedList, manageTab, progressAnimetion, progressBar, sessionName, textProgress, tipoForm;
    divLogout = window.parent.document.getElementById("divLogout");
    divLogin = window.parent.document.getElementById("divLogin");
    progressBar = window.parent.document.getElementById("authProgress");
    textProgress = window.parent.document.getElementById("textProgress");
    containerProgress = window.parent.document.getElementById("containerProgress");
    checkedUser = window.parent.document.getElementById("checkedUser");
    tipoForm = window.parent.document.getElementById("tipoForm");
    btnLogout = window.parent.document.getElementById("btnLogout");
    inputLoadForm = window.parent.document.getElementById("inputLoadForm");
    loggedList = window.parent.document.getElementsByName("isServIBAMA");
    consultTab = window.parent.document.getElementById("btn-consult");
    manageTab = window.parent.document.getElementById("btn-manag");
    manageTab = window.parent.document.getElementById("li-login");
    sessionName = window.document.getElementById("sessionName");
    $(tipoForm).hide();
    $(btnLogout).hide();
    $(divLogin).show();
    $(divLogout).hide();
    $.each(loggedList, function() {
      return this.checked = 'checked';
    });
    i = 0;
    return progressAnimetion = setInterval(function() {
      $(progressBar).width(i++ + "0%");
      if (i === 15) {
        $(containerProgress).hide();
        $(textProgress).html('Usuário registrado.');
        $(checkedUser).show();
        $(tipoForm).show();
        $(btnLogout).show();
        $(inputLoadForm).show();
        clearInterval(progressAnimetion);
        return window.parent.location.replace(window.parent.location.href);
      }
    }, 100);
  });

}).call(this);
