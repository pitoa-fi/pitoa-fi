# frozen_string_literal: true

# Component for displaying a business strategy tool card
class ToolCardComponent < ViewComponent::Base
  attr_reader :tool

  def initialize(tool:)
    @tool = tool
  end

  def category_color_class
    case tool.category.to_s
    when "north_star_kpis"
      "bg-blue-100 text-blue-800"
    when "growth_engines"
      "bg-green-100 text-green-800"
    when "financial_backbone"
      "bg-purple-100 text-purple-800"
    when "market_strategy"
      "bg-orange-100 text-orange-800"
    when "decision_gates"
      "bg-red-100 text-red-800"
    when "impact_metrics"
      "bg-teal-100 text-teal-800"
    else
      "bg-gray-100 text-gray-800"
    end
  end
end
