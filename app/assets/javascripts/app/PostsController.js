//= require app/app.js

App.module('PostsController', function(PostsController, App, Backbone, Marionette, $, _){
  PostsController.Controller = Marionette.Controller.extend({
    initialize: function(options){
      _.defaults(options, {
        posts: [],
        currentPage: 0,
        pageSize: 5,
        totalCount: options.posts.length
      });

      var that = this;

      this.posts = new App.Posts.PostList(
        _.first(options.posts, options.pageSize),
        {
          mode: 'server',
          state: {
            firstPage: 0, // zero-based pagination
            currentPage : options.currentPage,
            pageSize: options.pageSize,
            totalRecords: options.totalCount
        }
      });

      this.showList();

      App.vent.on('delete:post', function(){
        that.gotoPage(that.getCurrentPage());
      });
    },
    showList: function(){
      // render post list and paginator with paginated list layout
      var layout = new App.PaginatorView.PaginatedListLayout();
      App.main.show(layout);

      App.main.currentView.list.show(
        new App.PostsViews.List({
          collection: this.posts
        })
      );

      App.main.currentView.paginator.show(
        new App.PaginatorView.View({
          collection: this.posts
        })
      );
    },
    showDetail: function(id){
      var post = id === 'new' ?
                  new App.Posts.Post() :
                  this.posts.get(id);

      var that = this;

      // freshly added post, not in current page
      if( !post ){
        post = new App.Posts.Post({ id: id });
        post.fetch().done(function(){
          that._showDetailView(post);
        });
      } else {
        this._showDetailView(post);
      }
    },
    gotoPage: function(pageNumber){
      pageNumber = parseInt(pageNumber);
      var lastPage = this.getLastPage();

      if( pageNumber > lastPage ){
        pageNumber = lastPage;
      } else if( pageNumber < 0 ) {
        pageNumber = 0;
      }

      this.posts.getPage(pageNumber);
      this.showList();
    },
    _showDetailView: function(post){
      var that = this;

      App.main.show(
        new App.PostsViews.Detail({
          model: post,
          currentPage: that.posts.state.currentPage
        })
      );
    },
    getCurrentPage: function(){
      var currentPage = this.posts.state.currentPage;
      var lastPage = this.posts.state.lastPage;

      // this happens when we remove the last post on the last page
      if( currentPage === lastPage && this.posts.length === 0 ){
        currentPage--;
      }
      return currentPage;
    },
    getLastPage: function(){
      return this.posts.state.lastPage;
    }

  });
});
