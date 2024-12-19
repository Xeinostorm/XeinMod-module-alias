global.aliases = {}; // Make aliases globally available
global.paths = {};

import { register } from 'node:module';
import { resolve } from 'node:path';
import { addAliases } from './index.mjs'
import { promises as fs } from "node:fs";

function getProjectPath() {
    return process.cwd();
}

const config = await import("../config.json", { assert: { type: "json" } });

const FilePaths = [
  // JSON files that have aliases
  resolve(`${getProjectPath()}/package.json`),
  resolve(`${getProjectPath()}/config.json`),
  resolve(`${getProjectPath()}/module_alias.json`),
  resolve(`${getProjectPath()}/aliases.json`),
  resolve(`${getProjectPath()}/xeinmod.config.json`),

  // JS files that have aliases
  resolve(`${getProjectPath()}/aliases.js`),
  resolve(`${getProjectPath()}/config.js`),
  resolve(`${getProjectPath()}/module_alias.js`),
  resolve(`${getProjectPath()}/xeinmod.config.js`),
];

async function SearchForAliases() {
    const foundAliases = [];
  
    for (const file of FilePaths) {
      if (!(await fs.stat(file).catch(() => false))) continue;
  
      try {
        const readFile = await fs.readFile(file, "utf-8");
        const fileName = basename(file);
        const SearchKeys = config[fileName];
  
        if (!SearchKeys) continue;
  
        if (fileName.endsWith(".js")) {
          const requiredFile = await import(file);
  
          for (const SearchKey of SearchKeys) {
            const SearchingForAliases = requiredFile[SearchKey] || requiredFile;
            if (!SearchingForAliases) continue;
            if (
              typeof SearchingForAliases === "object" &&
              SearchingForAliases !== null
            ) {
              // Check if the alias "@" exists in the keys or values
              if (
                !Object.keys(SearchingForAliases).includes("@") &&
                !Object.values(SearchingForAliases).includes("@")
              ) {
                continue;
              } else {
                foundAliases.push(SearchingForAliases); // Add to found aliases
              }
            }
          }
        } else {
          const ParsedContent = JSON.parse(readFile);
  
          for (const SearchKey of SearchKeys) {
            const SearchingForAliases = ParsedContent[SearchKey];
            if (!SearchingForAliases) continue;
            foundAliases.push(SearchingForAliases);
          }
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  
    if (foundAliases.length === 0) return;
  
    const uniqueAliasesArray = [...new Set(foundAliases.map(JSON.stringify))].map(
      JSON.parse,
    );
  
    const uniqueAliasesObject = uniqueAliasesArray.reduce((acc, alias) => {
      return { ...acc, ...alias };
    }, {});
  
    addAliases(uniqueAliasesObject);
}


// Helper function to resolve aliases
function resolveAlias(specifier) {
  for (const [alias, targetPath] of Object.entries(global.aliases)) {
    if (specifier.startsWith(alias)) {
      const resolvedPath = specifier.replace(alias, targetPath);
      return resolve(resolvedPath);
    }
  }
  return null; // Return null for non-aliased imports
}


export default async function init(){
    // Register the custom loader
    register((specifier, { parentURL }) => {
        const resolvedPath = resolveAlias(specifier);
        if (resolvedPath) {
            return { url: `file://${resolvedPath}` };
        }
        return null; // Let Node.js handle non-aliased imports
    });

    await SearchForAliases()
    console.log(global.aliases)
    console.log('hello')
    

    console.log('Custom loader registered. Aliases will be added dynamically.');
}



