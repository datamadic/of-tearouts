fin.desktop.main(() => {
    var name = document.querySelector('.name'),
        value = document.querySelector('.value'),
        close = document.querySelector('#close'),
        root = window.opener.window.angular.element(window.opener.document.querySelector('grid')).injector().get("$rootScope"),
        id, unsub;

    root.$on('nums-changed', () => {
        var numbers = window.opener.angular.element(window.opener.document.querySelector('.stock')).scope().numbers;

        requestAnimationFrame(() => {
            value.innerHTML = numbers[id] || '';
        });
    });

    close.addEventListener('click', () => {
    	
        if (unsub) {
            unsub();
        }

        window.opener.ocn.dispatch('toggle-vis', 'symb_'+id);
        
        fin.desktop.Window.getCurrent().close(true)

    });

    unsub = window.opener.ocn.subscribe('drop-init', (droppedId) => {
        console.log('BAM', droppedId, +(droppedId.split('_')[1]));
        var parsed = +(droppedId.split('_')[1]);
        id = parsed;
        name.innerHTML = parsed + 1;

        window.opener.ocn.dispatch('toggle-vis', droppedId);

        unsub();
    });

});
