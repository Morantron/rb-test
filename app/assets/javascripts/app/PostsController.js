//= require app/app.js

App.module('PostsController', function(PostsController, App, Backbone, Marionette, $, _){
  PostsController.Controller = Marionette.Controller.extend({
    initialize: function(options){
      options = options || {};
      _.defaults(options, {
        posts: [],
        currentPage: 0,
        pageSize: 5,
        totalCount: options.posts && options.posts.length
      });

      var that = this;

      // init post and pagination settings
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
      this.showNotificator();

      // trigger notifications when posts are added/deleted
      App.vent.on('new:post', function(model){
        App.vent.trigger('notification:success', 'New post added.');
      });

      App.vent.on('delete:post', function(model){
        App.vent.trigger('notification:warning', 'Post deleted.');
        that.gotoPage(that.getCurrentPage());
      });
    },

    // Show post list view in App.main region
    showList: function(){
      // use 'list and paginator' layout
      var layout = new App.PaginatorView.PaginatedListLayout();
      App.main.show(layout);

      // render list
      App.main.currentView.list.show(
        new App.PostsViews.List({
          collection: this.posts
        })
      );

      // render paginator
      App.main.currentView.paginator.show(
        new App.PaginatorView.View({
          collection: this.posts
        })
      );
    },

    // Triggers on '#show/:id'. Fetches or creates a post model and then calls
    // this._showDetailView to show post detail view in App.main region.
    showDetail: function(id){
      // tries to get post from local collection
      var post = id === 'new' ?
                  new App.Posts.Post() :
                  this.posts.get(id);

      var that = this;

      if( !post ){
        // post not found in local collection
        // ( maybe freshly added or directly accessed through url )

        post = new App.Posts.Post({ id: id });

        post.fetch()
        .done(function(){
          that._showDetailView(post);
        }).fail(function(){
          App.vent.trigger('notification:error', 'Post not found!');
          App.router.navigate('', {trigger: true});
        });

      } else {
        // post found in local collection, show it
        this._showDetailView(post);
      }
    },

    // Private fn to show detail view in App.Main region ( called from
    // this.showDetail )
    _showDetailView: function(post){
      var that = this;

      App.main.show(
        new App.PostsViews.Detail({
          model: post,
          currentPage: that.posts.state.currentPage
        })
      );
    },

    // Show notificator view in App.paginator region
    showNotificator: function(){
      App.notificator.show(
        new App.NotificatorView.View()
      );
    },
    gotoPage: function(pageNumber){
      var that = this;

      pageNumber = parseInt(pageNumber);
      var lastPage = this.getLastPage();

      if( pageNumber > lastPage ){
        pageNumber = lastPage;
      } else if( pageNumber < 0 ) {
        pageNumber = 0;
      }

      this.posts.getPage(pageNumber)
      .done(function(){
        that.showList();
      })
      .fail(function(){
        App.vent.trigger('notification:error', 'Could not load posts, trying again ...');
        setTimeout(function(){
          that.gotoPage(pageNumber);
        }, 1500);
      });
        
    },

    // Triggers at '#page/:number'. Fetches a page of posts from the server.
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
