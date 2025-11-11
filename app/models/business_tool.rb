# frozen_string_literal: true

# Plain Old Ruby Object representing a business strategy tool/framework
class BusinessTool
  attr_reader :id, :name, :summary, :category, :metrics, :cta, :wizard_priority, :wizard_stage, :description

  def initialize(attributes = {})
    @id = attributes[:id] || attributes["id"]
    @name = attributes[:name] || attributes["name"]
    @summary = attributes[:summary] || attributes["summary"]
    @category = attributes[:category] || attributes["category"]
    @metrics = attributes[:metrics] || attributes["metrics"] || []
    @cta = attributes[:cta] || attributes["cta"]
    @wizard_priority = attributes[:wizard_priority] || attributes["wizard_priority"]
    @wizard_stage = attributes[:wizard_stage] || attributes["wizard_stage"] || []
    @description = attributes[:description] || attributes["description"]
  end

  def category_display
    category.to_s.split("_").map(&:capitalize).join(" ")
  end

  def anchor
    "##{id}"
  end

  def wizard_tool?
    !wizard_priority.nil?
  end

  def suitable_for_stage?(stage)
    return true if wizard_stage.empty?
    wizard_stage.include?(stage.to_s)
  end
end
