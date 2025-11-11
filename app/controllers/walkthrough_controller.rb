# frozen_string_literal: true

# Controller for the main walkthrough pages showcasing business strategy tools
class WalkthroughController < ApplicationController
  def index
    @tools = BusinessToolkit.all
    @categories = BusinessToolkit.categories
  end

  def show
    @tool = BusinessToolkit.find(params[:id])

    if @tool.nil?
      redirect_to root_path, alert: "Tool not found"
    end
  end

  def metrics
    @tools = BusinessToolkit.by_category(:north_star_kpis)
    @financial_tools = BusinessToolkit.by_category(:financial_backbone)
  end

  def timeline
    # Static roadmap milestones used by the public walkthrough; tweak these to mirror
    # your own delivery stages or source them from a database later on.
    @decision_gates = BusinessToolkit.by_category(:decision_gates)
    @milestones = [
      { stage: "Discovery", date: "Month 1-2", criteria: ["Market validation", "10 supplier interviews"] },
      { stage: "MVP Launch", date: "Month 3-4", criteria: ["50 suppliers", "First transactions"] },
      { stage: "Early Growth", date: "Month 5-8", criteria: ["€50K GMV", "Positive unit economics"] },
      { stage: "Scale", date: "Month 9-18", criteria: ["€500K GMV", "Multi-region expansion"] }
    ]
  end

  def impact
    # These hashes power the hero stats + cards on /impact and intentionally live
    # in Ruby so they stay in sync with the YAML-driven toolkit data.
    @impact_tools = BusinessToolkit.by_category(:impact_metrics)
    @impact_data = {
      payouts: "€5M+",
      co2_saved: "2,500 tonnes",
      jobs_created: 450,
      rural_businesses: 120
    }
  end
end
