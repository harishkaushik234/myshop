# Crop AI Pipeline

This folder gives you a local, free, training-ready pipeline for crop disease classification.

## Folder layout

```text
backend/ai/
  config/
    labels.json
  data/
    raw/
      Healthy/
      Leaf Blight/
      Early Blight/
      Nitrogen Deficiency/
      Rust Infection/
    processed/
      manifest.json
  scripts/
    prepareDataset.js
    trainCustomModel.js
```

## Workflow

1. Put labeled crop-leaf images into `backend/ai/data/raw/<label>/`.
2. Run `npm run ai:prepare`.
3. Run `npm run ai:train`.
4. The trained lightweight model file is written to:

```text
backend/src/ai/customCropDiseaseModel.json
```

5. A training report is also written to:

```text
backend/ai/data/processed/training-report.json
```

6. Restart the backend. The disease service will automatically use the custom trained model when this file exists.

## Notes

- This pipeline is fully local and free.
- It uses MobileNet embeddings plus class centroids, so it is lightweight and practical on CPU-only machines.
- It is a real training pipeline for your own dataset, but it is not a heavy deep-learning finetuning setup.
- The trainer now creates a train/validation split and reports validation accuracy when enough images exist.
- If you later collect a larger dataset and want a stronger CNN/ViT training flow, this structure can be upgraded.
