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
    max_limit = 1000
    limit = (params[:limit].present? ? params[:limit] : max_limit).to_i
    offset = (params[:offset].present? ? params[:offset] : 0).to_i

    if limit > max_limit
      render json: { error: 'Limit too large' }, status: :bad_request
    else
      logger.debug "limit: #{limit}, offset: #{offset}"
      response.headers['X-Count'] = "#{Post.count}"
      @posts = Post.order('created_at DESC').limit(limit).offset(offset)
      render json: @posts
    end
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
    @post.destroy

    if @post.destroyed?
      render json: @post, status: :ok
    else
      render json: @post, status: :bad_request
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
