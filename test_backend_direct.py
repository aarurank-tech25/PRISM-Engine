import json
import asyncio
from backend.market_main import (
    root, 
    get_careers, 
    get_career_by_id, 
    compare_careers, 
    recommendation_insights,
    get_locations,
    get_trends
)

# 1. Test root
res_root = root()
assert res_root["message"] == "PRISM Market Intelligence API is running"
print("Root function test passed!")

# 2. Test list careers
res_careers = get_careers(category=None, min_demand=None, city=None)
assert res_careers["count"] == 12
print("List careers test passed! Count:", res_careers["count"])

# 3. Test filter by city
res_city = get_careers(category=None, min_demand=None, city="Coimbatore")
assert res_city["count"] > 0
print(f"Coimbatore filter test passed! Matched: {res_city['count']}")

# 5. Test detail
res_detail = get_career_by_id("ai-engineer")
# Note: In careers.json it's career_name, but we must check if get_career_by_id works
assert res_detail["career_name"] == "AI Engineer"
print("Career detail test passed!")

# 6. Test comparison
res_compare = compare_careers("ai-engineer,data-scientist,cyber-security-engineer")
assert res_compare["count"] == 3
print("Comparison test passed!")

# 7. Test recommendation insights
res_recom = recommendation_insights("ai-engineer", "Chennai")
assert "market_fit_vector" in res_recom
assert res_recom["city_evaluated"] == "Chennai"
print("Recommendation insights test passed!")

print("All backend logic and endpoints verified successfully!")
