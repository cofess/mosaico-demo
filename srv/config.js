var mosaicoUrl = false;
var dev = false;
if (window.location.hostname == 'mosaico.io')
  mosaicoUrl = window.location.protocol+'//'+window.location.hostname;

if (window.location.hostname == '127.0.0.1' || location.hostname == '192.168.1.32' || location.hostname == 'localhost') {
  mosaicoUrl = window.location.protocol+'//mosaico.io';
  dev = true;
}

if (mosaicoUrl) {
  var recorderUrl = window.location.protocol+'//app.mailvox.it/mosaico_record';
  var mosaicoConfig = {
    imgProcessorBackend: mosaicoUrl + '/srv/f-default/img', // WARN: Viene aggiunto "/KEY" nell'onLoad sotto
    emailProcessorBackend: mosaicoUrl + '/srv/f-default/dl', // WARN: Viene aggiunto "/KEY" nell'onLoad sotto
    linkDialogHandler: 'link_dialog_handler',

    sponsor: true,
    sponsorBanner: {
      imgAlt: "MOSAICO Responsive Email Designer",
      imgSrc: mosaicoUrl+'/img/mosaico-badge.gif',
      link: mosaicoUrl+'/?footerbadge'
    },
    titleToken: "MOSAICO Responsive Email Designer",
    
    // @see https://github.com/blueimp/jQuery-File-Upload/wiki/Options
    // Le opzioni base vengono impostate da fileupload.js
    fileuploadConfig: {
      url: mosaicoUrl + '/srv/f-default/upload', // WARN: Viene aggiunto "/KEY" nell'onLoad sotto
      // Le opzioni di validazione sono gestite server-side dal path /upload (tramite ElysiaUploadHandler), ma per alcune validazioni conviene metterle anche client-side da qui
      maxFileSize: 2 * 1024 * 1024, // WARN: Collegato a config.inc:$moxieManagerConfig['upload.maxsize']
      messages: {
        // Errori lato client
        unknownError: 'Unknown error',
        uploadedBytes: 'Uploaded bytes exceed file size',
        maxNumberOfFiles: 'Maximum number of files exceeded',
        acceptFileTypes: 'File type not allowed',
        maxFileSize: 'File is too large',
        minFileSize: 'File is too small',
        // Errori lato server, @see ElysiaUploadHandler.inc / UploadHandler.inc
        post_max_size: 'The uploaded file exceeds the post_max_size directive in php.ini',
        max_file_size: 'File is too big',
        min_file_size: 'File is too small',
        accept_file_types: 'Filetype not allowed',
        max_number_of_files: 'Maximum number of files exceeded',
        max_width: 'Image exceeds maximum width',
        min_width: 'Image requires a minimum width',
        max_height: 'Image exceeds maximum height',
        min_height: 'Image requires a minimum height',
        abort: 'File upload aborted',
        image_resize: 'Failed to resize image',
        generic: 'Unexpected upload error'
      }
    },
    // Le opzioni base vengono impostate da wysiwygs.js
    tinymceConfig: {
      skin: 'gray-flat',
    },
    tinymceConfigFull: {
      toolbar1: 'bold italic link unlink | styleselect hr pastetext code',
      contextmenu: "bold italic link unlink",
      plugins: [ "link hr paste lists textcolor code contextmenu colorpicker elysiacolor" ],
      external_plugins: {
        moxiemanager: mosaicoUrl + '/srv/f-default/lib/moxiemanager/editor_plugin.js'
      },
      // @see http://www.tinymce.com/wiki.php/Configuration:style_formats
      // Per capire i possibili stili e comandi inseribili, @see classes/ui/FormatControl.js e classes/Formatter.js
      //style_formats_merge: true,
      style_formats: [
        // Stili standard, con l'aggiunta di elenco puntato e numerato in "blocchi"
        {title: 'Headings', items: [
          {title: 'Heading 1', format: 'h1'},
          {title: 'Heading 2', format: 'h2'},
          {title: 'Heading 3', format: 'h3'},
          {title: 'Heading 4', format: 'h4'},
          {title: 'Heading 5', format: 'h5'},
          {title: 'Heading 6', format: 'h6'}
        ]},
        {title: 'Inline', items: [
          {title: 'Bold', icon: 'bold', format: 'bold'},
          {title: 'Italic', icon: 'italic', format: 'italic'},
          {title: 'Underline', icon: 'underline', format: 'underline'},
          {title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough'},
          {title: 'Superscript', icon: 'superscript', format: 'superscript'},
          {title: 'Subscript', icon: 'subscript', format: 'subscript'},
          {title: 'Code', icon: 'code', format: 'code'}
        ]},
        {title: 'Blocks', items: [
          {title: 'Paragraph', format: 'p'},
          {title: 'Blockquote', format: 'blockquote'},
          {title: 'Div', format: 'div'},
          {title: 'Pre', format: 'pre'},
          // Ad-hoc
          { title: 'Bullet list', icon: 'bullist', cmd: 'InsertUnorderedList' },
          { title: 'Numbered list', icon: 'numlist', cmd: 'InsertOrderedList' }
        ]},
        // Stili ad-hoc
        {title: 'Alignment', items: [
          {title: 'Left', icon: 'alignleft', format: 'alignleft'},
          {title: 'Center', icon: 'aligncenter', format: 'aligncenter'},
          {title: 'Right', icon: 'alignright', format: 'alignright'},
          {title: 'Justify', icon: 'alignjustify', format: 'alignjustify'}
        ]},
        {title: 'Line height', items: [
          { title: 'Default', selector: 'p,div', styles: {'line-height': ''}, split: true},
          { title: 'Standard', selector: 'p,div', styles: {'line-height': 'normal' }},
          { title: '1', selector: 'p,div', styles: {'line-height': '1em' }},
          { title: '1,5', selector: 'p,div', styles: {'line-height': '1.5em' }},
          { title: '2', selector: 'p,div', styles: {'line-height': '2em' }}
        ]},
        {title: 'Text color', cmd: 'mceElysiaColor'},
        {title: 'Remove Formatting', cmd: 'removeformat'}
      ],
      relative_urls: false,
      remove_script_host: false,
      moxiemanager_sort_by: 'lastModified',
      moxiemanager_sort_order: 'desc',
      moxiemanager_file_settings: { view: 'files'},
      moxiemanager_view: 'thumbs',
      moxiemanager_title: 'Esplora risorse',
      moxiemanager_skin: 'gray-flat',
      moxiemanager_leftpanel: false,
      moxiemanager_filelist_manage_menu: 'view edit rename download remove', //'cut copy paste | view edit rename download addfavorite | zip unzip | remove',
      moxiemanager_filelist_context_menu: 'view edit rename download remove', //'cut copy paste | view edit rename download addfavorite | zip unzip | remove',
      moxiemanager_upload_auto_close: true,
      moxiemanager_editimage_actions_toolbar: 'crop fliprotate brightness contrast exposure gamma hue saturate sepia vibrance triangleblur colorize grayscale invert sharpen emboss'
    },
    
    moxieManagerConfig: {
      sort_by: 'lastModified',
      sort_order: 'desc',
      file_settings: { view: 'files'},
      view: 'thumbs',
      title: 'File manager',
      skin: 'gray-flat',
      leftpanel: false,
      filelist_manage_menu: 'view edit rename download remove', //'cut copy paste | view edit rename download addfavorite | zip unzip | remove',
      filelist_context_menu: 'view edit rename download remove', //'cut copy paste | view edit rename download addfavorite | zip unzip | remove',
      upload_auto_close: true,
      editimage_actions_toolbar: 'crop fliprotate brightness contrast exposure gamma hue saturate sepia vibrance triangleblur colorize grayscale invert sharpen emboss'
    },
    
    // Attiva delle funzioni da mosaico_support.js
    onBeforeInit: function() {
      // Supporto loading di moxiemanager: su standalone funziona solo parzialmente, perchè mancano le classi .mce-filepicker (la mette il link plugin peripolli) e il link nella sidebar non funziona con ".on()"
      // Per il primo caso uso una classe generica "mce-window" al posto di mce-filepicker (ma potrebbe dare problemi e far innescare il loading anche quando non serve)
      // Per il secondo caso faccio una chiamata manuale in link_dialog_handler
      // Valore originale su voxmail: .mce-filepicker .mce-btn.mce-open button, .ui-dialog .browse_file_button
      if (typeof moxmanLoading == 'function')
        $("body").on("click", ".mce-window .mce-btn.mce-open button", function() { moxmanLoading(this); });
      
      // Supporto tasto destro
      if (typeof contextMenuBind == 'function')
        contextMenuBind();
      
      // Fa partire l'help iniziale
      if (typeof carouselHelpStart == 'function')
        carouselHelpStart({
          title: 'How to use Mosaico Editor',
          labelDisable: 'Don\'t show this anymore',
          labelNext: 'Next',
          labelClose: 'Close',
          show: function() {
            return !sysReadCookie("mosaicoSuppressHelp");
          },
          disableFutureShow: function() {
            sysCreateCookie("mosaicoSuppressHelp", true, 10 * 365);
          },
          enableFutureShow: function() {
            sysEraseCookie("mosaicoSuppressHelp");
          }
        });

      var rhash = window.location.hash ? window.location.href.split("#")[1] : "";
      if (rhash.match(/replay=/))
        // Se il carousel-help era aperto lo chiudo
        $("#carousel-dialog").dialog("close").remove();
    },
    
    onInitKey: function(key, hash_vars) {
      mosaicoConfig.fileuploadConfig.url = mosaicoConfig.fileuploadConfig.url.replace(/\/f-default\//, '/f-' + key + '/');
      mosaicoConfig.imgProcessorBackend = mosaicoConfig.imgProcessorBackend.replace(/\/f-default\//, '/f-' + key + '/');
      mosaicoConfig.emailProcessorBackend = mosaicoConfig.emailProcessorBackend.replace(/\/f-default\//, '/f-' + key + '/');
      if (mosaicoConfig.tinymceConfigFull.external_plugins)
        mosaicoConfig.tinymceConfigFull.external_plugins.moxiemanager = mosaicoConfig.tinymceConfigFull.external_plugins.moxiemanager.replace(/\/f-default\//, '/f-' + key + '/');
      
      if (recorderUrl && !hash_vars.replay) { // Se c'è un replay in corso non faccio anche un record...
        // UNIQID_NID_VID_YYMMDDHHIIRND&_c=CHECK -> PUB_KEY_0_YYMMDDHHIIRND&_c=PUB
        mosaicoConfig.record = 'PUB_' + key + '_0_' + (new Date().toISOString().replace(/^[0-9][0-9]([0-9][0-9])-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+):.*/, "$1$2$3$4$5")) + (Math.floor(Math.random() * 900) + 100);
        mosaicoConfig.recordUrl = recorderUrl + '?name=' + mosaicoConfig.record + '&_c=PUB';
        mosaicoConfig.recordInterval = 5000;
      }
      // console.warn("onInitKey", mosaicoConfig);
    }
  };

  // in sviluppo tolgo la gestione delle aree files separate per chiave e della registrazione
  if (dev) delete mosaicoConfig.onInitKey;

  function link_dialog_handler() {
    var inputElement = this;
    var href = $(inputElement).val();
    if ((typeof moxman == "object") && (typeof mosaicoConfig != "undefined") && mosaicoConfig.moxieManagerConfig)
      if (typeof moxmanLoading == 'function')
        moxmanLoading(inputElement);
      moxman.browse($.extend({oninsert: function(args) {
        //console.warn(args);
        $(inputElement).val(args.focusedFile.url).change();
      }}, mosaicoConfig.moxieManagerConfig));
  }

  // in sviluppo togliamo zopim e bugsnag
  if (!dev) {

  /* GA */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-61367795-1', 'auto');
  ga('send', 'pageview');

  document.addEventListener("DOMContentLoaded", function(event) { 
    var tawkToScript = document.createElement("script");
    tawkToScript.type = "text/javascript";
    tawkToHtml  = "var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();";
    tawkToHtml += "(function(){";
    tawkToHtml += "var s1=document.createElement(\"script\"),s0=document.getElementsByTagName(\"script\")[0];";
    tawkToHtml += "s1.async=true;";
    tawkToHtml += "s1.src='https://embed.tawk.to/565592b50f76a5ca39f2e8de/default';";
    tawkToHtml += "s1.charset='UTF-8';";
    tawkToHtml += "s1.setAttribute('crossorigin','*');";
    tawkToHtml += "s0.parentNode.insertBefore(s1,s0);";
    tawkToHtml += "})();";
    tawkToScript.innerHTML = tawkToHtml;
    document.body.appendChild(tawkToScript);

	/*
    var zopimJS = "window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set._.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');$.src='//v2.zopim.com/?1X7fpHnluKqfhqoCSyCK8EikJbRjJHQC';z.t=+new Date;$.type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');";
      zopimJS += "$zopim(function() { ";
      zopimJS += "if (!$zopim.livechat.isChatting()) $zopim.livechat.button.show();  $zopim.livechat.window.onHide($zopim.livechat.button.show);";
      zopimJS += "$zopim.livechat.departments.setVisitorDepartment('Tecnico');";
      zopimJS += "$zopim.livechat.addTags('Mosaico');";
      zopimJS += "$zopim.livechat.setLanguage('en');";
      zopimJS += "$zopim.livechat.window.setTitle('What do you think about mosaico?');";
      zopimJS += "$zopim.livechat.concierge.setTitle('Feedback...');";
      zopimJS += "$zopim.livechat.concierge.setName('Mosaico Team');";
      zopimJS += "$zopim.livechat.offlineForm.setGreetings('Give us your feedback about Mosaico. We are waiting for your ideas, suggestions, bug!');";
      zopimJS += "$zopim.livechat.setGreetings({online: 'Chat with us...', offline: 'Write us...'});";
      zopimJS += " });";


    var zopimScript = document.createElement("script");
    zopimScript.type = "text/javascript";
    zopimScript.innerHTML = zopimJS;
    document.body.appendChild(zopimScript);
	*/
	/*
    var bugsNags = document.createElement("script");
    bugsNags.src = '//d2wy8f7a9ursnm.cloudfront.net/bugsnag-2.min.js';
    // dataset property not supported by IE10
    bugsNags.setAttribute('data-apikey', '81e3275beafeffd3c12b384d40351282');
    // var bugsNag = '<scr'+'ipt defer src="//d2wy8f7a9ursnm.cloudfront.net/bugsnag-2.min.js" data-apikey="81e3275beafeffd3c12b384d40351282"></script>';
    // document.write(bugsNag);
    document.body.appendChild(bugsNags);
    */
  });

  }

}
