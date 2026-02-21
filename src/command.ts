import * as vscode from "vscode";
import { dataPackVersions } from "./versions/dp_mapping";
import { resourcePackVersions } from "./versions/rp_mapping";

export function registerCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    "packformat-helper.updatePackFormat",
    async () => {
      // Step 1: select pack type
      const packType = await vscode.window.showQuickPick(
        ["Datapack", "Resourcepack"],
        { placeHolder: "Select the type of pack" },
      );
      if (!packType) {
        return;
      }

      // Step 2: select version from the corresponding map (newest first)
      const versionMap =
        packType === "Datapack" ? dataPackVersions : resourcePackVersions;
      const verStr = await vscode.window.showQuickPick(
        Object.keys(versionMap).reverse(),
        { placeHolder: "Select the Minecraft version" },
      );
      if (verStr === undefined) {
        return;
      }

      // Step 3: resolve numeric version
      const numericVersion = versionMap[verStr];
      const isArray = Array.isArray(numericVersion);

      // Step 4: replace only the format field(s) in the active editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const { document } = editor;
      const text = document.getText();
      const edit = new vscode.WorkspaceEdit();

      if (isArray) {
        const [maj, min] = numericVersion as number[];
        const formatted = `[${maj},${min}]`;

        // Case A: old-style pack_format → replace with min_format + max_format
        const pfMatch = /("pack_format"\s*:\s*)\d+/.exec(text);
        if (pfMatch) {
          // Detect indent of this line
          const lineStart = text.lastIndexOf("\n", pfMatch.index) + 1;
          const indent = text
            .slice(lineStart, pfMatch.index)
            .replace(/\S.*/, "");
          const start = document.positionAt(pfMatch.index);
          const end = document.positionAt(pfMatch.index + pfMatch[0].length);
          edit.replace(
            document.uri,
            new vscode.Range(start, end),
            `"min_format": ${formatted},\n${indent}"max_format": ${formatted}`,
          );
        } else {
          // Case B: already has min_format / max_format → update values only
          for (const key of ["min_format", "max_format"] as const) {
            const re = new RegExp(
              `("${key}"\\s*:\\s*)(\\d+|\\[\\s*\\d+\\s*,\\s*\\d+\\s*\\])`,
            );
            const m = re.exec(text);
            if (m) {
              const valStart = document.positionAt(m.index + m[1].length);
              const valEnd = document.positionAt(m.index + m[0].length);
              edit.replace(
                document.uri,
                new vscode.Range(valStart, valEnd),
                formatted,
              );
            }
          }
        }
      } else {
        const pfVal = String(numericVersion);

        // Case C: already has pack_format → update value only
        const pfMatch = /("pack_format"\s*:\s*)(\d+)/.exec(text);
        if (pfMatch) {
          const valStart = document.positionAt(
            pfMatch.index + pfMatch[1].length,
          );
          const valEnd = document.positionAt(pfMatch.index + pfMatch[0].length);
          edit.replace(document.uri, new vscode.Range(valStart, valEnd), pfVal);
        } else {
          // Case D: has min_format + max_format → collapse into pack_format
          const minMax =
            /"min_format"\s*:\s*(?:\d+|\[\s*\d+\s*,\s*\d+\s*\])\s*,?\s*\n\s*"max_format"\s*:\s*(?:\d+|\[\s*\d+\s*,\s*\d+\s*\])/.exec(
              text,
            );
          if (minMax) {
            const start = document.positionAt(minMax.index);
            const end = document.positionAt(minMax.index + minMax[0].length);
            edit.replace(
              document.uri,
              new vscode.Range(start, end),
              `"pack_format": ${pfVal}`,
            );
          }
        }
      }

      await vscode.workspace.applyEdit(edit);
    },
  );

  context.subscriptions.push(disposable);
}
