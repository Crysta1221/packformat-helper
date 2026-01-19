# packformat-helper

A VS Code extension to help update Minecraft `pack.mcmeta` files for Data Packs and Resource Packs.

## Features

- Automatically validates your input for Minecraft versions (e.g., `D1.21.4`, `R1.21.1`, `D24w12a`).
- Converts versions to numeric or array formats (`[94,0]`) for Minecraft 1.21.9+ compatibility.
- Supports snapshots and pre-release versions.
- Works on all open `.mcmeta` files directly from the editor.

## Requirements

- Visual Studio Code 1.70+  
- No additional dependencies

## How to Use

1. Open a `pack.mcmeta` file in VS Code.  
2. Press `Ctrl+Alt+A` (or your configured shortcut).  
3. Enter the Minecraft version (e.g., `D1.21.4`, `R1.21.1`, `D24w12a`).  
4. The extension automatically updates the file with the correct format.

## Extension Settings

This extension does not add any additional settings.

## Known Issues

- Only works for `pack.mcmeta` files currently.
- Version must exist in the conversion list (`D` and `R` lists).

## Release Notes

### 1.0.0
- Initial release of `packformat-helper`.


## More Information

- [Visual Studio Code Extensions Guide](https://code.visualstudio.com/api)

## Author
x (Twitter: [@ib_fjmy25](https://x.com/ib_fjmy25))  
