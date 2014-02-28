//= require app/app.js

describe('app', function(){
  it('should be present in global scope', function(){
    expect(App).toBeDefined();
  });

  it('should start properly', function(){
    App.start();
  });

  it('should have a router property', function(){
    App.start();
    expect(App.router).toBeDefined();
  });
});
