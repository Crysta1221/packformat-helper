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
2. Press `Ctrl+Shift+A` (or your configured shortcut).  
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

### 1.0.1
- Updated package.json

### 1.0.2
- Updated package.json

### 1.0.3
- Updated package.json
- Added icon.png

### 1.0.4
- Updated icon.png

### 1.0.5
- Added Version "26.1-snapshot-4"

### 1.0.6
- Added Version "26.1-snapshot-5"

### 1.0.7
- Added Version "26.1-snapshot-6"

### 1.0.8
- Partial correction to the README.md
- Ctrl+Alt+A → Ctrl+Shift+A

### 1.0.9
- Added Version "26.1-snapshot-7"

### 1.0.10
- Added Version "26.1-snapshot-8"


## More Information

- [Visual Studio Code Extensions Guide](https://code.visualstudio.com/api)

## Author
x (Twitter: [@ib_fjmy25](https://x.com/ib_fjmy25))  
