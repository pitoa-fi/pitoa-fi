# frozen_string_literal: true

# Interactive wizard controller that guides users through discovering relevant business tools
class WizardController < ApplicationController
  STAGES = {
    "idea" => "Idea Validation",
    "mvp" => "Building MVP",
    "traction" => "Early Traction",
    "scaling" => "Scaling"
  }.freeze

  def start
    # Wizard entry point - renders the welcome screen
    @stages = STAGES
  end

  def journey
    # Main wizard experience - single page with all steps driven by Stimulus
    @stage = params[:stage] || "idea"
    @tools = recommended_tools_for_stage(@stage)
    @all_wizard_tools = BusinessToolkit.wizard_tools
  end

  def results
    # Final results page showing personalized toolkit
    @stage = params[:stage] || "idea"
    @tools = recommended_tools_for_stage(@stage)
    @completed_steps = params[:completed_steps]&.split(",") || []
  end

  private

  def recommended_tools_for_stage(stage)
    BusinessToolkit.wizard_tools
                   .select { |tool| tool.suitable_for_stage?(stage) }
                   .sort_by(&:wizard_priority)
  end
end
