configure do
  set :views, "#{File.dirname(__FILE__)}/views"
  LOGGER = Logger.new("log/sinatra.log") 
end

helpers do
  def logger
    LOGGER
  end
  
  def base_dir
    "public/media"
  end
    
  def partial(page, options={})
    haml page, options.merge!(:layout => false)
  end
end