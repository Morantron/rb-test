class PostsController < ApplicationController

    #Prefix Verb   URI Pattern               Controller#Action
#home_index GET    /home/index(.:format)     home#index
     #posts GET    /posts(.:format)          posts#index {:format=>"json"}
           #POST   /posts(.:format)          posts#create {:format=>"json"}
  #new_post GET    /posts/new(.:format)      posts#new {:format=>"json"}
 #edit_post GET    /posts/:id/edit(.:format) posts#edit {:format=>"json"}
      #post GET    /posts/:id(.:format)      posts#show {:format=>"json"}
           #PATCH  /posts/:id(.:format)      posts#update {:format=>"json"}
           #PUT    /posts/:id(.:format)      posts#update {:format=>"json"}
           #DELETE /posts/:id(.:format)      posts#destroy {:format=>"json"}
      #root GET    /                         home#index

  def index
    @posts = Post.all

    render json: @posts
  end

  def show
    @post = Post.find(params[:id])

    if @post
      render json: @post
    else
      render status: :not_found
    end
  end

  def create
    @post = Post.new(post_params)

    if @post.save
      redirect_to @post
    else
      render status: :bad_request
    end
  end

  def destroy
    @post = Post.find(params[:id])

    if @post.destroy
      #render status: :ok
    else
      #render status: :bad_request
    end
  end

  def update
    @post = Post.find(params[:id])

    if @post.update(post_params)
      render json: @post
    else
      render status: :bad_request
    end
  end
  
  private 
    def post_params
      params.require(:post).permit(:title, :content)
    end

end
