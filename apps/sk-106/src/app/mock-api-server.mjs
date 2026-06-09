import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const appRoot = path.dirname(currentFilePath);
const projectRoot = path.resolve(appRoot, '..', '..', '..', '..');
const mockResponseRoot = path.join(appRoot, 'mock-response');
const specPath = path.join(projectRoot, 'api-docs.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const app = express();
const port = Number(process.env['MOCK_API_PORT'] ?? 3001);
const methods = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']);

app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  res.setHeader('x-mock-api', 'app-mock-response');
  next();
});

app.get('/__health', (_req, res) => {
  res.status(200).json({ ok: true, source: 'apps/sk-106/src/app/mock-response' });
});

app.use('/api', async (req, res, next) => {
  try {
    const requestPath = `${req.baseUrl}${req.path}`;
    const responseFilePath = await resolveResponseFile(req.method, requestPath);

    if (responseFilePath) {
      const response = JSON.parse(fs.readFileSync(responseFilePath, 'utf8'));

      if (typeof response.delayMs === 'number' && response.delayMs > 0) {
        await delay(response.delayMs);
      }

      if (response.headers && typeof response.headers === 'object') {
        for (const [key, value] of Object.entries(response.headers)) {
          res.setHeader(key, String(value));
        }
      }

      const statusCode = Number(response.statusCode ?? 200);
      const body = Object.prototype.hasOwnProperty.call(response, 'body') ? response.body : response;

      res.status(statusCode).json(body);
      return;
    }

    const openApiFallback = buildOpenApiFallback(req);

    if (!openApiFallback) {
      res.status(404).json({
        message: 'Mock endpoint not found',
        method: req.method,
        path: requestPath,
      });
      return;
    }

    const { statusCode, body } = openApiFallback;
    if (statusCode === 204 || body === undefined) {
      res.status(statusCode).end();
      return;
    }

    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error('Mock API error:', error);
  res.status(500).json({
    message: 'Mock API server error',
  });
});

app.listen(port, () => {
  console.log(`App mock API listening on http://localhost:${port}`);
});

async function resolveResponseFile(method, requestPath) {
  const normalizedMethod = method.toUpperCase();

  if (!methods.has(normalizedMethod)) {
    return null;
  }

  const relativePath = requestPath.replace(/^\//, '').replace(/^api\//, 'api/');
  const responseFiles = listResponseFiles(mockResponseRoot);

  for (const responseFile of responseFiles) {
    if (matchesResponseFile(responseFile, relativePath, normalizedMethod.toLowerCase())) {
      return responseFile;
    }
  }

  return null;
}

function listResponseFiles(rootDir) {
  const collectedFiles = [];

  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.response.json')) {
        collectedFiles.push(absolutePath);
      }
    }
  };

  walk(rootDir);
  return collectedFiles;
}

function matchesResponseFile(filePath, requestPath, method) {
  const relativePath = path.relative(mockResponseRoot, filePath).replace(/\\/g, '/');

  if (!relativePath.endsWith(`.${method}.response.json`) && !relativePath.endsWith('.response.json')) {
    return false;
  }

  const routePattern = relativePath.replace(new RegExp(`\\.${method}\\.response\\.json$`), '').replace(/\.response\.json$/, '');
  const patternSegments = routePattern.split('/').filter(Boolean);
  const requestSegments = requestPath.split('/').filter(Boolean);

  if (patternSegments.length !== requestSegments.length) {
    return false;
  }

  return patternSegments.every((patternSegment, index) => {
    const requestSegment = requestSegments[index];

    if (patternSegment.startsWith('[') && patternSegment.endsWith(']')) {
      return true;
    }

    if (patternSegment.startsWith(':')) {
      return true;
    }

    return patternSegment === requestSegment;
  });
}

function buildOpenApiFallback(req) {
  const openApiPath = `${req.baseUrl}${req.path}`;
  const operation = spec.paths?.[openApiPath]?.[req.method.toLowerCase()];

  if (!operation) {
    return null;
  }

  const responseSpec = pickSuccessResponse(operation.responses ?? {});
  const contentSchema = getContentSchema(responseSpec);
  const statusCode = responseSpec.statusCode ?? 200;

  return {
    statusCode,
    body: buildMockPayload(contentSchema, {
      operationId: operation.operationId ?? `${req.method} ${openApiPath}`,
      path: openApiPath,
      method: req.method.toLowerCase(),
      params: req.params,
      query: req.query,
      body: req.body,
    }),
  };
}

function pickSuccessResponse(responses) {
  for (const [statusCode, responseSpec] of Object.entries(responses)) {
    if (statusCode.startsWith('2')) {
      return { ...responseSpec, statusCode: Number(statusCode) };
    }
  }

  if (responses.default) {
    return { ...responses.default, statusCode: 200 };
  }

  return { statusCode: 200 };
}

function getContentSchema(responseSpec) {
  const content = responseSpec?.content ?? {};
  const contentEntry = content['application/json'] ?? content['*/*'] ?? Object.values(content)[0];

  return contentEntry?.schema;
}

function buildMockPayload(schema, context, trail = []) {
  if (!schema) {
    return undefined;
  }

  if (schema.example !== undefined) {
    return schema.example;
  }

  if (schema.const !== undefined) {
    return schema.const;
  }

  if (schema.$ref) {
    return buildMockPayload(resolveSchemaRef(schema.$ref), context, trail);
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return buildMockPayload(schema.oneOf[0], context, trail);
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return buildMockPayload(schema.anyOf[0], context, trail);
  }

  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    return schema.allOf.reduce((accumulator, item) => {
      const value = buildMockPayload(item, context, trail);

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return { ...accumulator, ...value };
      }

      return accumulator ?? value;
    }, undefined);
  }

  if (schema.enum?.length) {
    return schema.enum[0];
  }

  if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
    const result = {};
    const properties = schema.properties ?? {};

    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      result[propertyName] = buildMockPayload(propertySchema, context, [...trail, propertyName]);
    }

    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      result.additionalProperties = buildMockPayload(schema.additionalProperties, context, [...trail, 'additionalProperties']);
    }

    return result;
  }

  if (schema.type === 'array') {
    const itemSchema = schema.items ?? {};
    return [buildMockPayload(itemSchema, context, [...trail, '0'])];
  }

  if (schema.type === 'boolean') {
    return true;
  }

  if (schema.type === 'integer' || schema.type === 'number') {
    return schema.minimum ?? 1;
  }

  if (schema.type === 'string') {
    return buildStringValue(schema, context, trail);
  }

  return null;
}

function buildStringValue(schema, context, trail) {
  const fieldName = trail[trail.length - 1] ?? 'value';
  const normalizedName = String(fieldName).replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();

  if (schema.format === 'date-time') {
    return new Date('2026-06-09T00:00:00.000Z').toISOString();
  }

  if (schema.format === 'date') {
    return '2026-06-09';
  }

  if (schema.format === 'email') {
    return `${normalizedName}@example.com`;
  }

  if (schema.format === 'uuid') {
    return '00000000-0000-4000-8000-000000000000';
  }

  if (schema.format === 'uri') {
    return `https://example.com/${normalizedName}`;
  }

  if (schema.format === 'binary') {
    return 'mock-binary-data';
  }

  if (context.path.includes('captcha') && normalizedName.includes('image')) {
    return 'data:image/svg+xml;base64,PHN2Zy8+';
  }

  if (normalizedName.includes('phone')) {
    return '0901234567';
  }

  if (normalizedName.includes('email')) {
    return `${String(context.operationId).replace(/[^a-zA-Z0-9]+/g, '.').toLowerCase()}@example.com`;
  }

  if (normalizedName.includes('id')) {
    return `${normalizedName}-001`;
  }

  return `${context.operationId} ${fieldName}`;
}

function resolveSchemaRef(ref) {
  const schemaName = ref.replace('#/components/schemas/', '');
  return spec.components?.schemas?.[schemaName] ?? { type: 'object' };
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}