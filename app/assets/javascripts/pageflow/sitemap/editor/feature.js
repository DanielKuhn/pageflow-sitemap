pageflow.features.register('editor', 'sitemap', function() {
  var s = pageflow.sitemap;

  pageflow.editor.selectPage = function (options) {
    options = options || {};

    var result = $.Deferred();
    var controller = new s.SelectionModeController(pageflow.entry, options);
    var graphView = new s.SitemapView({
      controller: controller,
      headerText: I18n.t(options.header || 'pageflow.sitemap.editor.headers.select_page'),
      cancelButton: true
    });

    controller.once('selected', function (selected) {
      graphView.close();
      result.resolve(selected);
    });

    graphView.once('closed', result.reject);

    pageflow.editor.showViewInMainPanel(graphView);

    return result.promise();
  };

  pageflow.editor.registerMainMenuItem({
    translationKey: 'pageflow.sitemap.editor.main_menu_item',
    click: function() {
      showSitemap();
    }
  });

  $(document).on('keydown', function(event) {
    if (event.altKey && event.which === 83) {
      toggleSitemap();
    }
  });

  var currentSitemapView = null;

  function toggleSitemap() {
    if (currentSitemapView) {
      hideSitemap();
    }
    else {
      showSitemap();
    }
  }

  function showSitemap() {
    if (!currentSitemapView) {
      currentSitemapView = new pageflow.sitemap.SitemapView({
        controller: new pageflow.sitemap.EditorModeController(pageflow.entry)
      });

      currentSitemapView.once('close', function() {
        currentSitemapView = null;
      });

      pageflow.editor.showViewInMainPanel(currentSitemapView);
    }
  }

  function hideSitemap() {
    currentSitemapView.close();
  }
});