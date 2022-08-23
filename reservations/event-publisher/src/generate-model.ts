import { compile, compileFromFile } from "json-schema-to-typescript";
import fs from "fs";
import path from "path";

const schemas_dir = path.join(__dirname, "schemas");
const models_dir = path.join(__dirname, "models");

if (!fs.existsSync(models_dir)) {
  fs.mkdirSync(models_dir);
}

const schemas = fs.readdirSync(schemas_dir);

schemas.forEach(async (schema) => {
  console.log(`Generating model for`, schema);
  const contents = fs
    .readFileSync(path.join(schemas_dir, schema))
    .toString("utf-8");
  const dereferenced = contents.replace(
    /http:\/\/example.com\/schemas/g,
    schemas_dir
  );

  const jsonSchema = JSON.parse(dereferenced);
  await compile(jsonSchema, schema.replace("-", "").replace(".json", "")).then(
    (ts) =>
      fs.writeFileSync(
        path.join(models_dir, schema.replace(".json", ".d.ts")),
        ts
      )
  );
});

console.log(`Model successfully generated`);
