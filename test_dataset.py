import json

with open("market_career/careers.json", "r", encoding="utf-8") as f:
    c_data = json.load(f)

careers = c_data["careers"]
print("Total careers in dataset:", len(careers))
required_careers = [
    "AI Engineer", "Data Scientist", "Cyber Security Engineer",
    "Cloud Engineer", "Robotics Engineer", "Mechanical Engineer",
    "Biomedical Engineer", "UI/UX Designer", "Renewable Energy Engineer",
    "EV Engineer"
]

names = [c["career_name"] for c in careers]
for req in required_careers:
    assert req in names, f"Missing required career: {req}"

print("All 10 required careers found!")

cities_required = ["Chennai", "Coimbatore", "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi NCR"]
for c in careers:
    locs = [l["city"] for l in c["top_hiring_locations"]]
    for city in cities_required:
        assert city in locs, f"{c['career_name']} missing location {city}"

print("All 7 locations verified in all careers!")

fields = [
    "career_name", "category", "short_description", "market_demand_score",
    "salary_range", "future_growth_score", "industry_growth_score",
    "location_demand_score", "required_skills", "top_hiring_locations",
    "industry_sectors", "experience_progression", "market_outlook",
    "data_source", "last_updated"
]
for c in careers:
    for fld in fields:
        assert fld in c, f"{c['career_name']} missing field: {fld}"

print("All required fields verified across all careers successfully!")
