window.addEventListener('DOMContentLoaded', () => {
    console.log(window.opener.document.querySelector('grid'), window.opener.angular.element(window.opener.document.querySelector('grid')).scope());
});

