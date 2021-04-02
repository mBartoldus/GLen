# GLen

live demo: https://mbartoldus.github.io/GLen/

This is a long-ongoing project in which I've aimed to familiarize myself with webgl while abstracting away the parts I can't stand looking at.

The demo is currently pretty simple, you can drag-and-drop collada (.DAE) files into the GUI/drop-zone and they'll (hopefully) show up. The DAE parser was written before I knew much about XML and navigating DOM trees, so it's a mess to look at and I don't expect it to work all the time.

### future plans

Most of the following features are partially implemented in code but lack the interface. The big exception is pose data, I haven't given that a proper attempt yet.

* textures
* shapekeys
* uv keyframes
* armatures, poses
* a download-mesh button
* ability to import OBJ files
* Better options for working with the VAO
* documentation and sweeping up old messes
