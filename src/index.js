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
        }, () => {
            dropTarget.contentWindow.addEventListener('mouseup', evnt => {
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
            dropWinName = ocn.update(() => {
                return '';
            }),
            mouseisdown = () => {
                var mouseState = ocn.getItem(mousedown);
                
                return mouseState;
            },
            wasStock = (evnt) => {
                return evnt.srcElement &&
                    evnt.srcElement.classList.contains('stock');
            },
            dropCreate = nextDropWindow();

        function moveToMousePosition() {
            requestAnimationFrame(() => {
                fin.desktop.System.getMousePosition(function(loc) {
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
                    name,
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
                }, () => {
                    dropCreate.contentWindow.addEventListener('mouseup', evnt => {
                        console.log('uppers man, uppers');
                    });
                });

            ocn.update(dropWinName, () => {
                return name;
            });

            console.log('this was the updated name', ocn.getItem(dropWinName));
            return dropCreate;
        }

        ocn.subscribe('make-next', () => {
            console.log('make it ');
            dropCreate = nextDropWindow();
        });


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
                // ,
                // position: {
                //     left: 10,
                //     top: 25,
                //     duration: 500
                // }
            });

            console.log(ocn.getItem(dropWinName));

            var theWin = fin.desktop.Window.wrap('tearouts', ocn.getItem(dropWinName));

            theWin.moveTo(dx, dy, () => {
                theWin.animate({
                    opacity: {
                        opacity: 1,
                        duration: 500
                    }
                });
            }, () => {

            });
            ocn.dispatch('make-next');
        });

        ocn.subscribe('dragstart', (evnt) => {
            console.log(evnt);
            evnt.dataTransfer.setData('text/plain', evnt.srcElement.id);
            dropTarget.updateOptions({
                opacity: 0.5
            });

            moveToMousePosition();
        });

        ocn.subscribe('toggle-vis', id => {

        	var ele = document.getElementById(id);

        	ele.classList.toggle('hidden');
        });


        window.addEventListener('mousedown', (evnt) => {
            ocn.dispatch('mousedown', evnt);
        });

        window.addEventListener('mouseup', (evnt) => {});

        window.addEventListener('dragend', (evnt) => {
            ocn.dispatch('mouseup', evnt);
        });

        window.addEventListener('dragstart', (evnt) => {
            ocn.dispatch('dragstart', evnt);
        });

    });

});
