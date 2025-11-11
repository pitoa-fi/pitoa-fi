# frozen_string_literal: true

# Component for displaying a metric with a circular dial/gauge
class MetricDialComponent < ViewComponent::Base
  attr_reader :title, :value, :target, :unit

  def initialize(title:, value:, target: nil, unit: "")
    @title = title
    @value = value
    @target = target
    @unit = unit
  end

  def percentage
    return 100 if target.nil? || target.zero?

    ((value.to_f / target.to_f) * 100).round(1)
  end

  def display_value
    "#{value}#{unit}"
  end

  def display_target
    target ? "#{target}#{unit}" : nil
  end

  def color_class
    return "text-gray-600" if target.nil?

    pct = percentage
    if pct >= 100
      "text-green-600"
    elsif pct >= 70
      "text-blue-600"
    elsif pct >= 40
      "text-yellow-600"
    else
      "text-red-600"
    end
  end
end
