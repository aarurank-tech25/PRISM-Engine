export const COURSE_MAPPINGS = {
  "AI Engineer": [
    "B.E / B.Tech Computer Science (AI & ML Specialization)",
    "B.Sc Data Science / Artificial Intelligence",
    "M.Tech AI / Applied Machine Learning Pathway",
    "Deep Learning Certifications (Coursera/AWS/Azure)"
  ],
  "Data Scientist": [
    "B.Sc / B.Tech in Data Science, Statistics, or Applied Mathematics",
    "BCA with Advanced Data Analytics Specialization",
    "Postgraduate Diploma in Data Science",
    "Google/IBM Data Science Certifications"
  ],
  "Cyber Security Engineer": [
    "B.E / B.Tech Computer Science (Cyber Security Specialization)",
    "BCA in Information Security",
    "Certified Ethical Hacker (CEH) / CISSP Pathway",
    "Diploma in Network Security"
  ],
  "Cloud Engineer": [
    "B.E / B.Tech Computer Science / IT",
    "BCA with Cloud Computing Focus",
    "AWS Certified Solutions Architect / Azure Fundamentals",
    "Advanced Diploma in Cloud Infrastructure"
  ],
  "Robotics Engineer": [
    "B.E / B.Tech Mechatronics or Robotics",
    "B.E Electronics and Communication (ECE)",
    "M.Tech Automation and Robotics",
    "ROS (Robot Operating System) Certification Pathway"
  ],
  "Mechanical Engineer": [
    "B.E / B.Tech Mechanical Engineering",
    "Diploma in Mechanical / Manufacturing Engineering",
    "CAD/CAM Advanced Certifications",
    "M.Tech Thermal or Design Engineering"
  ],
  "Biomedical Engineer": [
    "B.E / B.Tech Biomedical Engineering",
    "B.Sc Biotechnology with Electronics Foundation",
    "M.Tech Medical Electronics",
    "Healthcare Technology Certifications"
  ],
  "UI/UX Designer": [
    "B.Des (Bachelor of Design) in Interaction Design",
    "B.Sc / B.A in Visual Communication or Graphic Design",
    "Google UX Design Professional Certificate",
    "HCI (Human-Computer Interaction) Specialization"
  ],
  "Renewable Energy Engineer": [
    "B.E / B.Tech Energy Engineering",
    "B.E Electrical and Electronics (EEE) with Solar/Wind Focus",
    "M.Tech Renewable Energy",
    "Certified Energy Auditor (CEA) Pathway"
  ],
  "EV Engineer": [
    "B.E / B.Tech Electrical or Automobile Engineering",
    "B.Tech with Specialization in Electric Vehicles",
    "Advanced Diploma in Battery Management Systems",
    "M.Tech EV Technology"
  ],
  "Quantum Computing Specialist": [
    "B.Sc / M.Sc Physics with Quantum Computing Focus",
    "B.E / B.Tech Computer Science / Engineering Physics",
    "M.Tech / Ph.D in Quantum Information Systems",
    "IBM Quantum Developer Certification"
  ],
  "AgriTech Automation Specialist": [
    "B.Tech Agricultural Engineering",
    "B.E Mechatronics with Agri Focus",
    "B.Sc Agriculture with IoT Certifications",
    "Precision Agriculture Diploma Pathway"
  ]
};

export const getRecommendedCourses = (careerName) => {
  return COURSE_MAPPINGS[careerName] || [
    "Education pathway information unavailable."
  ];
};
