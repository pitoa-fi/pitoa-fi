# frozen_string_literal: true

require "test_helper"

class WalkthroughControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get root_url
    assert_response :success
    assert_select "h1", text: "Startup Traction Toolkit"
    assert_select "[data-controller='language-toggle']"
    assert_select "[data-language-toggle-target='copy'][data-lang='fi']", minimum: 1
  end

  test "should get metrics" do
    get metrics_url
    assert_response :success
    assert_select "h1", "Metrics & KPIs Dashboard"
  end

  test "should get timeline" do
    get timeline_url
    assert_response :success
    assert_select "h1", "Development Timeline"
  end

  test "should get impact" do
    get impact_url
    assert_response :success
    assert_select "h1", "Impact Dashboard"
  end

  test "index should display all 20 tools" do
    get root_url
    assert_response :success

    tools = BusinessToolkit.all
    assert_equal 20, tools.count

    # Verify at least some tool names are present
    assert_select ".bg-white.rounded-lg.shadow-md", count: 20
  end

  test "metrics page should display metric dials" do
    get metrics_url
    assert_response :success
    assert_select "svg circle", minimum: 2
  end
end
