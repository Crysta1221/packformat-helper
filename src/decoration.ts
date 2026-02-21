import * as vscode from "vscode";
import { dataPackVersions } from "./versions/dp_mapping";
import { resourcePackVersions } from "./versions/rp_mapping";

type VersionMap = Record<string, number | number[]>;

// Build a reverse map: format key -> list of version names
function buildReverseMap(mapping: VersionMap): Map<string, string[]> {
  const result = new Map<string, string[]>();
  for (const [version, fmt] of Object.entries(mapping)) {
    const key = JSON.stringify(fmt);
    const existing = result.get(key) ?? [];
    existing.push(version);
    result.set(key, existing);
  }
  return result;
}

// Prefer stable releases (e.g. 1.21.4); fall back to snapshots, capped at 3
function makeLabel(versions: string[]): string {
  const stable = versions.filter((v) => /^\d+\.\d+(\.\d+)?$/.test(v));
  const display = stable.length > 0 ? stable : versions.slice(0, 3);
  const extra = versions.length - display.length;
  return display.join(", ") + (extra > 0 ? ` … (+${extra})` : "");
}

export function registerDecorations(context: vscode.ExtensionContext): void {
  const dpReverseMap = buildReverseMap(dataPackVersions);
  const rpReverseMap = buildReverseMap(resourcePackVersions);

  const foundDecoration = vscode.window.createTextEditorDecorationType({
    after: {
      color: new vscode.ThemeColor("charts.green"),
      backgroundColor: new vscode.ThemeColor("editorInlayHint.background"),
      margin: "0 0 0 1em",
      fontStyle: "normal",
    },
  });

  const notFoundDecoration = vscode.window.createTextEditorDecorationType({
    after: {
      color: new vscode.ThemeColor("errorForeground"),
      margin: "0 0 0 1em",
      fontStyle: "normal",
    },
  });

  function update(editor: vscode.TextEditor): void {
    if (!editor.document.fileName.replace(/\\/g, "/").endsWith("pack.mcmeta")) {
      editor.setDecorations(foundDecoration, []);
      editor.setDecorations(notFoundDecoration, []);
      return;
    }

    const text = editor.document.getText();
    const foundOpts: vscode.DecorationOptions[] = [];
    const notFoundOpts: vscode.DecorationOptions[] = [];

    const regex =
      /"(pack_format|min_format|max_format)"\s*:\s*(\d+|\[\s*\d+\s*,\s*\d+\s*\])/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const raw = match[2].replace(/\s/g, "");
      const key = raw.startsWith("[")
        ? JSON.stringify(raw.slice(1, -1).split(",").map(Number))
        : String(Number(raw));

      const dpVersions = dpReverseMap.get(key) ?? [];
      const rpVersions = rpReverseMap.get(key) ?? [];

      const lineEnd = editor.document.lineAt(
        editor.document.positionAt(match.index + match[0].length).line,
      ).range.end;
      const range = new vscode.Range(lineEnd, lineEnd);

      if (dpVersions.length === 0 && rpVersions.length === 0) {
        notFoundOpts.push({
          range,
          renderOptions: {
            after: { contentText: "  ❌  Unknown package format" },
          },
        });
      } else {
        const parts: string[] = [];
        if (dpVersions.length > 0) {
          parts.push(`DP: ${makeLabel(dpVersions)}`);
        }
        if (rpVersions.length > 0) {
          parts.push(`RP: ${makeLabel(rpVersions)}`);
        }
        foundOpts.push({
          range,
          renderOptions: {
            after: { contentText: `  ✅  ${parts.join("   ")}` },
          },
        });
      }
    }

    editor.setDecorations(foundDecoration, foundOpts);
    editor.setDecorations(notFoundDecoration, notFoundOpts);
  }

  if (vscode.window.activeTextEditor) {
    update(vscode.window.activeTextEditor);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        update(editor);
      }
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && event.document === editor.document) {
        update(editor);
      }
    }),
  );
}
