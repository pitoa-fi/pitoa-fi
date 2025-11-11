Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "wizard#start"

  # Interactive Wizard
  get "wizard/start", to: "wizard#start", as: :wizard_start
  get "wizard/journey", to: "wizard#journey", as: :wizard_journey
  get "wizard/results", to: "wizard#results", as: :wizard_results

  # Walkthrough pages (legacy - keep for now)
  get "all-tools", to: "walkthrough#index", as: :all_tools
  get "metrics", to: "walkthrough#metrics"
  get "timeline", to: "walkthrough#timeline"
  get "impact", to: "walkthrough#impact"
  get "tools/:id", to: "walkthrough#show", as: :tool
end
