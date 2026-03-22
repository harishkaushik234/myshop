import fs from "fs/promises";
import path from "path";
import labelsCatalog from "../config/labels.json" with { type: "json" };

const rawRoot = path.resolve("ai/data/raw");
const processedRoot = path.resolve("ai/data/processed");
const manifestPath = path.join(processedRoot, "manifest.json");
const validExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const ensureDirectory = async (directoryPath) => {
  await fs.mkdir(directoryPath, { recursive: true });
};

const listFilesRecursively = async (directoryPath) => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const items = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return listFilesRecursively(fullPath);
      }

      return fullPath;
    })
  );

  return items.flat();
};

const run = async () => {
  await ensureDirectory(rawRoot);
  await ensureDirectory(processedRoot);

  const manifest = [];

  for (const labelEntry of labelsCatalog) {
    const labelDir = path.join(rawRoot, labelEntry.label);
    await ensureDirectory(labelDir);
    const files = await listFilesRecursively(labelDir);

    files
      .filter((filePath) => validExtensions.has(path.extname(filePath).toLowerCase()))
      .forEach((filePath) => {
        manifest.push({
          label: labelEntry.label,
          cropType: labelEntry.cropType,
          description: labelEntry.description,
          treatment: labelEntry.treatment,
          filePath
        });
      });
  }

  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalSamples: manifest.length,
        labels: labelsCatalog,
        samples: manifest
      },
      null,
      2
    )
  );

  const summary = labelsCatalog.map((labelEntry) => ({
    label: labelEntry.label,
    count: manifest.filter((sample) => sample.label === labelEntry.label).length
  }));

  console.log("Dataset manifest created:", manifestPath);
  console.table(summary);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
