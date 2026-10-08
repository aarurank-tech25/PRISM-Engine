import { auth } from "./firebase";

export const isDemoModeActive = () => {
  return !auth?.currentUser && !!localStorage.getItem("prism_demo_user");
};

export const fetchWithAuth = async (url, options = {}) => {
  const user = auth?.currentUser;

  // Real Mode: Attach Firebase ID token
  if (user) {
    const headers = new Headers(options.headers || {});
    const token = await user.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...options, headers });
  }

  // Demo Mode: Isolated demo session handler
  if (isDemoModeActive()) {
    const method = (options.method || "GET").toUpperCase();

    // 1. GET /student/me
    if (url.includes("/student/me")) {
      const savedStudent = localStorage.getItem("prism_demo_student");
      if (savedStudent) {
        return new Response(savedStudent, {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ detail: "Student profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. POST /student/
    if (url.match(/\/student\/?$/) && method === "POST") {
      const body = options.body ? JSON.parse(options.body) : {};
      const demoStudent = {
        _id: "demo_student_" + Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      localStorage.setItem("prism_demo_student", JSON.stringify(demoStudent));
      return new Response(JSON.stringify(demoStudent), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. POST /parent/
    if (url.match(/\/parent\/?$/) && method === "POST") {
      const body = options.body ? JSON.parse(options.body) : {};
      const demoParent = {
        _id: "demo_parent_" + Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      localStorage.setItem("prism_demo_parent", JSON.stringify(demoParent));
      return new Response(JSON.stringify(demoParent), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. POST /assessment/
    if (url.match(/\/assessment\/?$/) && method === "POST") {
      const body = options.body ? JSON.parse(options.body) : {};
      const demoAssessment = {
        _id: "demo_assessment_" + Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      localStorage.setItem("prism_demo_assessment", JSON.stringify(demoAssessment));
      return new Response(JSON.stringify(demoAssessment), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 5. POST /analyze/
    if (url.match(/\/analyze\/?$/) && method === "POST") {
      const student = JSON.parse(localStorage.getItem("prism_demo_student") || "{}");
      const parent = JSON.parse(localStorage.getItem("prism_demo_parent") || "null");
      const assessment = JSON.parse(localStorage.getItem("prism_demo_assessment") || "{}");

      return fetch("/demo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, parent, assessment })
      });
    }

    // 6. POST /analyze/simulate
    if (url.includes("/analyze/simulate") && method === "POST") {
      const body = options.body ? JSON.parse(options.body) : {};
      const student = JSON.parse(localStorage.getItem("prism_demo_student") || "{}");
      const parent = JSON.parse(localStorage.getItem("prism_demo_parent") || "null");
      const assessment = JSON.parse(localStorage.getItem("prism_demo_assessment") || "{}");

      return fetch("/demo/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student,
          parent,
          assessment,
          overrides: body.overrides || {}
        })
      });
    }
  }

  // Fallback: standard unauthenticated request
  const headers = new Headers(options.headers || {});
  return fetch(url, { ...options, headers });
};

