# XeinMod Module Alias

**XeinMod Module Alias** is a custom module alias package for Node.js that works seamlessly with both **ESM (ECMAScript Modules)** and **CJS (CommonJS)** formats. It allows you to define and resolve module aliases for cleaner, more maintainable code without the limitations of the existing `module-alias` package.

## Features

- **Supports both ESM and CJS**: Works with both `import` and `require` in Node.js projects.
- **Simple configuration**: Define your aliases in a simple configuration file (`module-alias.config.js` or `.module-alias.json`).
- **Flexible path resolution**: Supports relative and absolute paths, making it easy to set up aliases across various project structures.
- **Lightweight**: A minimal and efficient solution with no unnecessary dependencies.

## Installation

To install `xeinmod/module-alias`, use npm or yarn:

```bash
npm install xeinmod/module-alias
or
yarn add xeinmod/module-alias
```
## Configuration
You can configure your module aliases using a simple configuration file. Create a module-alias.config.js or .module-alias.json file at the root of your project.

### Example Configuration (module-alias.config.js)
```js
module.exports = {
  "aliases": {
    "@utils": "./src/utils",
    "@models": "./src/models",
    "@controllers": "./src/controllers"
  }
};
```
### Example Configuration (.module-alias.json)
```json
{
  "aliases": {
    "@utils": "./src/utils",
    "@models": "./src/models",
    "@controllers": "./src/controllers"
  }
}
```
## Usage
Once the package is installed and configured, you can start using the aliases in your code.

### Example (ESM)
```js
import { myFunction } from '@utils/myFunction.js';
```
### Example (CJS)
```js
const { myFunction } = require('@utils/myFunction.js');
```
### Automatically Resolve Aliases
To enable the alias resolution in your project, you can import the alias resolver in your entry file (e.g., index.js or app.js):
```js
require('xeinmod/module-alias/register');
```
This will ensure that the module aliases are automatically resolved when your project starts.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing
Contributions are welcome! If you have any issues, please feel free to open an issue on the GitHub repository.

## Support
If you encounter any problems or need help using the package, open an issue in the GitHub repository.

## Authors
Xeinostorm - Project Lead, Developer


### Key Sections:
- **Title & Description**: Clear overview of what the project is.
- **Features**: Highlight the main features and benefits.
- **Installation**: Guide on how to install the package using npm or yarn.
- **Configuration**: Show how users can set up and configure aliases.
- **Usage**: Examples for how to use the module aliases in both ESM and CJS.
- **License**: Information about the project's license (MIT in this case).
- **Contributing**: Invitation for others to contribute or report issues.
- **Support**: Where users can go for help or support.
- **Authors**: Credit to the project author(s).