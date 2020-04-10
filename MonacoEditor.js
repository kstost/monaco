//---------------------------------------------------------
(function () {
    var root = this;
    var MonacoEditor = function (opt) {
        var pointer = this;
        for (var key in opt) { pointer[key] = opt[key]; }
        if (!MonacoEditor.load_log) { MonacoEditor.load_log = {}; }
        function script_loader(src) {
            return new Promise((resolve, reject) => {
                if (!MonacoEditor.load_log[src]) {
                    let script = document.createElement('script');
                    script.onload = () => {
                        MonacoEditor.load_log[src] = true;
                        resolve();
                    };
                    script.onerror = () => {
                        reject(src + ' : failed to load')
                    };
                    document.head.appendChild(script);
                    script.src = src;
                } else {
                    resolve();
                }
            });
        }
        (async () => {
            try {
                await script_loader('https://cdn.jsdelivr.net/gh/kstost/monaco/loader.js');
                await script_loader('https://cdn.jsdelivr.net/gh/kstost/ShortCutManager/ShortCutManager.js');
                await new Promise((resolve, reject) => {
                    let src = 'https://cdn.jsdelivr.net/gh/kstost/monaco/min/';
                    if (!MonacoEditor.load_log[src]) {
                        require.config({ paths: { 'vs': src + 'vs' } });
                        require(["vs/editor/editor.main"], function () {
                            MonacoEditor.load_log[src] = true;
                            resolve();
                        }, function (e) {
                            reject(src + ' : failed to load');
                        });
                    } else { resolve(); }
                });
                opt.option.value = opt.code ? opt.code : '';
                let editor = monaco.editor.create(opt.container, opt.option);
                pointer.body = editor;
                opt.key_bind(monaco, editor);
                editor.onDidBlurEditorText(function () {
                    opt.event && opt.event.blur && opt.event.blur();
                });
                editor.onDidFocusEditorText(function () {
                    opt.event && opt.event.focus && opt.event.focus();
                });
                editor.onDidChangeModelContent(function () {
                    opt.event && opt.event.change && opt.event.change();
                });
                editor.onKeyUp(function (e) {
                    let pos = pointer.body.cursor.getPosition();
                    opt.event && opt.event.key_position && opt.event.key_position(pos);
                });
                if (false) {
                    editor.setPosition(posis);
                    pointer.body.revealLineInCenter(posis.lineNumber);
                }
                pointer.body.focus();
                opt.event && opt.event.focus && opt.event.create_complete();
            } catch (e) {
                console.log(e);
            }
        })();
    };
    MonacoEditor.prototype = {
        dispose: function () {
            this.body.dispose();
        }
    };
    root.MonacoEditor = MonacoEditor;
    root.MonacoEditor.CONST_VALUE = 'hello world';
}).call(this);
//---------------------------------------------------------
