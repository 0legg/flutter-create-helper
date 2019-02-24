import * as vscode from 'vscode';
import * as fs from 'fs';
import { promisify } from 'util';

const statAsync = promisify(fs.stat);

const MAX_SIZE = 5120; // 5 KB
let countStatusBarItem: vscode.StatusBarItem;
let sizeCache: Map<string, number> = new Map<string, number>();

export function activate(context: vscode.ExtensionContext) {
	countStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

	let watcher = vscode.workspace.createFileSystemWatcher("**/*.dart", false, false, false);
	watcher.onDidChange(onSave);
	watcher.onDidCreate(onSave);
	watcher.onDidDelete(onDelete);

	vscode.workspace.onDidChangeTextDocument(event => 
		updateSize(event.document.fileName, event.document.getText().length));

	context.subscriptions.push(watcher);
	countStatusBarItem.text = `$(megaphone) Dart files detected`;
	countStatusBarItem.show();

	countCharactersInitial();
}

export function deactivate() {
	countStatusBarItem.dispose();
}

function onSave(uri: vscode.Uri) {
	updatePath(uri.fsPath);
}

function onDelete(uri: vscode.Uri) {
	sizeCache.delete(uri.fsPath);
	updateBadge();
}

function countCharactersInitial(): void {
	vscode.workspace.findFiles("**/*.dart")
		.then(uris => {
			uris
				.map(uri => uri.fsPath)
				.forEach(updatePath);
		});
}

function updatePath(path: string) {
	statAsync(path)
		.then(stat => updateSize(path, stat.size))
		.catch(err => console.error(err));
}

function updateSize(path: string, size: number) {
	sizeCache.set(path, size);
	updateBadge();
}

function updateBadge() {
	let totalSize = 0;
	sizeCache.forEach(value => totalSize += value);
	let icon = totalSize > MAX_SIZE ? `$(thumbsdown)` : `$(thumbsup)`;
	countStatusBarItem.text = `${icon} ${totalSize}`;
	countStatusBarItem.show();
}
