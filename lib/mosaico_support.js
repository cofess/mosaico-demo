/*********************************************************************************
 * FUNZIONI DI SUPPORTO GENERICO
 * 
 * NOTE:
 * - Per abilitare il click destro: window.enableContext = true;
 * - Per riabilitare l'help (in standalone): sysEraseCookie("mosaicoSuppressHelp");
 * 
 ********************************************************************************/

var logEventStack = [];

/**
 * Log eventi su viewModel.log
 */
function logEvent(category, msg) {
  if (typeof viewModel == "object") {
    if (logEventStack.length) {
      for (var i in logEventStack)
        viewModel.log(logEventStack[i].category, logEventStack[i].msg);
      logEventStack = [];
    }
    viewModel.log(category, msg);
  } else
    logEventStack.push({category: category, msg: msg});
}

/**
 * Gestione cookie
 */
function sysCreateCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  } else
    var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function sysReadCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ')
      c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0)
      return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function sysEraseCookie(name) {
  sysCreateCookie(name,"",-1);
}

/**
 * Attiva una animazione di "loading" per il moxiemanager
 * Chiamare al click di un elemento che fa apparire moxiemanager
 */
function moxmanLoading(element) {
  if (!$("#moxman-loading").length) // Da notare che voxmail ha già il suo nell'html
    $("body").append('<div id="moxman-loading" style="z-index: 100000; display: none; width: 100px; height: 100px; font-size: 80px; color: gray; text-align: center; position: absolute; top:0; bottom: 0; left: 0; right: 0;  margin: auto;"><i class="fa fa-fw fa-spinner fa-spin"></i></div>');
  var zindex = $(element).parents(".mce-window,.ui-dialog").css("z-index");
  $("#moxman-loading").css("z-index", +zindex > 1 ? +zindex + 1 : 100000).show(); // In questo modo e' piu' alto della finestra di tinymce, ma piu' basso della finestra moxman
  window.mceopeninterval = setInterval(function() {
    // Il controllo su "aria-label=Color" è specifico per mosaico-standalone (serve per evitare il problema di loading con i colori custom). Vedi config.js per le problematiche generali
    if ($(".moxman-window:visible").length || (!$(".mce-window:visible").length && !$(".ui-dialog:visible").length) || $(".mce-window[aria-label=Color]").length) {
      $("#moxman-loading").hide();
      clearInterval(window.mceopeninterval);
      delete window.mceopeninterval;
    }
  }, 500);
}

/**
 * Attiva il rilevamento del tasto destro, che mostra il div #contextmenu-help
 */
function contextMenuBind() {
  // Per farlo solo internamente: $("#main-wysiwyg-area").bind(...
  $(document).bind("contextmenu", function(event) {
    if (window.enableContext)
      return;
    
    // Whitelist: questi elementi se cliccati con il tasto destro devono fare il comportamento standard
    if (event.target && event.target.tagName && (
      // Campi di form
      event.target.tagName == "INPUT" || event.target.tagName == "SELECT" || event.target.tagName == "TEXTAREA" || 
      // Elementi contenteditable
      $(event.target).is(".mce-content-body") || $(event.target).is("[contenteditable]") ||
      // Oppure figli di un contenteditable
      $(event.target).parents(".mce-content-body").length > 0 || $(event.target).parents("[contenteditable]").length > 0
    ))
      return;

    event.preventDefault();
    
    // Tinymce ha già il suo contextmenu
    if ($(".mce-contextmenu:visible").length > 0)
      return;
    
    var margin = 50; // In questa zona funziona comunque l'hover
    if (!$("#contextmenu-help").data("initialized")) {
      $("#contextmenu-help").css({ padding: margin + 'px' }).data("initialized", "true");
      $("#contextmenu-help").mouseleave(function() {
        $(this).css({visibility: 'hidden'});
      }).click(function() {
        $(this).css({visibility: 'hidden'});
      });
    }
    if ($("#contextmenu-help").css("visibility") == 'visible') {
      $("#contextmenu-help").css({visibility: 'hidden'});
    } else {
      var w = $("#contextmenu-help").width();
      if (w <= 0)
        w = 300;
      var h = $("#contextmenu-help").height();
      if (h <= 0)
        h = 300;
      var x = event.pageX - margin;
      var y = event.pageY - margin;
      if (x + w > $(window).width() && x - w > 0)
        x -= w;
      if (y + h > $(window).height() && y - h > 0)
        y -= h;
      $("#contextmenu-help").offset({top: y, left: x}).css({visibility: 'visible'});
      
      logEvent("contextmenu", "open");
    }
  });
}

var carouselStartTime = 0;
var carouselStepTime = 0;
var carouselLogHistory = ",";

function carouselHelpStart(carouselOptions) {
  if (typeof carouselOptions.show == "string" && typeof window[carouselOptions.show] == 'function')
    carouselOptions.show = window[carouselOptions.show];
  if (typeof carouselOptions.disableFutureShow == "string" && typeof window[carouselOptions.disableFutureShow] == 'function')
    carouselOptions.disableFutureShow = window[carouselOptions.disableFutureShow];
  if (typeof carouselOptions.enableFutureShow == "string" && typeof window[carouselOptions.enableFutureShow] == 'function')
    carouselOptions.enableFutureShow = window[carouselOptions.enableFutureShow];
  
  if (carouselOptions.show()) {
    logEvent("carousel-help", "START");
    $("#carousel-dialog").dialog({
      title: carouselOptions.title,
      appendTo: '#carousel-container',
      resizable: false, draggable: false, modal: true,
      width: 980, height: 600,
      open: function( event, ui ) {
        carouselStartTime = (new Date()).getTime();
        carouselStepTime = carouselStartTime;
        carouselLogHistory += "st0";
      },
      close: function( event, ui ) {
        var t = (new Date()).getTime();
        var i = $("#carousel").data('owlCarousel').currentItem;
        var tt = Math.round((t - carouselStartTime) / 1000)
        var q = i == 0 ? 0 : (i < 5 && tt < (i + 1) * 5 ? 1 : (tt < (i + 1) * 5 ? 2 : (i < 5 && tt >= (i + 1) * 5 ? 3 : (tt >= (i + 1) * 5 && tt < (i + 1) * 10 ? 4 : 5))));
        logEvent("carousel-help", "CLOSE," + "st" + i + "," +  tt + "s" + (carouselLogHistory += "," + Math.round((t - carouselStepTime) / 1000) + "s") + ",CHQUALITY" + q);
      }
    });
    if (typeof carouselOptions.labelDisable != 'undefined' && typeof carouselOptions.disableFutureShow != 'undefined') {
      if (!$("#carousel-dialog .carousel-remember").length)
        $("#carousel-dialog").append('<div class="carousel-remember"><input type="checkbox" id="carousel-remember-checkbox" /> ' + carouselOptions.labelDisable + '</div>');
    } else
      $("#carousel-dialog .carousel-remember").remove();
    if (!$("#carousel-dialog .carousel-buttons").length)
      $("#carousel-dialog").append('<div class="carousel-buttons"><a class="button carousel-next-button" href="#">' + carouselOptions.labelNext + '</a><a class="button carousel-close-button" href="#">' + carouselOptions.labelClose + '</a></div>');
    
    var carousel = $("#carousel").owlCarousel({
      singleItem: true,
      addClassActive: true,
      rewindNav: false,
      lazyLoad: true,
      afterMove: function() {
        var t = (new Date()).getTime();
        var currentItem = this.owl.currentItem; // MODO ALT: $("#carousel").data('owlCarousel').currentItem
        logEvent("carousel-help", "NEXT," + "st" + currentItem + "," + Math.round((t - carouselStartTime) / 1000) + "s" + (carouselLogHistory += "," + Math.round((t - carouselStepTime) / 1000) + "s"));
        carouselLogHistory += ",st" + currentItem;
        carouselStepTime = t;
        if (this.owl.currentItem < this.owl.owlItems.length - 1) {
          $(".carousel-close-button").hide(); $(".carousel-next-button").show();
        } else {
          $(".carousel-next-button").hide(); $(".carousel-close-button").show();
        }
      }
    });
    $(".carousel-close-button").hide().click(function() {
      $("#carousel-dialog").dialog("close").remove(); return false;
    });
    $(".carousel-next-button").click(function() {
      carousel.trigger("owl.next"); return false;
    });
    /*$(".carousel-prev-button").click(function() {
      carousel.trigger("owl.prev"); return false;
    });*/
    $("#carousel-remember-checkbox").click(function() {
      if ($(this).prop("checked")) {
        carouselOptions.disableFutureShow();
        logEvent("carousel-help", "DISABLED");
      } else {
        carouselOptions.enableFutureShow();
        logEvent("carousel-help", "ENABLED");
      }
    });
    // Per qualche motivo ignoto a volte la dialog si apre con altezza 0 (non dovrebbe capitare: l'altezza è imposta da dialog, a prescindere dal contenuto). In questi casi reimposto l'altezza dopo 1 secondo
    setTimeout(function() {
      if ($("#carousel-dialog").height() < 550) {
        $("#carousel-dialog").css("min-height", "550px");
        $("#carousel-dialog").dialog('widget').position({my: "center", at: "center", of: window });
      }
    }, 1000);
  }
}

/* ESEMPIO PER INNESCARE I PROCESSI AL LOAD:
$(function() {
  $("body").on("click", ".mce-window .mce-btn.mce-open button", function() { moxmanLoading(this); });
  contextMenuBind();
  carouselHelpStart({
    show: function() { return true; },
    disableFutureShow: function() {},
    enableFutureShow: function() {}
  });
});*/
