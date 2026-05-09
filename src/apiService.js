const BASE_URL = "http://127.0.0.1:3000";

export const getArtifacts = async () => {
  const res = await fetch(`${BASE_URL}/artifacts/`);
  return res.json();
};

export const getArtifact = async (id) => {
  const res = await fetch(`${BASE_URL}/artifacts/${id}`);
  return res.json();
};

export const getArtifactParts = async (id) => {
  const res = await fetch(`${BASE_URL}/artifacts/${id}/parts`);
  return res.json();
};

export const getMuseum = async () => {
  const res = await fetch(`${BASE_URL}/museums/1`);
  return res.json();
};

export const sendContact = async (data) => {
  const res = await fetch(`${BASE_URL}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
