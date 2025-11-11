module ApplicationHelper
  def stage_gradient(stage_key)
    case stage_key
    when "idea"
      "from-blue-500 to-blue-600"
    when "mvp"
      "from-purple-500 to-purple-600"
    when "traction"
      "from-green-500 to-green-600"
    when "scaling"
      "from-orange-500 to-orange-600"
    else
      "from-gray-500 to-gray-600"
    end
  end

  def stage_description(stage_key)
    {
      "idea" => "You have an idea and need to validate if it's worth pursuing. Learn how to test assumptions and gather real insights.",
      "mvp" => "You're building your first version. Discover frameworks to build fast, get early users, and iterate based on feedback.",
      "traction" => "You have some users and need to prove the model works. Focus on metrics, retention, and finding product-market fit.",
      "scaling" => "Time to grow. Learn B2B sales techniques, copywriting, and growth loops to accelerate your traction."
    }[stage_key] || "Select your current stage to get started."
  end
end
