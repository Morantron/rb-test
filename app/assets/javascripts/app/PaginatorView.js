//= require app/app.js

App.module('PaginatorView', function(PaginatorView, App, Backbone, Marionette, $, _){

  // Paginator view.
  PaginatorView.View = Marionette.ItemView.extend({
    template: 'templates/PaginatorTemplate',

    initialize: function(options){
      // re-render paginator each time a new page is fetched from the server
      this.listenTo(this.collection, "reset", this.render);
      this.render();
    },

    // Expose pagination state to template.
    serializeData: function(){
      return this.collection.state;
    }
  });

  // PaginatedListLayout. A layout consisting in two regions: a list and a paginator
  PaginatorView.PaginatedListLayout = Marionette.Layout.extend({
    template: 'templates/PaginatedListLayout',

    regions: {
      list: "#list",
      paginator: "#paginator"
    }
  });
});
