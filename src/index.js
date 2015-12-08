/*
	src/index.js
 */
var app = angular.module('tearoutapp', []),
    ocn = ocean();

window.addEventListener('DOMContentLoaded', () => {
    fin.desktop.main(() => {

        var dropTarget = new fin.desktop.Window({
            url: 'views/drop.html',
            name: 'drop',
            autoShow: true,
            opacity: 0.5,
            frame: false,
            minWidth: 165,
            maxWidth: 165,
            minHeight: 165,
            maxHeight: 165,
            cornerRounding: {
                height: 3,
                width: 3
            }
        }, () => {
            dropTarget.contentWindow.addEventListener('mouseup', evnt => {
                console.log('uppers man, uppers');
            });
        });


        var dropCreate = new fin.desktop.Window({
            url: 'views/drop-to-create.html',
            name: 'drop-to-create',
            autoShow: true,
            opacity: 0.0,
            frame: false,
            defaultWidth: 165,
            defaultHeight: 165,
            cornerRounding: {
                height: 3,
                width: 3
            },
            saveWindowState: false
        }, () => {
            dropCreate.contentWindow.addEventListener('mouseup', evnt => {
                console.log('uppers man, uppers');
            });
        });



        var mousedown = ocn.update(() => {
                return false;
            }),
            offset = ocn.update(() => {
                return {
                    x: 0,
                    y: 0
                }
            }),
            mouseisdown = () => {
                var mouseState = ocn.getItem(mousedown);

                console.log('the mouse state', mouseState);
                return mouseState;
            },
            wasStock = (evnt) => {
                return evnt.srcElement &&
                    evnt.srcElement.classList.contains('stock');
            };

        function moveToMousePosition() {
            requestAnimationFrame(() => {
                fin.desktop.System.getMousePosition(function(loc) {
                    if (mouseisdown()) {
                        console.log('yeah i do');
                        var lastOffset = ocn.getItem(offset),
                            lx = lastOffset.x,
                            ly = lastOffset.y;

                        dropTarget.moveTo(loc.left - lx - 10, loc.top - ly - 10);
                        moveToMousePosition();
                    }
                });
            });
        };


        ocn.subscribe('mousedown', (evnt) => {
            ocn.update(mousedown, () => {
                return true;
            });

            ocn.update(offset, () => {
                return {
                    x: evnt.offsetX,
                    y: evnt.offsetY
                }
            });
        });

        ocn.subscribe('mouseup', (evnt) => {
            ocn.update(mousedown, () => {
                return false;
            });
        });

        ocn.subscribe('mouseup', (evnt) => {
            var lastOffset = ocn.getItem(offset),
                dx = evnt.screenX - lastOffset.x - 10,
                dy = evnt.screenY - lastOffset.y - 10;

            dropTarget.animate({
                opacity: {
                    opacity: 0.0,
                    duration: 500
                }
            });

            dropCreate.moveTo(dx, dy, () => {
                dropCreate.animate({
                    opacity: {
                        opacity: 1,
                        duration: 500
                    }
                });
            });
        });

        ocn.subscribe('dragstart', (evnt) => {
            console.log(evnt);
            dropTarget.updateOptions({
                opacity: 0.5
            })
            moveToMousePosition();
        });


        window.addEventListener('mousedown', (evnt) => {
            ocn.dispatch('mousedown', evnt);
        });

        window.addEventListener('mouseup', (evnt) => {});

        window.addEventListener('dragend', (evnt) => {
            //console.log('woah');
            ocn.dispatch('mouseup', evnt);
        });

        window.addEventListener('dragstart', (evnt) => {
            ocn.dispatch('dragstart', evnt);
        });

    });

});






// ./node_modules/ncp/bin/ncp src/vendor out/vendor; ./node_modules/ncp/bin/ncp src/index.html out/index.html
// 
// "build": "node ./node_modules/babel-cli/bin/babel.js --ignore src/vendor/  src --out-dir out; ./node_modules/ncp/bin/ncp src/vendor out/vendor; ./node_modules/ncp/bin/ncp src/index.html out/index.html; ./node_modules/ncp/bin/ncp app.json out/app.json; ./node_modules/ncp/bin/ncp src/css out/css; ./node_modules/ncp/bin/ncp src/views out/views"
// 
// // "build": "./node_modules/ncp/bin/ncp src/ out; node ./node_modules/babel-cli/bin/babel.js --ignore src/vendor/  src --out-dir out; "
