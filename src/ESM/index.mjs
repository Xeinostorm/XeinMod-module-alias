"use strict";

import { resolve, join, normalize, basename } from "path";



const ListOfAliases = global.aliases;
const ListOfPaths = global.paths;

function getProjectPath() {
  return process.cwd();
}

function addAlias(alias, target) {
  if (typeof alias !== "string" || alias.trim() === "") {
    throw new Error("Alias must be a non-empty string.");
  }
  if (typeof target !== "string" || target.trim() === "") {
    throw new Error("Target must be a non-empty string.");
  }
  const fullpath = join(getProjectPath(), target);
  const normalizedPath = normalize(fullpath);
  const path = resolve(normalizedPath);
  ListOfAliases[alias] = target;
  ListOfPaths[alias] = path;
  console.log(ListOfAliases, ListOfPaths);
}

function addAliases(aliases) {
  if (typeof aliases !== "object" || aliases === null) {
    throw new Error("Aliases must be a non-null object.");
  }

  Object.entries(aliases).forEach(([alias, value]) => {
    if (typeof alias !== "string" || alias.trim() === "") {
      throw new Error(`Alias "${alias}" must be a non-empty string.`);
    }
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `Target for alias "${alias}" must be a non-empty string.`,
      );
    }
    const fullpath = join(getProjectPath(), value);
    const normalizedPath = normalize(fullpath);
    const path = resolve(normalizedPath);
    ListOfAliases[alias] = value;
    ListOfPaths[alias] = path;
  });
}

function reset() {
  Object.keys(ListOfAliases).forEach((key) => delete ListOfAliases[key]);
  Object.keys(ListOfPaths).forEach((key) => delete ListOfPaths[key]);
}




export { addAlias, addAliases, reset };
