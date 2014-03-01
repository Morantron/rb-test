//= require app/app.js
//= require_tree ../templates

App.module('PostsViews', function(PostsViews, App, Backbone, Marionette, $, _){

  var helperFunctions = {
    deletePost: function(){
      if( confirm('Are you sure you want to delete this post?') ){
        this.model.destroy()
        .done(function(){
          App.vent.trigger('delete:post');
          App.router.navigate('#', { trigger: true});
        })
        .fail(function(){
          App.vent.trigger('notification:error', 'Post not found in database.');
        });
      }
      event.preventDefault();
    }
  };

  // Post ItemView: a row in a table of posts
  PostsViews.Item = Marionette.ItemView.extend({
    tagName: 'tr',

    template: 'templates/PostItemView',

    // Add 'excerpt' field: a limited length version of 'content' field
    serializeData: function(){
      var excerptLength = App.Constants.EXCERPT_LENGTH;
      var postContent = this.model.get('content');

      var output = _.extend(this.model.toJSON(),{
        excerpt: this.model.get('content').slice(0, excerptLength)
      });

      // add ellipsis to 'excerpt' if it's too large.
      if( output.excerpt.length >= excerptLength ){
        output.excerpt += ' ...';
      }

      return output;
    },

    events: {
      'click .delete-button' : 'deletePost'
    },

    deletePost: helperFunctions.deletePost
  });

  // Post CompositeView: table of posts
  PostsViews.List = Marionette.CompositeView.extend({
    template: 'templates/PostCompositeView',
    itemViewContainer: 'tbody',
    itemView: PostsViews.Item,
    templateHelpers: function(){
      return {
        postCount: this.collection.length
      };
    }
  });

  // Post detail view
  PostsViews.Detail = Marionette.ItemView.extend({
    initialize: function(options){
      var that = this;
      // 'currentPage' is passed as an argument in order to recover the correct
      // page when the user presses the back button.
      _.defaults(options, {
        currentPage: 0
      });
      this.currentPage = options.currentPage;

      // notify validation errors
      this.model.on('invalid', function(model, errors){
        var errorMsg = that.errorTemplate({ errors: errors });
        App.vent.trigger('notification:error', errorMsg);
      });
    },

    errorTemplate: JST['templates/PostValidationErrorMsg'],
    template: 'templates/PostDetailView',

    // Expose 'currentPage' field to the template and
    // make creation/update dates human readable.
    serializeData: function(){
      return _.extend(this.model.toJSON(), {
                currentPage: this.currentPage,
                created_at: new Date(this.model.get('created_at')),
                updated_at: new Date(this.model.get('updated_at'))
              });
    },

    ui: {
      saveButton: '.save',
      deleteButton: '.delete',
      titleInput: 'input[name=title]',
      contentTextArea: 'textarea[name=content]',
      backButton: '.history-back',
      titleCharCount: '.title-char-count',
      contentCharCount: '.content-char-count'
    },

    events: {
      'click @ui.deleteButton' : 'deletePost',
      'click @ui.saveButton' : 'savePost',
      // model changes are detected using the 'input' event
      'input .form-control' : 'modelChanged' 
    },

    // Enable @ui.saveButton when the changes are detected
    modelChanged: function(){
      this.ui.saveButton.prop('disabled', false);
      this.updateCharCount();
    },

    updateCharCount: function(){
      var titleCount = this.ui.titleInput.val().length;
      var contentCount = this.ui.contentTextArea.val().length;

      this.ui.titleCharCount.html( titleCount + '/' + App.Constants.TITLE_MAX_LENGTH );
      this.ui.contentCharCount.html( contentCount + '/' + App.Constants.CONTENT_MAX_LENGTH);
    },

    deletePost: helperFunctions.deletePost,

    // Saves/creates a post at server.
    savePost: function(event){
      var that = this;
      var isNew = that.model.isNew();


      // if validation fails it doesn't return an xhr
      var xhr = this.model.save({
        'title': this.ui.titleInput.val().trim(),
        'content': this.ui.contentTextArea.val().trim()
      });

      if( xhr ){
        xhr.done(function(model){
          if( isNew ){
            // notify that a new post has been created and navigate to its detail
            App.vent.trigger('new:post', that.model);
            App.router.navigate('#show/' + that.model.id, { trigger: true });
          } else {
            App.vent.trigger('notification:success', 'Post updated.');
          }
        }).fail(function(){
          App.vent.trigger('notification:error', 'Could not update post. Please try again');
          that.$el.find('input').trigger('input');
        });
      }

      this.ui.saveButton.prop('disabled', true);
      event.preventDefault();
    }
  });
});
