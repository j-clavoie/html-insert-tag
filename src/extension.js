const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('html-insert-tag.insert', function(){
		insertTag()
	});
	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}




/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */
/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */
/* *#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#* */


async function insertTag() {
	const document_lang = vscode.window.activeTextEditor.document.languageId;
	if (document_lang != "html") {
		error("The file must be html file.");
		return;
	}

	// TODO: review and upgrade the Input box question

	const tag = await vscode.window.showInputBox();
	if (tag == null && tag.trim() != "") {
		error("No empty tags permited!");
		return;
	}

	let selection = vscode.window.activeTextEditor.selection;
	// TODO: review this section to be sure it javascript and nothing else to do before to process
	if (!selection.isEmpty) {
		vscode.window.activeTextEditor.edit(function (builder) {
			builder.replace(selection, getInsertText(vscode.window.activeTextEditor.document.getText(selection), tag));
			// TODO: set the cursor at the right place if it's a tag with something else to add like A, ABBR
		});
	}
	else {
		error("Your must select text to insert tag!");
		return;
	}
}
/* 
	 TODO: 
				 - select the first word as tag name
				 - following words should be CSS class not sure if . must be used before class
				 - 
 */
function getInsertText(selection, tag) {
	const regexPattern = /(\w+).([A-Za-z])\w+=["']([^"']*)["']/;
	if (regexPattern.test(tag)) {
		const t = tag.split(" ", 1);
		return "<" + tag + ">" + selection + "</" + t[0] + ">";
	} else {
		return "<" + tag + ">" + selection + "</" + tag + ">";
	}
}


// TODO: Upgrade the error message. Add option for Warning instead of all Error.
function error(text) {
	vscode.window.showErrorMessage(text);
}