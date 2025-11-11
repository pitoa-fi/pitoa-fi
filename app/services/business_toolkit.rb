# frozen_string_literal: true

# Service for loading and accessing business strategy tools from YAML configuration
class BusinessToolkit
  class << self
    def load
      @tools ||= begin
        yaml_data = YAML.load_file(Rails.root.join("config", "business_tools.yml"))
        tools_data = yaml_data["tools"] || []
        tools_data.map { |tool_hash| BusinessTool.new(tool_hash) }
      end
    end

    def all
      load
    end

    def find(id)
      load.find { |tool| tool.id.to_s == id.to_s }
    end

    def by_category(category)
      load.select { |tool| tool.category.to_s == category.to_s }
    end

    def categories
      load.map(&:category).uniq
    end

    def wizard_tools
      load.select(&:wizard_tool?).sort_by(&:wizard_priority)
    end

    # Reload the data from YAML (useful in development)
    def reload!
      @tools = nil
      load
    end
  end
end
