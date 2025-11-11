# frozen_string_literal: true

# Component for displaying a timeline milestone gate
class TimelineGateComponent < ViewComponent::Base
  attr_reader :stage, :date, :criteria, :status

  def initialize(stage:, date:, criteria:, status: :pending)
    @stage = stage
    @date = date
    @criteria = criteria
    @status = status # :pending, :in_progress, :completed
  end

  def status_color_class
    case status
    when :completed
      "bg-green-500"
    when :in_progress
      "bg-blue-500"
    else
      "bg-gray-300"
    end
  end

  def status_icon
    case status
    when :completed
      "✓"
    when :in_progress
      "→"
    else
      "○"
    end
  end

  def border_color_class
    case status
    when :completed
      "border-green-500"
    when :in_progress
      "border-blue-500"
    else
      "border-gray-300"
    end
  end
end
