(function() {
  var chart1, chart2, chart5, chart7, chart8, knob1, knob2, knob3, rest, spark1, spark2,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  H5.Data.restURL = "http://" + document.domain + "/siema/rest";

  H5.Data.changed = false;

  H5.Data.region = "Todos";

  H5.Data.regions = ["NO", "NE", "CO", "SE", "SU"];

  H5.Data.regionsLabels = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

  H5.Data.typesOfEvents = ["Derramamento de líquido", "Desastre natural", "Explosão/incêndio", "Lançamento de sólidos", "Mortandade de peixes", "Produtos químicos/embalagens abandonadas", "Rompimento de barragem", "Vazamento de gases", "Outros", "Todos"];

  H5.Data.originOfAccident = ["Rodovia", "Ferrovia", "Terminal/portos/ancoradouros/etc", "Embarcação", "Refinaria", "Plataforma", "Indústria", "Duto", "Barragem", "Armazenamento/depósito", "Posto de combustível", "Outros", "Todos"];

  H5.Data.damageIdentified = ["Óbitos/feridos", "População afetada/evacuada", "Suspensão de abastecimento de água", "Rio/córrego", "Lago", "Mar", "Praia", "Solo", "Águas subterrâneas", "Atmosfera", "Flora", "Fauna", "Unidade de Conservação Federal", "Unidade de Conservação Estadual/Municipal", "Outros", "Todos"];

  H5.Data.institutionLocal = ["IBAMA", "Órgão Estadual ou Municipal de Meio Ambiente", "Defesa Civil", "Corpo de Bombeiros", "Polícia Rodoviária", "Polícia Militar", "Polícia Civil", "Marinha do Brasil", "Empresa especializada em atendimento", "Outra(s)", "Todos"];

  H5.Data.sourceType = ["Comunicado da empresa/responsável", "Órgão Estadual ou Municipal de Meio Ambiente", "Mídia", "Denúncia", "Outra(s) fonte(s)"];

  H5.Data.periodDay = ["Matutino", "Vespertino", "Noturno", "Madrugada"];

  H5.Data.periodDayAbbrv = ["M", "V", "N", "S"];

  H5.Data.thisDate = new Date();

  H5.Data.thisYear = H5.Data.thisDate.getFullYear();

  H5.Data.thisMonth = H5.Data.thisDate.getMonth();

  H5.Data.thisDay = H5.Data.thisDate.getDate();

  H5.Data.thisType = 0;

  H5.Data.thisOrigin = 0;

  H5.Data.months = {
    0: "Jan",
    1: "Fev",
    2: "Mar",
    3: "Abr",
    4: "Mai",
    5: "Jun",
    6: "Jul",
    7: "Ago",
    8: "Set",
    9: "Out",
    10: "Nov",
    11: "Dez"
  };

  if (!H5.isMobile.any()) {
    H5.Data.animate = {
      duration: 500,
      easing: "inAndOut"
    };
  } else {
    H5.Data.animate = {};
  }

  H5.DB.addDB({
    name: 'occurence',
    table: 'vw_ocorrencia'
  });

  H5.DB.occurence.data = {
    init: function() {
      var region, _i, _len, _ref;
      this.regions = {};
      _ref = H5.Data.regions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        region = _ref[_i];
        this.regions[region] = {};
      }
      return this.regions["Todos"] = {};
    },
    populate: function(id_ocorrencia, region, date, state, type, origin, damageIdentified, institutionLocal, sourceType, periodDay) {
      var convertDate, newDamage, newInstitution, newOrigin, newSource, newType, self;
      convertDate = function(dateStr) {
        var dArr;
        dateStr = String(dateStr);
        dArr = dateStr.split("-");
        return new Date(dArr[0], dArr[1] - 1, dArr[2]);
      };
      newType = type.replace(/[{}"]/g, "".split(","));
      newOrigin = origin.replace(/[{}"]/g, "".split(","));
      if (damageIdentified !== void 0) {
        newDamage = damageIdentified.replace(/[{}"]/g, "".split(","));
      } else {
        newDamage = null;
      }
      if (institutionLocal !== void 0) {
        newInstitution = institutionLocal.replace(/[{}"]/g, "".split(","));
      } else {
        newInstitution = null;
      }
      if (sourceType !== void 0) {
        newSource = sourceType.replace(/[{}"]/g, "".split(","));
      } else {
        newSource = null;
      }
      if (__indexOf.call(H5.Data.regions, region) < 0) {
        region = "Todos";
      }
      self = this.regions[region];
      self[id_ocorrencia] = {};
      self[id_ocorrencia].type = newType;
      self[id_ocorrencia].origin = newOrigin;
      self[id_ocorrencia].state = state;
      self[id_ocorrencia].damage = newDamage;
      self[id_ocorrencia].institution = newInstitution;
      self[id_ocorrencia].source = newSource;
      self[id_ocorrencia].period = periodDay;
      self[id_ocorrencia].date = convertDate(date);
      self[id_ocorrencia].year = convertDate(date).getFullYear();
      self[id_ocorrencia].month = convertDate(date).getMonth();
      self[id_ocorrencia].day = convertDate(date).getDate();
      if (this.lastValue) {
        if (this.lastValue.date < self[id_ocorrencia].date) {
          this.lastValue = self[id_ocorrencia];
        }
      } else {
        this.lastValue = self[id_ocorrencia];
      }
    }
  };

  rest = new H5.Rest({
    url: H5.Data.restURL,
    table: H5.DB.occurence.table
  });

  H5.DB.occurence.data.init();

  $.each(rest.data, function(i, properties) {
    var date;
    date = properties.dt_registro;
    if (typeof properties.data_acidente !== 'undefined') {
      date = properties.data_acidente;
    }
    return H5.DB.occurence.data.populate(properties.id_ocorrencia, properties.regiao, date, properties.sigla, properties.eventos, properties.origem, properties.tipos_danos_identificados, properties.institiuicoes_atuando_local, properties.tipos_fontes_informacoes, properties.periodo_ocorrencia);
  });

  H5.Data.thisDate = H5.DB.occurence.data.lastValue.date;

  H5.Data.thisDay = H5.DB.occurence.data.lastValue.day;

  H5.Data.thisMonth = H5.DB.occurence.data.lastValue.month;

  H5.Data.thisYear = H5.DB.occurence.data.lastValue.year;

  H5.Data.selectedYear = H5.Data.thisYear;

  H5.Data.selectedMonth = H5.Data.thisMonth;

  H5.Data.selectedType = 9;

  H5.Data.selectedOrigin = 12;

  chart1 = new H5.Charts.GoogleCharts({
    type: "Line",
    container: "chart1",
    title: "Alerta DETER: Índice Diário",
    buttons: {
      "export": true,
      table: true,
      minimize: true,
      maximize: true
    }
  });

  chart1._yearsSlct = document.getElementById('yearsSlct');

  chart1._monthsSlct = document.getElementById('monthsSlct');

  chart1._typesSlct = document.getElementById('typesSlct');

  chart1._originsSlct = document.getElementById('originsSlct');

  chart1._monthsSlct.options[H5.Data.thisMonth].selected = true;

  chart1._typesSlct.options[9].selected = true;

  chart1._originsSlct.options[12].selected = true;

  $(chart1._monthsSlct).on("change", function(event) {
    H5.Data.selectedMonth = parseInt(chart1._monthsSlct.value);
    if (chart1._monthsSlct.value !== "12") {
      $("#knob1").show();
      $("#knob2").show();
      $("#spark1").show();
      $("#chart8").show();
      knob1.drawChart();
      knob2.drawChart();
      spark1.drawChart();
      chart8.drawChart();
    } else {
      $("#knob1").hide();
      $("#knob2").hide();
      $("#spark1").hide();
      $("#chart8").hide();
    }
    chart1.drawChart();
    knob3.drawChart();
    return spark2.drawChart();
  });

  $(chart1._yearsSlct).on("change", function(event) {
    H5.Data.selectedYear = parseInt(chart1._yearsSlct.value);
    chart2.drawChart();
    chart5.drawChart();
    chart7.drawChart();
    chart8.drawChart();
    knob1.drawChart();
    knob2.drawChart();
    knob3.drawChart();
    spark1.drawChart();
    spark2.drawChart();
    return H5.Data.changed = true;
  });

  $(chart1._typesSlct).on("change", function(event) {
    H5.Data.selectedType = parseInt(chart1._typesSlct.value);
    chart2.drawChart();
    chart5.drawChart();
    chart7.drawChart();
    chart8.drawChart();
    knob1.drawChart();
    knob2.drawChart();
    knob3.drawChart();
    spark1.drawChart();
    return spark2.drawChart();
  });

  $(chart1._originsSlct).on("change", function(event) {
    H5.Data.selectedOrigin = parseInt(chart1._originsSlct.value);
    chart2.drawChart();
    chart5.drawChart();
    chart7.drawChart();
    chart8.drawChart();
    knob1.drawChart();
    knob2.drawChart();
    knob3.drawChart();
    spark1.drawChart();
    return spark2.drawChart();
  });

  chart1.drawChart = function() {
    var contMes, createTable, data, day, daysInMonth, firstPeriod, indexMes, mes, mesIndex, monthLoop, months, options, secondPeriod, titleChart, titleX, todosMeses, _i, _j, _k, _len,
      _this = this;
    createTable = function(region, type, origin, indexMonth) {
      var day, daysInMonth, firstPeriod, secondPeriod, sum, _i;
      sum = 0;
      daysInMonth = new Date(H5.Data.selectedYear, indexMonth + 1, 0).getDate();
      firstPeriod = new Date(H5.Data.selectedYear, indexMonth, 1);
      secondPeriod = new Date(H5.Data.selectedYear, indexMonth, daysInMonth);
      if (todosMeses) {
        daysInMonth = 31;
      }
      for (day = _i = 1; 1 <= daysInMonth ? _i <= daysInMonth : _i >= daysInMonth; day = 1 <= daysInMonth ? ++_i : --_i) {
        $.each(H5.DB.occurence.data.regions[region], function(key, reg) {
          var _ref, _ref1;
          if (type === "Todos" && origin === "Todos") {
            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.day === day) {
              return sum++;
            }
          } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && reg.day === day && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
            return sum++;
          }
        });
        if (!todosMeses) {
          _this.data.setValue(day - 1, 1, _this.data.getValue(day - 1, 1) + sum);
        }
      }
      if (todosMeses) {
        return _this.data.setValue(indexMes, 1, _this.data.getValue(indexMes, 1) + sum);
      }
    };
    todosMeses = H5.Data.selectedMonth === 12;
    months = {
      0: "Janeiro",
      1: "Fevereiro",
      2: "Março",
      3: "Abril",
      4: "Maio",
      5: "Junho",
      6: "Julho",
      7: "Agosto",
      8: "Setembro",
      9: "Outubro",
      10: "Novembro",
      11: "Dezembro"
    };
    this.createChart();
    this.createDataTable();
    if (todosMeses) {
      this.data.addColumn("string", "Mês");
    } else {
      this.data.addColumn("number", "Dia");
    }
    daysInMonth = new Date(H5.Data.selectedYear, H5.Data.selectedMonth + 1, 0).getDate();
    firstPeriod = new Date(H5.Data.selectedYear, H5.Data.selectedMonth, 1);
    secondPeriod = new Date(H5.Data.selectedYear, H5.Data.selectedMonth, daysInMonth);
    data = [];
    monthLoop = new Array();
    if (todosMeses) {
      for (mes = _i = 0; _i <= 11; mes = ++_i) {
        monthLoop[mes] = H5.Data.months[mes];
      }
      this.data.addColumn("number", H5.Data.selectedYear);
      titleChart = "Todos os meses";
    } else {
      monthLoop[0] = H5.Data.selectedMonth;
      titleChart = months[H5.Data.selectedMonth];
      this.data.addColumn("number", titleChart);
    }
    data = [];
    contMes = 1;
    indexMes = 0;
    for (_j = 0, _len = monthLoop.length; _j < _len; _j++) {
      mesIndex = monthLoop[_j];
      indexMes = todosMeses ? monthLoop.indexOf(mesIndex) : mesIndex;
      daysInMonth = new Date(H5.Data.selectedYear, indexMes + 1, 0).getDate();
      firstPeriod = new Date(H5.Data.selectedYear, indexMes, 1);
      secondPeriod = new Date(H5.Data.selectedYear, indexMes, daysInMonth);
      if (todosMeses) {
        /*
        for day in [1..31]
          #Day (x);
          data[0] = day;
        
          #Qtde Ocorrências by month(y)
          for m in [0..11]
            data[m+1] = 0;
        */

        data[0] = monthLoop[indexMes];
        data[1] = 0;
        this.data.addRow(data);
      } else {
        for (day = _k = 1; 1 <= daysInMonth ? _k <= daysInMonth : _k >= daysInMonth; day = 1 <= daysInMonth ? ++_k : --_k) {
          data[0] = day;
          data[1] = 0;
          this.data.addRow(data);
        }
      }
      if (H5.Data.region === "Todos") {
        $.each(H5.DB.occurence.data.regions, function(region, value) {
          return createTable(region, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin], indexMes);
        });
      } else {
        createTable(H5.Data.region, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin], indexMes);
      }
    }
    this.changeTitle("Acidentes: Índice Diário [" + titleChart + "] - [" + H5.Data.selectedYear + "]");
    titleX = todosMeses ? "Meses" : "Dias";
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      legend: {
        position: 'right'
      },
      chartArea: {
        width: "70%",
        height: "70%"
      },
      vAxis: {
        title: "Número de Ocorrências"
      },
      hAxis: {
        title: titleX,
        gridlines: {
          color: "#CCC",
          count: daysInMonth / 5
        }
      },
      animation: H5.Data.animate
    };
    return this.chart.draw(this.data, options);
  };

  chart2 = new H5.Charts.GoogleCharts({
    type: "Area",
    container: "chart2",
    period: 2,
    title: "Acidentes: Índice Mensal",
    buttons: {
      minusplus: true,
      "export": true,
      table: true,
      minimize: true,
      maximize: true
    }
  });

  chart2._addBtn.onclick = function() {
    chart2.options.period++;
    return chart2.drawChart();
  };

  chart2._delBtn.onclick = function() {
    chart2.options.period--;
    return chart2.drawChart();
  };

  chart2.drawChart = function() {
    var data, i, month, options, sumValues, _i, _j, _ref, _ref1,
      _this = this;
    sumValues = function(year, month, type, origin) {
      var firstPeriod, secondPeriod, sum;
      sum = 0;
      firstPeriod = new Date(year, 0, 1);
      secondPeriod = new Date(year, 11, 31);
      if (H5.Data.region === "Todos") {
        $.each(H5.DB.occurence.data.regions, function(key, region) {
          return $.each(region, function(key, reg) {
            var _ref, _ref1;
            if (type === "Todos" && origin === "Todos") {
              if (((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) && (reg.month === month)) {
                return sum++;
              }
            } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && reg.month === month && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
              return sum++;
            }
          });
        });
      } else {
        $.each(H5.DB.occurence.data.regions[H5.Data.region], function(key, reg) {
          var _ref, _ref1;
          if (type === "Todos" && origin === "Todos") {
            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.month === month) {
              return sum++;
            }
          } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && reg.month === month && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
            return sum++;
          }
        });
      }
      return Math.round(sum * 100) / 100;
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Mês");
    for (i = _i = 0, _ref = this.options.period; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.data.addColumn("number", H5.Data.selectedYear - i);
    }
    for (month in H5.Data.months) {
      data = [H5.Data.months[month]];
      month = parseInt(month);
      for (i = _j = 1, _ref1 = this.options.period; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        data[i] = sumValues(H5.Data.selectedYear - i + 1, month, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
      }
      this.data.addRow(data);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "70%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      vAxis: {
        title: "Número de Ocorrências"
      },
      animation: H5.Data.animate
    };
    this._addBtn.disabled = true;
    this._delBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._addBtn.disabled = _this.options.period > H5.Data.thisYear - 2004;
      return _this._delBtn.disabled = _this.options.period < 2;
    });
    return this.chart.draw(this.data, options);
  };

  chart5 = new H5.Charts.GoogleCharts({
    type: "Column",
    container: "chart5",
    period: 1,
    title: "Número de Acidentes Atendidos por Instituições",
    buttons: {
      minusplus: true,
      "export": true,
      table: true,
      minimize: true,
      maximize: true
    }
  });

  chart5._addBtn.onclick = function() {
    chart5.options.period++;
    return chart5.drawChart();
  };

  chart5._delBtn.onclick = function() {
    chart5.options.period--;
    return chart5.drawChart();
  };

  chart5.drawChart = function() {
    var allData, data, i, institution, j, options, sumValues, totalReg, _i, _j, _k, _len, _ref, _ref1, _ref2,
      _this = this;
    sumValues = function(institution, region, year, type, origin) {
      var firstPeriod, secondPeriod, sum;
      sum = 0;
      firstPeriod = new Date(year, 0, 1);
      secondPeriod = new Date(year, 11, 31);
      $.each(H5.DB.occurence.data.regions[region], function(key, reg) {
        var t, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _results, _results1;
        if (reg.institution !== null) {
          if (type === "Todos" && origin === "Todos") {
            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
              _ref1 = reg.institution.split(",");
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                t = _ref1[_i];
                if (t === institution) {
                  _results.push(sum++);
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          } else if ((firstPeriod <= (_ref2 = reg.date) && _ref2 <= secondPeriod) && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
            _ref3 = reg.institution.split(",");
            _results1 = [];
            for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
              t = _ref3[_j];
              if (t === institution) {
                _results1.push(sum++);
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }
        }
      });
      return Math.round((sum * 100) / 100);
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Instituição Ambiental");
    for (i = _i = 0, _ref = this.options.period; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.data.addColumn("number", H5.Data.selectedYear - i);
    }
    data = [];
    _ref1 = H5.Data.institutionLocal;
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      institution = _ref1[_j];
      data[0] = institution;
      totalReg = 0;
      if (H5.Data.region === "Todos") {
        $.each(H5.DB.occurence.data.regions, function(region, reg) {
          var j, _k, _ref2, _results;
          _results = [];
          for (j = _k = 1, _ref2 = _this.options.period; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; j = 1 <= _ref2 ? ++_k : --_k) {
            totalReg = sumValues(institution, region, H5.Data.selectedYear - j + 1, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
            _results.push(data[j] = data[j] >= 0 ? data[j] + totalReg : totalReg);
          }
          return _results;
        });
      } else {
        allData = [H5.Data.region];
        for (j = _k = 1, _ref2 = this.options.period; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; j = 1 <= _ref2 ? ++_k : --_k) {
          data[j] = sumValues(institution, H5.Data.region, H5.Data.selectedYear - j + 1, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
        }
      }
      this.data.addRow(data);
      data = [];
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "70%",
        height: "76%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      bar: {
        groupWidth: "100%"
      },
      vAxis: {
        title: "Número de Acidentes"
      },
      animation: H5.Data.animate
    };
    return this.chart.draw(this.data, options);
  };

  chart7 = new H5.Charts.GoogleCharts({
    type: "Pie",
    container: "chart7",
    period: 0,
    buttons: {
      arrows: true,
      "export": true,
      table: true,
      minimize: true,
      maximize: true
    }
  });

  chart7._leftBtn.onclick = function() {
    chart7.options.period++;
    return chart7.drawChart();
  };

  chart7._rightBtn.onclick = function() {
    chart7.options.period--;
    return chart7.drawChart();
  };

  chart7.drawChart = function() {
    var data, i, options, originTitle, region, sumValues, _i, _ref,
      _this = this;
    sumValues = function(region, year, type, origin) {
      var firstPeriod, secondPeriod, sum;
      sum = 0;
      firstPeriod = new Date(year, 0, 1);
      secondPeriod = new Date(year, 11, 31);
      $.each(H5.DB.occurence.data.regions[region], function(key, reg) {
        var _ref, _ref1;
        if (type === "Todos" && origin === "Todos") {
          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
            return sum++;
          }
        } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
          return sum++;
        }
      });
      return Math.round((sum * 100) / 100);
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Região");
    this.data.addColumn("number", H5.Data.selectedYear);
    for (i = _i = 0, _ref = H5.Data.regions.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      region = H5.Data.regionsLabels[i];
      data = [region];
      data[1] = sumValues(H5.Data.regions[i], H5.Data.selectedYear - this.options.period, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
      this.data.addRow(data);
    }
    region = H5.Data.regions[H5.Data.regions.length + 1];
    data = ["Sem Região Cadastrada"];
    data[1] = sumValues("Todos", H5.Data.selectedYear - this.options.period, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
    this.data.addRow(data);
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      chartArea: {
        width: "90%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      backgroundColor: "transparent"
    };
    originTitle = H5.Data.selectedOrigin === 12 ? "Todos Tipos de Origens" : H5.Data.originOfAccident[H5.Data.selectedOrigin];
    if (H5.Data.selectedType === 9) {
      this.changeTitle(H5.Data.selectedYear - this.options.period + " : Todos Tipos de Eventos" + " : " + originTitle);
    } else {
      this.changeTitle(H5.Data.selectedYear - this.options.period + " : " + H5.Data.typesOfEvents[H5.Data.selectedType] + " : " + originTitle);
    }
    this._rightBtn.disabled = true;
    this._leftBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._rightBtn.disabled = _this.options.period < 1;
      return _this._leftBtn.disabled = _this.options.period >= H5.Data.selectedYear - 2004;
    });
    return this.chart.draw(this.data, options);
  };

  chart8 = new H5.Charts.GoogleCharts({
    type: "Pie",
    container: "chart8",
    period: 1,
    buttons: {
      "export": true,
      table: true,
      minimize: true,
      maximize: true
    }
  });

  chart8.drawChart = function() {
    var data, daysInMonth, firstPeriod, i, options, originTitle, pieText, pieTooltip, region, secondPeriod, sumValues, _i, _ref;
    sumValues = function(region, type, origin) {
      var sum;
      sum = 0;
      $.each(H5.DB.occurence.data.regions[region], function(key, reg) {
        var _ref, _ref1;
        if (type === "Todos" && origin === "Todos") {
          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
            return sum++;
          }
        } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
          return sum++;
        }
      });
      /*
      if firstPeriod > H5.Data.thisDate
        return 1
      else
      */

      return Math.round((sum * 100) / 100);
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Região");
    this.data.addColumn("number", "Número Total de Ocorrências");
    daysInMonth = new Date(H5.Data.selectedYear, H5.Data.selectedMonth + 1, 0).getDate();
    firstPeriod = new Date(H5.Data.selectedYear, H5.Data.selectedMonth, 1);
    secondPeriod = new Date(H5.Data.selectedYear, H5.Data.selectedMonth, daysInMonth);
    if (firstPeriod > H5.Data.thisDate) {
      pieText = "none";
      pieTooltip = "none";
    } else {
      pieText = "percent";
      pieTooltip = "focus";
    }
    for (i = _i = 0, _ref = H5.Data.regions.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      region = H5.Data.regionsLabels[i];
      data = [region];
      data[1] = sumValues(H5.Data.regions[i], H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
      this.data.addRow(data);
    }
    region = H5.Data.regions[H5.Data.regions.length + 1];
    data = ["Sem Região Cadastrada"];
    data[1] = sumValues("Todos", H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
    this.data.addRow(data);
    originTitle = H5.Data.selectedOrigin === 12 ? "Todos Tipos de Origens" : H5.Data.originOfAccident[H5.Data.selectedOrigin];
    if (H5.Data.selectedType === 9) {
      this.changeTitle(chart1._monthsSlct.options[H5.Data.selectedMonth].label + ", " + H5.Data.selectedYear + ": Todos Tipos de Eventos" + " : " + originTitle);
    } else {
      this.changeTitle(chart1._monthsSlct.options[H5.Data.selectedMonth].label + ", " + H5.Data.selectedYear + ": " + H5.Data.typesOfEvents[H5.Data.selectedType] + " : " + originTitle);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      pieSliceText: pieText,
      tooltip: {
        trigger: pieTooltip
      },
      chartArea: {
        width: "90%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      bar: {
        groupWidth: "100%"
      },
      vAxis: {
        title: "Número de Ocorrências"
      },
      animation: H5.Data.animate
    };
    return this.chart.draw(this.data, options);
  };

  spark1 = new H5.Charts.Sparks({
    container: "spark1",
    title: "Total Mensal"
  });

  spark1.drawChart = function() {
    var createTable, data, day, daysInMonth, firstPeriod, secondPeriod, value, _i,
      _this = this;
    createTable = function(region, type, origin) {
      var day, dayValue, _i, _results;
      dayValue = 0;
      _results = [];
      for (day = _i = 1; 1 <= daysInMonth ? _i <= daysInMonth : _i >= daysInMonth; day = 1 <= daysInMonth ? ++_i : --_i) {
        $.each(H5.DB.occurence.data.regions[region], function(key, reg) {
          var _ref, _ref1;
          if (type === "Todos" && origin === "Todos") {
            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.day === day) {
              return dayValue++;
            }
          } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && reg.day === day && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
            return dayValue++;
          }
        });
        _results.push(data[day - 1] = Math.round((data[day - 1] + dayValue) * 100) / 100);
      }
      return _results;
    };
    daysInMonth = new Date(H5.Data.selectedYear, H5.Data.selectedMonth + 1, 0).getDate();
    firstPeriod = new Date(H5.Data.selectedYear, H5.Data.selectedMonth, 1);
    secondPeriod = new Date(H5.Data.selectedYear, H5.Data.selectedMonth, daysInMonth);
    data = [];
    for (day = _i = 1; 1 <= daysInMonth ? _i <= daysInMonth : _i >= daysInMonth; day = 1 <= daysInMonth ? ++_i : --_i) {
      data[day - 1] = 0;
    }
    if (H5.Data.region === "Todos") {
      $.each(H5.DB.occurence.data.regions, function(region, value) {
        return createTable(region, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
      });
    } else {
      createTable(H5.Data.region, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
    }
    value = data[daysInMonth - 1];
    return this.updateInfo(data, value);
  };

  spark2 = new H5.Charts.Sparks({
    container: "spark2",
    title: "Total Período"
  });

  spark2.drawChart = function() {
    var count, data, month, sumValues, value, year;
    sumValues = function(year, month, type, origin) {
      var firstPeriod, secondPeriod, sum;
      sum = 0;
      firstPeriod = new Date(year, 0, 1);
      secondPeriod = new Date(year, month + 1, 0);
      /*
      if month != H5.Data.thisMonth
        secondPeriod = new Date(year, month+1, 0)
      else
        secondPeriod = new Date(year, month, H5.Data.thisDay)
      */

      if (H5.Data.region === "Todos") {
        $.each(H5.DB.occurence.data.regions, function(key, region) {
          return $.each(region, function(key, reg) {
            var _ref, _ref1;
            if (type === "Todos" && origin === "Todos") {
              if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.month === month) {
                return sum++;
              }
            } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && reg.month === month && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
              return sum++;
            }
          });
        });
      } else {
        $.each(H5.DB.occurence.data.regions[H5.Data.region], function(key, reg) {
          var _ref;
          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.month === month && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
            return sum++;
          }
        });
      }
      return Math.round(sum * 100) / 100;
    };
    data = [];
    for (month in H5.Data.months) {
      month = parseInt(month);
      year = H5.Data.selectedYear;
      count = parseInt(H5.Data.selectedMonth);
      if (month <= H5.Data.selectedMonth) {
        data.push(sumValues(year, month, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]));
      } else {
        data.push(0);
      }
    }
    value = 0;
    $.each(data, function() {
      value += this;
      if (value === 600) {
        return alert(value);
      }
    });
    return this.updateInfo(data, Math.round(value * 100) / 100);
  };

  knob1 = new H5.Charts.Knobs({
    container: "knob1",
    title: "Taxa VMAA",
    popover: "Taxa de variação em relação ao mesmo mês do ano anterior",
    color: "coldtohot"
  });

  knob1.drawChart = function() {
    var periodDeforestationRate, value;
    periodDeforestationRate = function(year, month, type, origin) {
      var curDate, curValue, preDate, preValue, sumValues;
      sumValues = function(date) {
        var reg, region, sum, _ref, _ref1, _ref2, _ref3;
        sum = 0;
        if (H5.Data.region === "Todos") {
          for (region in H5.DB.occurence.data.regions) {
            for (reg in H5.DB.occurence.data.regions[region]) {
              reg = H5.DB.occurence.data.regions[region][reg];
              if (type === "Todos" && origin === "Todos") {
                if ((date.getFullYear() <= (_ref = reg.year) && _ref <= date.getFullYear()) && reg.month === date.getMonth()) {
                  sum++;
                }
              } else if ((date.getFullYear() <= (_ref1 = reg.year) && _ref1 <= date.getFullYear()) && reg.month === date.getMonth() && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
                sum++;
              }
            }
          }
        } else {
          for (reg in H5.DB.occurence.data.regions[H5.Data.region]) {
            reg = H5.DB.occurence.data.regions[H5.Data.region][reg];
            if (type === "Todos" && origin === "Todos") {
              if ((date.getFullYear() <= (_ref2 = reg.year) && _ref2 <= date.getFullYear()) && reg.month === date.getMonth()) {
                sum++;
              }
            } else if ((date.getFullYear() <= (_ref3 = reg.year) && _ref3 <= date.getFullYear()) && reg.month === date.getMonth() && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
              sum++;
            }
          }
        }
        return sum;
      };
      curDate = new Date(year, month);
      preDate = new Date(year - 1, month);
      curValue = sumValues(curDate);
      preValue = sumValues(preDate);
      if (preValue === 0) {
        return 0;
      } else {
        return Math.round((curValue - preValue) / preValue * 100);
      }
    };
    value = periodDeforestationRate(H5.Data.selectedYear, H5.Data.selectedMonth, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
    return this.updateInfo(value);
  };

  knob2 = new H5.Charts.Knobs({
    container: "knob2",
    title: "Taxa VMA",
    popover: "Taxa de variação em relação ao mês anterior",
    color: "coldtohot"
  });

  knob2.drawChart = function() {
    var periodDeforestationRate, value;
    periodDeforestationRate = function(year, month, type, origin) {
      var curDate, curValue, preDate, preValue, sumValues;
      sumValues = function(date) {
        var reg, region, sum, _ref, _ref1, _ref2;
        sum = 0;
        if (H5.Data.region === "Todos") {
          for (region in H5.DB.occurence.data.regions) {
            for (reg in H5.DB.occurence.data.regions[region]) {
              reg = H5.DB.occurence.data.regions[region][reg];
              if (type === "Todos" && origin === "Todos") {
                if ((date.getFullYear() <= (_ref = reg.year) && _ref <= date.getFullYear()) && reg.month === date.getMonth()) {
                  sum++;
                }
              } else if ((date.getFullYear() <= (_ref1 = reg.year) && _ref1 <= date.getFullYear()) && reg.month === date.getMonth() && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
                sum++;
              }
            }
          }
        } else {
          for (reg in H5.DB.occurence.data.regions[H5.Data.region]) {
            reg = H5.DB.occurence.data.regions[H5.Data.region][reg];
            if ((date.getFullYear() <= (_ref2 = reg.year) && _ref2 <= date.getFullYear()) && reg.month === date.getMonth() && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
              sum++;
            }
          }
        }
        return sum;
      };
      curDate = new Date(year, month);
      preDate = new Date(year, month - 1);
      curValue = sumValues(curDate);
      preValue = sumValues(preDate);
      if (preValue === 0) {
        return 0;
      } else {
        return Math.round((curValue - preValue) / preValue * 100);
      }
    };
    value = periodDeforestationRate(H5.Data.selectedYear, H5.Data.selectedMonth, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
    return this.updateInfo(value);
  };

  knob3 = new H5.Charts.Knobs({
    container: "knob3",
    title: "Taxa VAA",
    popover: "Taxa de variação em relação ao ano anterior",
    color: "coldtohot"
  });

  knob3.drawChart = function() {
    var periodDeforestationAvgRate, value;
    periodDeforestationAvgRate = function(year, month, type, origin) {
      var curValue, preValue, sumPeriods, sumValues;
      sumValues = function(firstPeriod, secondPeriod) {
        var sum;
        sum = 0;
        if (H5.Data.region === "Todos") {
          $.each(H5.DB.occurence.data.regions, function(key, region) {
            return $.each(region, function(key, reg) {
              var _ref, _ref1;
              if (type === "Todos" && origin === "Todos") {
                if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
                  return sum++;
                }
              } else if ((firstPeriod <= (_ref1 = reg.date) && _ref1 <= secondPeriod) && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
                return sum++;
              }
            });
          });
        } else {
          $.each(H5.DB.occurence.data.regions[H5.Data.region], function(key, reg) {
            var _ref;
            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && (reg.type.indexOf(type) >= 0 || type === "Todos") && (reg.origin.indexOf(origin) >= 0 || origin === "Todos")) {
              return sum++;
            }
          });
        }
        return Math.round(sum * 100) / 100;
      };
      sumPeriods = function(year, month) {
        var firstPeriod, secondPeriod;
        firstPeriod = new Date(year, 0, 1);
        if (month === 12) {
          month = 11;
        }
        secondPeriod = new Date(year, month + 1, 0);
        /*
        if month is H5.Data.thisMonth
          secondPeriod = new Date(year, month, H5.Data.thisDay)
        else
          secondPeriod = new Date(year, month+1, 0)
        */

        return sumValues(firstPeriod, secondPeriod);
      };
      curValue = sumPeriods(year, month);
      preValue = sumPeriods(year - 1, month);
      if (preValue === 0) {
        return 0;
      } else {
        return Math.round((curValue - preValue) / preValue * 100);
      }
    };
    value = periodDeforestationAvgRate(H5.Data.selectedYear, H5.Data.selectedMonth, H5.Data.typesOfEvents[H5.Data.selectedType], H5.Data.originOfAccident[H5.Data.selectedOrigin]);
    return this.updateInfo(value);
  };

  H5.Charts.reloadCharts = function() {
    chart2.drawChart();
    chart5.drawChart();
    chart7.drawChart();
    chart8.drawChart();
    knob1.drawChart();
    knob2.drawChart();
    knob3.drawChart();
    spark1.drawChart();
    return spark2.drawChart();
  };

  $(document).ready(function() {
    $("#dash").show();
    $("[rel=tooltip]").tooltip({
      placement: "bottom"
    });
    $(".alert").alert();
    $("select").selectpicker({
      width: '80px',
      size: 'auto'
    });
    $(".quick-btn a").on("click", function(event) {
      event.preventDefault();
      $(this).each(function() {
        return $("a").removeClass("active");
      });
      $(this).addClass("active");
      H5.Data.region = $(this).prop("id");
      H5.Charts.reloadCharts();
      return H5.Data.changed = true;
    });
    H5.Charts.reloadCharts();
    return $("#dash").hide();
  });

}).call(this);
