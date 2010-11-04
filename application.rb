get '/' do
  @images = []
  Pow(base_dir).files.each { |file| @images << file.name }
  @images.sort!
  haml :index
end

post '/gifit' do
  pwd = File.join(Dir.pwd, 'tmp')
  params[:upload].each_with_index do |upload, i|
    filetype = upload[1]['content_type'].split('/')[1].downcase
    File.open(File.join(pwd, "#{i}.#{filetype}"), 'w') {|f| f.write(Base64.decode64(upload[1]['data'])) }
  end
  images = Dir.glob(File.join(pwd, "*.{jpg,jpeg,png}"))
  images.each do |image| 
    filename = File.basename(image).split('.')[0]
    output = "#{filename}.gif"
    `convert #{File.expand_path(image)} #{File.join(pwd, output)}`
    `rm #{File.expand_path(image)}`
  end
  gifname = "#{Time.now.to_i}.gif"
  `gifsicle --delay=10 --loop #{pwd}/*.gif > #{File.join(Dir.pwd, "public", "images", "gifs", gifname)}`
  `rm #{pwd}/*`
  "/images/gifs/#{gifname}"
end