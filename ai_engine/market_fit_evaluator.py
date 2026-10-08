# PRISM Engine - Market Fit & Location Fit Evaluator
# Owned by Jaishwa (Career & Job Market Intelligence Module)
import json
from pathlib import Path
from typing import Dict, Any, Optional

DATA_PATH = Path(__file__).resolve().parent.parent / "market_career" / "careers.json"

def load_career_data() -> Dict[str, Any]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def evaluate_market_fit(
    career_id: str,
    target_city: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calculates Market Fit, Location Fit, and Future Growth vectors
    for the PRISM AI recommendation engine.
    
    Formula input for PRISM AI Core:
    PRISM Career Score = (0.30 * Student Fit) + (0.20 * Financial Fit) 
                       + (0.25 * Market Fit) + (0.10 * Location Fit) 
                       + (0.10 * Future Growth) + (0.05 * Education Accessibility)
    """
    data = load_career_data()
    careers = data.get("careers", [])
    career = next((c for c in careers if c["career_id"] == career_id), None)
    
    if not career:
        return {
            "error": f"Career id {career_id} not found in market intelligence database"
        }
    
    market_demand_score = career.get("market_demand_score", 75)
    future_growth_score = career.get("future_growth_score", 75)
    location_demand_score = career.get("location_demand_score", 80)
    city_specific_notes = ""
    matched_city_score = location_demand_score
    
    if target_city:
        target_city_lower = target_city.strip().lower()
        loc_entry = next(
            (loc for loc in career.get("top_hiring_locations", []) 
             if loc["city"].lower() == target_city_lower), 
            None
        )
        if loc_entry:
            matched_city_score = loc_entry["score"]
            city_specific_notes = f"Demand in {loc_entry['city']} is {loc_entry['demand_level']} ({loc_entry['score']}%) with hubs in: {loc_entry['ecosystem_notes']}"
        else:
            matched_city_score = max(50, location_demand_score - 15)
            city_specific_notes = f"Limited direct hubs in {target_city}; nearest major cluster recommended in regional tech centers."

    top_cities = [l["city"] for l in career.get("top_hiring_locations", [])[:3]]
    cities_str = ", ".join(top_cities)
    
    rationale = (
        f"High market viability ({market_demand_score}%) with strong projected growth "
        f"({career.get('future_growth_rate', '+25%')}). Top opportunities clustered around {cities_str}. "
        f"Salary potential is {career.get('salary_potential', 'High')} with an average mid-tier band of {career.get('salary_range', {}).get('mid_level', 'competitive')}."
    )
    
    return {
        "career_id": career["career_id"],
        "career_name": career["career_name"],
        "market_fit_vector": {
            "market_demand_score": market_demand_score,
            "future_growth_score": future_growth_score,
            "location_demand_score": matched_city_score,
            "salary_potential": career.get("salary_potential", "High"),
            "average_lpa": career.get("salary_range", {}).get("average_lpa", 12.0)
        },
        "city_evaluated": target_city,
        "city_specific_notes": city_specific_notes,
        "recommendation_explanation": rationale,
        "module_credit": {
            "module_name": "Career & Job Market Intelligence",
            "owner": "Jaishwa",
            "last_updated": career.get("last_updated", "Q1 2026"),
            "data_nature": "Synthetic Market Intelligence for Prototype Demonstration"
        }
    }

if __name__ == "__main__":
    result = evaluate_market_fit("ai-engineer", "Chennai")
    print(json.dumps(result, indent=2))
