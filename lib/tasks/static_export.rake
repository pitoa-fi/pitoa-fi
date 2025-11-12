# frozen_string_literal: true

require "fileutils"
require "nokogiri"

namespace :static do
  desc "Export streaming pages to docs/ for GitHub Pages"
  task export: :environment do
    puts "Starting static export..."

    # Build assets with npm (simpler than Rails precompile for static sites)
    puts "\n1. Building assets with npm..."
    system("npm run build && npm run build:css") || raise("Asset build failed")

    # Create docs directory
    docs_dir = Rails.root.join("docs")
    FileUtils.rm_rf(docs_dir) if File.exist?(docs_dir)
    FileUtils.mkdir_p(docs_dir)

    # Initialize exporter
    exporter = StaticExporter.new(docs_dir)

    # Export routes
    routes_to_export = [
      { path: "/", output: "index.html" },
      { path: "/wizard/start", output: "wizard/start/index.html" },
      { path: "/wizard/journey?stage=idea", output: "wizard/journey/idea/index.html" },
      { path: "/wizard/journey?stage=mvp", output: "wizard/journey/mvp/index.html" },
      { path: "/wizard/journey?stage=traction", output: "wizard/journey/traction/index.html" },
      { path: "/wizard/journey?stage=scaling", output: "wizard/journey/scaling/index.html" },
      { path: "/all-tools", output: "all-tools/index.html" },
      { path: "/metrics", output: "metrics/index.html" },
      { path: "/timeline", output: "timeline/index.html" },
      { path: "/impact", output: "impact/index.html" }
    ]

    routes_to_export.each do |route|
      exporter.export_page(route[:path], route[:output])
    end

    # Copy assets
    exporter.copy_assets

    # Create .nojekyll file for GitHub Pages
    File.write(File.join(docs_dir, ".nojekyll"), "")

    puts "\n✅ Static export complete! Files written to #{docs_dir}"
    puts "\nNext steps:"
    puts "  1. Test locally: npx http-server docs"
    puts "  2. Commit changes: git add docs && git commit -m 'Update static site'"
    puts "  3. Push to GitHub: git push"
  end
end

# Helper class for static export
class StaticExporter
  include Rails.application.routes.url_helpers

  def initialize(output_dir)
    @output_dir = output_dir
    @app = ActionDispatch::Integration::Session.new(Rails.application)
  end

  def export_page(path, output_filename)
    puts "  Exporting #{path} -> #{output_filename}"

    # Make request with localhost to bypass host authorization
    @app.host = "localhost"
    @app.get(path)

    unless @app.response.successful?
      puts "    WARNING: #{path} returned status #{@app.response.status}"
      puts "    Response body: #{@app.response.body[0..200]}" if @app.response.body
      return
    end

    html = @app.response.body

    # Rewrite asset paths for GitHub Pages (relative paths)
    html = rewrite_asset_paths(html, output_filename)

    # Write to file
    output_path = File.join(@output_dir, output_filename)
    FileUtils.mkdir_p(File.dirname(output_path))
    File.write(output_path, html)

    puts "    ✓ Wrote #{output_path}"
  end

  def copy_assets
    puts "  Copying assets..."

    # Source directories
    builds_dir = Rails.root.join("app", "assets", "builds")
    images_dir = Rails.root.join("app", "assets", "images")
    public_assets_dir = Rails.root.join("public", "assets")
    public_dir = Rails.root.join("public")

    # Target directories
    assets_target = File.join(@output_dir, "assets")
    FileUtils.mkdir_p(assets_target)

    # Copy precompiled fingerprinted assets from public/assets if they exist
    # This is the primary source for production-ready assets with fingerprints
    if Dir.exist?(public_assets_dir)
      Dir.glob("#{public_assets_dir}/**/*").each do |file|
        next if File.directory?(file)

        relative_path = Pathname.new(file).relative_path_from(public_assets_dir)
        target = File.join(assets_target, relative_path)
        FileUtils.mkdir_p(File.dirname(target))
        FileUtils.cp(file, target)
        puts "    ✓ Copied #{relative_path}"
      end
    else
      # Fallback: Copy from builds if public/assets doesn't exist
      puts "    ⚠ public/assets not found, copying from builds (no fingerprints)"
      if Dir.exist?(builds_dir)
        Dir.glob("#{builds_dir}/*").each do |file|
          next if File.directory?(file)

          target = File.join(assets_target, File.basename(file))
          FileUtils.cp(file, target)
          puts "    ✓ Copied #{File.basename(file)}"
        end
      end
    end

    # Copy images
    if Dir.exist?(images_dir)
      images_target = File.join(assets_target, "images")
      FileUtils.mkdir_p(images_target)
      FileUtils.cp_r("#{images_dir}/.", images_target) if Dir.children(images_dir).any?
    end

    # Copy public files (icons, robots.txt, etc.) but skip HTML error pages and assets folder
    if Dir.exist?(public_dir)
      Dir.glob("#{public_dir}/*").each do |file|
        next if File.directory?(file)
        next if file.end_with?(".html") # Skip error pages

        target = File.join(@output_dir, File.basename(file))
        FileUtils.cp(file, target)
      end
    end

    puts "    ✓ Assets copied"
  end

  private

  def rewrite_asset_paths(html, output_filename)
    prefix = relative_prefix_for(output_filename)
    document = Nokogiri::HTML5(html)

    document.css("[href], [src]").each do |node|
      %w[href src].each do |attr|
        value = node[attr]
        next if value.nil? || value.empty?
        next unless value.start_with?("/")
        next if value.start_with?("//")

        rewritten = value == "/" ? prefix : "#{prefix}#{value.delete_prefix("/")}"
        node[attr] = rewritten
      end
    end

    document.to_html
  end

  def relative_prefix_for(output_filename)
    depth = File.dirname(output_filename)
                .split(File::SEPARATOR)
                .reject { |segment| segment.empty? || segment == "." }
                .size
    depth.zero? ? "./" : "../" * depth
  end
end
