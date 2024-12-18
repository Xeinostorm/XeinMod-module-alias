'use strict';
console.clear()

const { resolve, join, normalize, basename } = require('path')
const fs = require('fs')

const config = require('../config.json')

const FilePaths = [
  // JSON files that has aliases
  resolve(`${getProjectPath()}/package.json`),
  resolve(`${getProjectPath()}/config.json`),
  resolve(`${getProjectPath()}/module_alias.json`),
  resolve(`${getProjectPath()}/aliases.json`),
  resolve(`${getProjectPath()}/xeinmod.config.json`),

  // JS files that has aliases
  resolve(`${getProjectPath()}/aliases.js`),
  resolve(`${getProjectPath()}/config.js`),
  resolve(`${getProjectPath()}/module_alias.js`),
  resolve(`${getProjectPath()}/xeinmod.config.js`),
]

const ListOfAliases = {}
const ListOfPaths = {}

function getProjectPath(){
  return process.cwd()
}

function addAlias(alias, target){
  if (typeof alias !== 'string' || alias.trim() === '') {
    throw new Error('Alias must be a non-empty string.');
  }
  if (typeof target !== 'string' || target.trim() === '') {
    throw new Error('Target must be a non-empty string.');
  }
  const fullpath = join(getProjectPath(), target)
  const normalizedPath = normalize(fullpath)
  const path = resolve(normalizedPath)
  ListOfAliases[alias] = target
  ListOfPaths[alias] = path
}

function addAliases(aliases){
  if (typeof aliases !== 'object' || aliases === null) {
    throw new Error('Aliases must be a non-null object.');
  }

  Object.entries(aliases).forEach(([alias, value]) => {
    if (typeof alias !== 'string' || alias.trim() === '') {
      throw new Error(`Alias "${alias}" must be a non-empty string.`);
    }
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Target for alias "${alias}" must be a non-empty string.`);
    }
    const fullpath = join(getProjectPath(), value)
    const normalizedPath = normalize(fullpath)
    const path = resolve(normalizedPath)
    ListOfAliases[alias] = value
    ListOfPaths[alias] = path
  })
}

function reset() {
  Object.keys(ListOfAliases).forEach(key => delete ListOfAliases[key]);
  Object.keys(ListOfPaths).forEach(key => delete ListOfPaths[key]);
}

async function SearchForAliases(){

  const foundAliases = []

  for (const file of FilePaths){
    if (!fs.existsSync(file)) continue;

    try{
      const readFile = fs.readFileSync(file, 'utf-8');
      const fileName = basename(file);
      const SearchKeys = config[fileName]

      if(!SearchKeys) continue;

      if(fileName.endsWith('.js')){
        const requiredFile = require(file);

        for (const SearchKey of SearchKeys){
          const SearchingForAliases = requiredFile[SearchKey] || requiredFile
          if(!SearchingForAliases) continue
          if (typeof SearchingForAliases === 'object' && SearchingForAliases !== null) {
            // Check if the alias "@" exists in the keys or values
            if (!Object.keys(SearchingForAliases).includes("@") && !Object.values(SearchingForAliases).includes("@")) {
              continue
            } else {
              foundAliases.push(SearchingForAliases); // Add to found aliases
            }
          }
        }
      }else{
        const ParsedContent = JSON.parse(readFile)

        for (const SearchKey of SearchKeys){
          const SearchingForAliases = ParsedContent[SearchKey]
          if(!SearchingForAliases) continue;
          foundAliases.push(SearchingForAliases)
        }
      }
    }catch (err){
      console.error('Error:', err)
    }
  }

  if (foundAliases.length === 0) return;

  const uniqueAliasesArray = [...new Set(foundAliases.map(JSON.stringify))].map(JSON.parse); 

  const uniqueAliasesObject = uniqueAliasesArray.reduce((acc, alias) => {
    return { ...acc, ...alias };
  }, {});

  addAliases(uniqueAliasesObject);
}

function customRequire(moduleName) {

  for (const [alias, modulePath] of Object.entries(ListOfPaths)) {
    if (alias === moduleName) {
      return require(path.resolve(__dirname, modulePath));
    }
  }

  return require(moduleName);
}


async function main(){
  try{
    await SearchForAliases()
    global.require = customRequire
  }catch(error){
    console.error('Error:', error.message)
  }
  
}


module.exports = main()
module.exports.addAlias = addAlias
module.exports.addAliases = addAliases
module.exports.reset = reset