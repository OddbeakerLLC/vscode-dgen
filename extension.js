const vscode = require('vscode');
const dgen = require('./dgen.js').dgen;

function activate(context) {
  let disposable = vscode.commands.registerCommand('dgen.selectionToModal', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const selectedText = editor.document.getText(editor.selection);

    const generatedCode = dgen.getCode(selectedText);

    editor.edit(editBuilder => {
      editBuilder.replace(editor.selection, generatedCode);
    }).then(() => {
      vscode.commands.executeCommand('editor.action.formatSelection');
    });
  });

  context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
