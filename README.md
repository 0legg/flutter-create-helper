# flutter-create-helper

Small helper to keep track of [Flutter Create](https://flutter.dev/create) requirements. Basically, it yells at you if your Dart code is more than 5KB.

## Features

Shows tiny image in status bar indicating amount of bytes your *.dart files are occupying. 

![thumbs up](images/thumbsup.png) Thumbs up if you fit into 5KB
![thumbs down](images/thumbsdown.png) Thumbs down otherwise. 

## Known Issues

Per official rules, unit test that are not executed are not counted towards limit. Honestly, I don't know any good reason not to delete it then. 

## Release Notes

### 1.0.0

Initial release
