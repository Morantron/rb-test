//= require app/app.js
//= require app/Posts.js

describe('Posts', function(){

  it('should have Post and PostList properties', function(){
    expect(App.Posts.Post).toBeDefined();
    expect(App.Posts.PostList).toBeDefined();
  });

});

describe('PostModel', function(){
  var Post;

  beforeEach(function(){
    Post = App.Posts.Post;
  });

  it('should have the following attributes: title, content, created_at and updated_at', function(){
    var post = new Post();

    expect(post.attributes.title).toBeDefined();
    expect(post.attributes.content).toBeDefined();
    expect(post.attributes.created_at).toBeDefined();
    expect(post.attributes.updated_at).toBeDefined();
  });
});
