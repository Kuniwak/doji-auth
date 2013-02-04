同時押し暗証番号認証 (Simultaneous Inputable Authentication) ver.3
==================================================================

デモ用に改良した同時押し認証です。

ファイル構成
------------
* index.html 認証画面
* test_all.html ユニットテストファイル
* js/ JavaScript ファイルディレクトリ
 * sia.min.js 圧縮済みスクリプトファイル
 * deps.js 依存定義スクリプトファイル
 * sia/ 認証モジュールディレクトリ
* css/ CSS ファイルディレクトリ
* doc/ ドキュメントディレクトリ
 * index.html ドキュメントファイル（英語）
* img/ 画像ディレクトリ

* update_css.rb CSSをコンパイルする（Closure Stylesheets のパスは適宜変更してください）
* update_dep.rb 依存関係定義を更新する（Closure Library のパスは適宜変更してください）
* compile_ADVANCED.rb スクリプトをコンパイルする（Closure Compiler のパスは適宜変更してください）
* .git/ バージョン管理用ディレクトリ
* .gitignore バージョン管理用ファイル

操作方法
--------

### 設定前画面（鍵マーク）
Set an authenticate （初回は Try）ボタンを押す。

### 秘密情報設定（入力画面）
設定する秘密情報を入力する。

### 秘密情報確認（南京錠マーク）
入力した秘密情報を確認する。
Authenticate ボタンを押す。

### 認証（入力画面）
認証にかける秘密情報を入力する。

### 結果確認（青：成功、赤：失敗）
結果を確認する。
OK ボタンを押す。


変更点
------
* 実験用動作からデモ動作に変更
 * 秘密情報設定モードと認証モードの2つを繰り返すように変更
* UXを改善
 * バックスペースボタンが押されたとき、同時に数字・抽象シンボルボタン（S, M, L）を押せないように変更
 * 数字・抽象シンボルボタン（S, M, L）が押されたとき、同時にバックスペースボタンを押せないように変更
* LOG の Webを介した送信機能の代わりとして、Safari 6 の Web インスペクタをつかう使用に変更（Mac OSX 10.7以降が必要）
 * 前のは通信障害によってログが欠損することがあった（LogServer、LocalStorage、Mailという 3 重の冗長性を持たしていたのに！）
* クラス構造を見直すためにフルスクラッチ
 * 動作速度改善＆実装の効率化のために [jQuery](http://jquery.com/) → [Closure Library](https://developers.google.com/closure/library/) へと変更
 * コンパイラを [JSMIN](http://www.crockford.com/javascript/jsmin.html) → [Closure Compiler](https://developers.google.com/closure/compiler/?hl=ja) へと変更
 * CSS コンパイラに [Closure Stylesheets](http://code.google.com/p/closure-stylesheets/) を使用
* 不親切だったログを見やすく改良
* 不親切だった仕様書を見やすく改良


参考
----
* [Closure Library API Document](http://closure-library.googlecode.com/svn/docs/index.html)
* [Google API Expertが解説する Closure Libraryプログラミングガイド](http://www.amazon.co.jp/Google-API-Expert%E3%81%8C%E8%A7%A3%E8%AA%AC%E3%81%99%E3%82%8B-Closure-Library%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E3%82%AC%E3%82%A4%E3%83%89/dp/4844329626)
* [Closure Library 日本語 Jsdoc](https://github.com/OrgaChem/google-closure-library)
* [Closure Library で HTML から UI を生成する](http://webos-goodies.jp/archives/building_ui_from_html_using_closure_library.html)
* [The Closure UI Framework: An Introduction to Components](http://code.google.com/p/closure-library/wiki/IntroToComponents)
* [The Closure UI Framework: An Introduction to Controls](http://code.google.com/p/closure-library/wiki/IntroToControls)
* [Closure Compilerを使う！](http://www37.atwiki.jp/aias-closurecompiler/)
* [Closure Stylesheets で CSS を最適化する (1)](http://webos-goodies.jp/archives/how_to_use_closure_stylesheets_part_1.html)
* [iOS6のリモートWebインスペクタ - to-R](http://blog.webcreativepark.net/2012/09/21-110644.html)
* [タッチデバイスを指で快適に操作させるために (1/2)](http://www.atmarkit.co.jp/ait/articles/1210/24/news023.html)
* [jsdoc-toolkit](http://code.google.com/p/jsdoc-toolkit/)
* [JsDoc Toolkitを使う！](http://www12.atwiki.jp/aias-jsdoctoolkit/)
* [Annotating JavaScript for the Closure Compiler](https://developers.google.com/closure/compiler/docs/js-for-compiler)
* [同時押し認証: 暗証番号認証の改善を目指した一つの試み](http://www.dicomo.org/2012/program/1F_abst.html#1F-4)

連絡先
------
電気通信大学大学院 情報システム学研究科 社会知能情報学専攻

田中研究室 修士課程

[国分 佑樹（Yuki Kokubun）](mailto:kokubun@tanaka.is.uec.ac.jp)
