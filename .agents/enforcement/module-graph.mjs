import fs from "node:fs";
import path from "node:path";

export const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs"];
const NON_SOURCE_EXTENSIONS = new Set([
  ".css", ".scss", ".sass", ".less", ".json", ".svg", ".png", ".jpg",
  ".jpeg", ".gif", ".webp", ".avif", ".woff", ".woff2", ".ttf", ".ico",
]);

function withoutJsonComments(source) {
  let output = "";
  let cursor = 0;
  let isInsideString = false;
  let isEscaped = false;

  while (cursor < source.length) {
    const character = source[cursor];
    const nextCharacter = source[cursor + 1];

    if (isInsideString) {
      output += character;
      if (isEscaped) isEscaped = false;
      else if (character === "\\") isEscaped = true;
      else if (character === '"') isInsideString = false;
      cursor += 1;
      continue;
    }

    if (character === '"') {
      isInsideString = true;
      output += character;
      cursor += 1;
      continue;
    }

    if (character === "/" && nextCharacter === "/") {
      while (cursor < source.length && source[cursor] !== "\n") {
        output += " ";
        cursor += 1;
      }
      continue;
    }

    if (character === "/" && nextCharacter === "*") {
      output += "  ";
      cursor += 2;
      while (cursor < source.length && !source.startsWith("*/", cursor)) {
        output += source[cursor] === "\n" ? "\n" : " ";
        cursor += 1;
      }
      if (cursor >= source.length) throw new SyntaxError("Unterminated block comment");
      output += "  ";
      cursor += 2;
      continue;
    }

    output += character;
    cursor += 1;
  }

  return output;
}

function withoutTrailingCommas(source) {
  let output = "";
  let cursor = 0;
  let isInsideString = false;
  let isEscaped = false;

  while (cursor < source.length) {
    const character = source[cursor];

    if (isInsideString) {
      output += character;
      if (isEscaped) isEscaped = false;
      else if (character === "\\") isEscaped = true;
      else if (character === '"') isInsideString = false;
      cursor += 1;
      continue;
    }

    if (character === '"') {
      isInsideString = true;
      output += character;
      cursor += 1;
      continue;
    }

    if (character === ",") {
      let nextToken = cursor + 1;
      while (/\s/.test(source[nextToken] ?? "")) nextToken += 1;
      if (source[nextToken] === "}" || source[nextToken] === "]") {
        cursor += 1;
        continue;
      }
    }

    output += character;
    cursor += 1;
  }

  return output;
}

export function readJson(file) {
  const source = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  try {
    return JSON.parse(withoutTrailingCommas(withoutJsonComments(source)));
  } catch (error) {
    throw new Error(`Unable to parse TypeScript config ${file}: ${error.message}`);
  }
}

export function loadTsConfig(sourceRoot) {
  const candidates = [
    path.join(sourceRoot, "..", "tsconfig.app.json"),
    path.join(sourceRoot, "tsconfig.json"),
    path.join(sourceRoot, "..", "..", "tsconfig.json"),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const config = readJson(candidate);
    const compilerOptions = config.compilerOptions ?? {};
    return {
      baseUrl: path.resolve(path.dirname(candidate), compilerOptions.baseUrl ?? "."),
      paths: compilerOptions.paths ?? {},
    };
  }

  return { baseUrl: sourceRoot, paths: {} };
}

function fileCandidates(base) {
  return [
    ...(SOURCE_EXTENSIONS.includes(path.extname(base)) ? [base] : []),
    ...SOURCE_EXTENSIONS.map((extension) => `${base}${extension}`),
    ...SOURCE_EXTENSIONS.map((extension) => path.join(base, `index${extension}`)),
  ];
}

export function isConfiguredAlias(specifier, paths) {
  return Object.keys(paths).some((alias) => {
    if (alias.endsWith("/*")) {
      const prefix = alias.slice(0, -2);
      return specifier.startsWith(`${prefix}/`);
    }
    return specifier === alias;
  });
}

export function isLocalSourceSpecifier(specifier, config) {
  const extension = path.extname(specifier);
  if (NON_SOURCE_EXTENSIONS.has(extension)) return false;

  if (specifier.startsWith(".")) {
    return true;
  }
  return isConfiguredAlias(specifier, config.paths);
}

export function resolveImport(specifier, importer, config) {
  const candidates = [];

  if (specifier.startsWith(".")) {
    candidates.push(path.resolve(path.dirname(importer), specifier));
  }

  for (const [alias, targets] of Object.entries(config.paths)) {
    const prefix = alias.endsWith("/*") ? alias.slice(0, -2) : alias;
    const matchesAlias = alias.endsWith("/*")
      ? specifier.startsWith(`${prefix}/`)
      : specifier === alias;
    if (!matchesAlias) continue;

    const remainder = specifier.slice(prefix.length).replace(/^\//, "");
    for (const target of targets) {
      const targetPrefix = target.endsWith("/*") ? target.slice(0, -2) : target;
      candidates.push(path.resolve(config.baseUrl, targetPrefix, remainder));
    }
  }

  for (const candidate of candidates) {
    for (const file of fileCandidates(candidate)) {
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
    }
  }

  return null;
}

function skipTrivia(source, index) {
  let cursor = index;
  while (cursor < source.length) {
    if (/\s/.test(source[cursor])) {
      cursor += 1;
      continue;
    }
    if (source.startsWith("//", cursor)) {
      const end = source.indexOf("\n", cursor + 2);
      cursor = end === -1 ? source.length : end + 1;
      continue;
    }
    if (source.startsWith("/*", cursor)) {
      const end = source.indexOf("*/", cursor + 2);
      cursor = end === -1 ? source.length : end + 2;
      continue;
    }
    break;
  }
  return cursor;
}

function readString(source, index) {
  const quote = source[index];
  if (quote !== "\"" && quote !== "'") return null;

  let cursor = index + 1;
  let value = "";
  while (cursor < source.length) {
    const char = source[cursor];
    if (char === "\\") {
      if (cursor + 1 >= source.length) return null;
      value += source[cursor + 1];
      cursor += 2;
      continue;
    }
    if (char === quote) return { value, end: cursor + 1 };
    if (char === "\n" || char === "\r") return null;
    value += char;
    cursor += 1;
  }
  return null;
}

function skipStringOrTemplate(source, index) {
  const quote = source[index];
  if (quote === "'" || quote === '"') {
    const value = readString(source, index);
    return value?.end ?? source.length;
  }
  if (quote !== "`") return index;

  let cursor = index + 1;
  while (cursor < source.length) {
    if (source[cursor] === "\\") {
      cursor += 2;
      continue;
    }
    if (source[cursor] === "`") return cursor + 1;
    cursor += 1;
  }
  return source.length;
}

function readIdentifier(source, index) {
  const match = /^[A-Za-z_$][\w$]*/.exec(source.slice(index));
  return match ? { value: match[0], end: index + match[0].length } : null;
}

function findFromSpecifier(source, index) {
  let cursor = index;
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;

  while (cursor < source.length) {
    cursor = skipTrivia(source, cursor);
    if (cursor >= source.length) return null;

    const char = source[cursor];
    if (char === "'" || char === '"' || char === "`") {
      cursor = skipStringOrTemplate(source, cursor);
      continue;
    }

    const identifier = readIdentifier(source, cursor);
    if (identifier) {
      if (identifier.value === "from" && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
        return readString(source, skipTrivia(source, identifier.end));
      }
      cursor = identifier.end;
      continue;
    }

    if (char === "{") braceDepth += 1;
    else if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    else if (char === "(") parenDepth += 1;
    else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (char === "[") bracketDepth += 1;
    else if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === ";" && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) return null;

    cursor += 1;
  }

  return null;
}

export function extractImports(source) {
  const imports = [];
  let cursor = 0;

  while (cursor < source.length) {
    if (source.startsWith("//", cursor)) {
      const end = source.indexOf("\n", cursor + 2);
      cursor = end === -1 ? source.length : end + 1;
      continue;
    }
    if (source.startsWith("/*", cursor)) {
      const end = source.indexOf("*/", cursor + 2);
      cursor = end === -1 ? source.length : end + 2;
      continue;
    }
    if (source[cursor] === "'" || source[cursor] === '"' || source[cursor] === "`") {
      cursor = skipStringOrTemplate(source, cursor);
      continue;
    }

    const token = readIdentifier(source, cursor);
    if (!token) {
      cursor += 1;
      continue;
    }

    if (token.value === "import") {
      let next = skipTrivia(source, token.end);
      if (source[next] === "(") {
        next = skipTrivia(source, next + 1);
        const literal = readString(source, next);
        if (literal) imports.push({ specifier: literal.value, index: cursor });
      } else if (source[next] !== ".") {
        const literal = readString(source, next);
        const candidate = literal ?? findFromSpecifier(source, next);
        if (candidate) imports.push({ specifier: candidate.value, index: cursor });
      }
    } else if (token.value === "export") {
      const candidate = findFromSpecifier(source, token.end);
      if (candidate) imports.push({ specifier: candidate.value, index: cursor });
    } else if (token.value === "require") {
      const next = skipTrivia(source, token.end);
      if (source[next] === "(") {
        const literal = readString(source, skipTrivia(source, next + 1));
        if (literal) imports.push({ specifier: literal.value, index: cursor });
      }
    }

    cursor = token.end;
  }

  return imports;
}

export function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}
