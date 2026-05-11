// ============================================================
//  api.js — Archive Project API Helper
//  Base URL: Railway deployment
// ============================================================

const BASE_URL = "https://archive-backend-production.up.railway.app";

// ============================================================
//  MUSEUM
// ============================================================

// GET all museums
export async function getMuseums() {
  const res = await fetch(`${BASE_URL}/museums/`);
  if (!res.ok) throw new Error("Failed to fetch museums");
  return res.json();
}

// GET single museum by ID
export async function getMuseumById(museumId) {
  const res = await fetch(`${BASE_URL}/museums/${museumId}`);
  if (!res.ok) throw new Error(`Failed to fetch museum ${museumId}`);
  return res.json();
}

// ============================================================
//  ARTIFACTS
// ============================================================

// GET all artifacts
export async function getArtifacts() {
  const res = await fetch(`${BASE_URL}/artifacts/`);
  if (!res.ok) throw new Error("Failed to fetch artifacts");
  return res.json();
}

// GET single artifact by ID
export async function getArtifactById(artifactId) {
  const res = await fetch(`${BASE_URL}/artifacts/${artifactId}`);
  if (!res.ok) throw new Error(`Failed to fetch artifact ${artifactId}`);
  return res.json();
}

// GET artifact info (who is he, importance, description, evidence)
export async function getArtifactInfo(artifactId) {
  const res = await fetch(`${BASE_URL}/artifacts/${artifactId}/info`);
  if (!res.ok) throw new Error(`Failed to fetch info for artifact ${artifactId}`);
  return res.json();
}

// GET artifact parts by artifact ID
export async function getArtifactParts(artifactId) {
  const res = await fetch(`${BASE_URL}/artifacts/${artifactId}/parts`);
  if (!res.ok) throw new Error(`Failed to fetch parts for artifact ${artifactId}`);
  return res.json();
}

// ============================================================
//  NARRATIVES
// ============================================================

// GET narratives by artifact ID
export async function getNarrativeByArtifact(artifactId) {
  const res = await fetch(`${BASE_URL}/artifacts/${artifactId}/narratives`);
  if (!res.ok) throw new Error(`Failed to fetch narrative for artifact ${artifactId}`);
  return res.json();
}

// ============================================================
//  EGYPT'S TIMELINE — ERAS & KINGS
// ============================================================

// GET all eras with their kings

// GET king descriptions by king ID
export async function getEras() {
  const res = await fetch(`${BASE_URL}/Era_kings/`);
  if (!res.ok) throw new Error("Failed to fetch kings");
  return res.json();
}

// ============================================================
//  CONTACT
// ============================================================

// POST contact message
export async function sendContactMessage(data) {
  const res = await fetch(`${BASE_URL}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to send contact message");
  return res.json();
}

// ============================================================
//  USAGE EXAMPLES
// ============================================================
//
//  import { getArtifacts, getArtifactInfo, getEras, getKingDesc } from './api.js';
//
//  // Get all artifacts
//  const artifacts = await getArtifacts();
//
//  // Get Khafre info (artifact_id = 2)
//  const info = await getArtifactInfo(2);
//  console.log(info.who_is_he);
//  console.log(info.importance_and_role);
//  console.log(info.statue_description);
//  console.log(info.evidence_of_importance);
//
//  // Get all eras with kings for timeline page
//  const eras = await getEras();
//
//  // Get king descriptions (e.g. Narmer king_id = 1)
//  const desc = await getKingDesc(1);
//
//  // Send contact form
//  await sendContactMessage({ name: "John", email: "john@example.com", message: "Hello!" });
//
// ============================================================
