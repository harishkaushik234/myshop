export const diseaseProfiles = {
  Inconclusive: {
    description:
      "The uploaded image does not clearly show a crop leaf or the visual symptoms are too weak for a reliable disease suggestion.",
    treatment:
      "Upload a close, well-lit image of a single affected leaf and avoid blurry full-field photos."
  },
  Healthy: {
    description:
      "Leaf color distribution looks balanced and there are no strong stress signals.",
    treatment:
      "Continue regular watering, nutrient balance, and field monitoring."
  },
  "Leaf Blight": {
    description:
      "Brown or scorched regions often point to fungal leaf blight stress.",
    treatment:
      "Remove badly infected leaves, avoid overhead watering, and apply a suitable bio-fungicide."
  },
  "Early Blight": {
    description:
      "Dry brown lesions and patchy necrosis commonly match early blight-like stress on solanaceous crops.",
    treatment:
      "Remove affected lower leaves, improve ventilation, and follow a fungicide plan recommended for blight-prone crops."
  },
  "Nitrogen Deficiency": {
    description:
      "Yellowing patterns can indicate nutrient deficiency, especially low nitrogen.",
    treatment: "Use a balanced nitrogen-rich fertilizer and review soil health."
  },
  "Rust Infection": {
    description:
      "Orange-brown tones may suggest rust-like fungal damage on the leaf surface.",
    treatment:
      "Improve airflow, remove affected leaves, and use a recommended rust-control fungicide."
  }
};

export const cropKeywords = [
  "plant",
  "leaf",
  "flower",
  "corn",
  "maize",
  "tomato",
  "potato",
  "tree"
];

export const leafKeywords = [
  "leaf",
  "plant",
  "foliage",
  "maize",
  "corn",
  "tomato",
  "potato",
  "tree"
];

export const cropProfiles = [
  { key: "Tomato", keywords: ["tomato"] },
  { key: "Potato", keywords: ["potato"] },
  { key: "Maize", keywords: ["maize", "corn"] },
  { key: "Grape", keywords: ["grape", "vine"] },
  { key: "Apple", keywords: ["apple"] }
];

export const supportedTrainingLabels = [
  "Healthy",
  "Leaf Blight",
  "Early Blight",
  "Nitrogen Deficiency",
  "Rust Infection"
];
