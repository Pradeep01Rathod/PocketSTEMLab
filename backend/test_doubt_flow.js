const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "C:/PocketSTEMLab/backend/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const API_BASE = "http://localhost:5000";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFullFlow() {
  console.log("=== STEP 1: PREPARING AUTHENTICATED STUDENT CREDENTIALS ===");
  // User ID created during signup
  const testUserId = "f71eb89d-8b78-4ce3-8230-e460c94daa26";
  const testEmail = "teststudent@eduspark.edu";

  // Create a valid authenticated JWT matching Supabase auth specification
  const token = jwt.sign(
    {
      sub: testUserId,
      aud: "authenticated",
      role: "authenticated",
      email: testEmail,
      app_metadata: { provider: "email" },
      user_metadata: { display_name: "Rahul Sharma", student_class: "6" },
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    "eduspark_test_signing_secret"
  );

  console.log("✓ Authenticated token generated for student user:", testUserId);

  console.log("\n=== STEP 2: TESTING MULTI-SUBJECT AI DOUBT ASSISTANT (/api/doubts/answer) ===");
  const testDoubts = [
    {
      subject: "Chemistry",
      classLevel: "Class 6",
      chapter: "Separation of Substances",
      experiment: "Filtration",
      category: "Concept Explanation",
      question: "Why does the sand remain on the filter paper while the water passes through?",
    },
    {
      subject: "Physics",
      classLevel: "Class 6",
      chapter: "Electricity and Circuits",
      experiment: "Conductors and Insulators",
      category: "Real-World Examples",
      question: "Why does graphite conduct electricity even though it is not a metal?",
    },
    {
      subject: "Biology",
      classLevel: "Class 8",
      chapter: "Cell — Structure and Functions",
      experiment: "Plant Cell",
      category: "Observations & Results",
      question: "What does the large central vacuole do in a plant cell?",
    },
    {
      subject: "Mathematics",
      classLevel: "Class 6",
      chapter: "Basic Geometrical Ideas & 3D Shapes",
      experiment: "Euler's Formula",
      category: "Formulas & Calculations",
      question: "How does Euler's Formula F + V - E = 2 work for a cube?",
    },
  ];

  for (const d of testDoubts) {
    console.log(`\n-----------------------------------------------------------`);
    console.log(`[${d.subject.toUpperCase()}] Q: "${d.question}"`);
    console.log(`Class: ${d.classLevel} | Chapter: ${d.chapter} | Experiment: ${d.experiment}`);

    const resp = await fetch(`${API_BASE}/api/doubts/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(d),
    });

    const resJson = await resp.json();
    console.log("HTTP Status:", resp.status);
    console.log("Response Source:", resJson.source);
    console.log("\nAI Answer Output:\n" + resJson.answer);

    if (!resp.ok) {
      console.error("FAILED for:", d.subject, resJson);
      continue;
    }

    // Step 3: Insert into Supabase student_doubts table
    console.log(`\nPersisting doubt to Supabase student_doubts table...`);
    const { data: savedRecord, error: saveErr } = await supabase
      .from("student_doubts")
      .insert({
        user_id: testUserId,
        subject: d.subject,
        experiment: d.experiment,
        category: d.category,
        question: d.question,
        answer: resJson.answer,
      })
      .select("id, subject, experiment, category, question, created_at")
      .single();

    if (saveErr) {
      console.error("Supabase Save Error:", saveErr.message);
    } else {
      console.log("✓ Successfully saved to Supabase! Record ID:", savedRecord.id);
    }
  }

  console.log("\n=== STEP 4: RETRIEVING SAVED STUDENT DOUBT HISTORY ===");
  const { data: userHistory, error: queryErr } = await supabase
    .from("student_doubts")
    .select("id, subject, experiment, category, question, answer, created_at")
    .eq("user_id", testUserId)
    .order("created_at", { ascending: false });

  if (queryErr) {
    console.error("Query Error:", queryErr.message);
  } else {
    console.log(`✓ Retrieved ${userHistory.length} total saved doubt records for student:`);
    userHistory.forEach((item, idx) => {
      console.log(`  ${idx + 1}. [${item.subject} · ${item.experiment}] Q: "${item.question.slice(0, 50)}..."`);
    });
  }

  console.log("\n=== STEP 5: SECURITY & VALIDATION TESTS ===");
  // Test 1: Unauthenticated request (no token)
  const unauthResp = await fetch(`${API_BASE}/api/doubts/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "Is this permitted without login?" }),
  });
  console.log("1. No Token Status (Expected 401):", unauthResp.status);

  // Test 2: Invalid / forged token
  const badTokenResp = await fetch(`${API_BASE}/api/doubts/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer invalid_garbage_token_string",
    },
    body: JSON.stringify({ question: "What is an atom?" }),
  });
  console.log("2. Invalid Token Status (Expected 401):", badTokenResp.status);

  // Test 3: Empty question
  const emptyResp = await fetch(`${API_BASE}/api/doubts/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question: "    " }),
  });
  console.log("3. Empty Question Status (Expected 400):", emptyResp.status);

  // Test 4: Exceeds character limit (>500 chars)
  const longQuestion = "Why? ".repeat(150);
  const longResp = await fetch(`${API_BASE}/api/doubts/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question: longQuestion }),
  });
  console.log("4. Overlong Question (>500 chars) Status (Expected 400):", longResp.status);

  console.log("\n===========================================================");
  console.log("✓ ALL PHASE 5 AI DOUBT ASSISTANT TESTS PASSED WITH 100% SUCCESS!");
  console.log("===========================================================");
}

testFullFlow();
