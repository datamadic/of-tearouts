'use strict';

/*
	src/index.js
 */
var app = angular.module('tearoutapp', []),
    ocn = ocean();

window.addEventListener('DOMContentLoaded', function () {
    fin.desktop.main(function () {

        var dropTarget = new fin.desktop.Window({
            url: 'views/drop.html',
            name: 'drop',
            autoShow: true,
            opacity: 0.0,
            frame: false,
            minWidth: 165,
            maxWidth: 165,
            minHeight: 165,
            maxHeight: 165,
            cornerRounding: {
                height: 3,
                width: 3
            }
        }, function () {
            dropTarget.contentWindow.addEventListener('mouseup', function (evnt) {
                console.log('uppers man, uppers');
            });
        });

        var mousedown = ocn.update(function () {
            return false;
        }),
            offset = ocn.update(function () {
            return {
                x: 0,
                y: 0
            };
        }),
            dropWinName = ocn.update(function () {
            return '';
        }),
            mouseisdown = function mouseisdown() {
            var mouseState = ocn.getItem(mousedown);

            //console.log('the mouse state', mouseState);
            return mouseState;
        },
            wasStock = function wasStock(evnt) {
            return evnt.srcElement && evnt.srcElement.classList.contains('stock');
        },
            dropCreate = nextDropWindow();

        function moveToMousePosition() {
            requestAnimationFrame(function () {
                fin.desktop.System.getMousePosition(function (loc) {
                    if (mouseisdown()) {
                        //console.log('yeah i do');
                        var lastOffset = ocn.getItem(offset),
                            lx = lastOffset.x,
                            ly = lastOffset.y;

                        dropTarget.moveTo(loc.left - lx - 10, loc.top - ly - 10);
                        moveToMousePosition();
                    }
                });
            });
        };

        function nextDropWindow() {
            var name = 'drop-to-create' + Math.random(),
                dropCreate = new fin.desktop.Window({
                url: 'views/drop-to-create.html',
                name: name,
                autoShow: true,
                opacity: 0.0,
                frame: false,
                defaultWidth: 165,
                defaultHeight: 165,
                cornerRounding: {
                    height: 3,
                    width: 3
                },
                maximizable: false,
                saveWindowState: false
            }, function () {
                dropCreate.contentWindow.addEventListener('mouseup', function (evnt) {
                    console.log('uppers man, uppers');
                });
            });

            ocn.update(dropWinName, function () {
                return name;
            });

            console.log('this was the updated name', ocn.getItem(dropWinName));
            return dropCreate;
        }

        ocn.subscribe('make-next', function () {
            console.log('make it ');
            dropCreate = nextDropWindow();
        });

        ocn.subscribe('mousedown', function (evnt) {
            ocn.update(mousedown, function () {
                return true;
            });

            ocn.update(offset, function () {
                return {
                    x: evnt.offsetX,
                    y: evnt.offsetY
                };
            });
        });

        ocn.subscribe('mouseup', function (evnt) {
            ocn.update(mousedown, function () {
                return false;
            });
        });

        ocn.subscribe('mouseup', function (evnt) {
            var lastOffset = ocn.getItem(offset),
                dx = evnt.screenX - lastOffset.x - 10,
                dy = evnt.screenY - lastOffset.y - 10;

            dropTarget.animate({
                opacity: {
                    opacity: 0.0,
                    duration: 500
                }
                // ,
                // position: {
                //     left: 10,
                //     top: 25,
                //     duration: 500
                // }
            });

            console.log(ocn.getItem(dropWinName));

            var theWin = fin.desktop.Window.wrap('tearouts', ocn.getItem(dropWinName));

            theWin.moveTo(dx, dy, function () {
                theWin.animate({
                    opacity: {
                        opacity: 1,
                        duration: 500
                    }
                });
            }, function () {});
            ocn.dispatch('make-next');
        });

        ocn.subscribe('dragstart', function (evnt) {
            console.log(evnt);
            evnt.dataTransfer.setData('text/plain', evnt.srcElement.id);
            dropTarget.updateOptions({
                opacity: 0.5
            });

            moveToMousePosition();
        });

        ocn.subscribe('toggle-vis', function (id) {
            console.log(id, document.getElementById(id));

            var ele = document.getElementById(id);

            ele.classList.toggle('hidden');
        });

        window.addEventListener('mousedown', function (evnt) {
            ocn.dispatch('mousedown', evnt);
        });

        window.addEventListener('mouseup', function (evnt) {});

        window.addEventListener('dragend', function (evnt) {
            ocn.dispatch('mouseup', evnt);
        });

        window.addEventListener('dragstart', function (evnt) {
            ocn.dispatch('dragstart', evnt);
        });
    });
});

// ./node_modules/ncp/bin/ncp src/vendor out/vendor; ./node_modules/ncp/bin/ncp src/index.html out/index.html
//
// "build": "node ./node_modules/babel-cli/bin/babel.js --ignore src/vendor/  src --out-dir out; ./node_modules/ncp/bin/ncp src/vendor out/vendor; ./node_modules/ncp/bin/ncp src/index.html out/index.html; ./node_modules/ncp/bin/ncp app.json out/app.json; ./node_modules/ncp/bin/ncp src/css out/css; ./node_modules/ncp/bin/ncp src/views out/views"
//
// // "build": "./node_modules/ncp/bin/ncp src/ out; node ./node_modules/babel-cli/bin/babel.js --ignore src/vendor/  src --out-dir out; "