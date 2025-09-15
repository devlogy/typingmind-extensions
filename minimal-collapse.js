// Version TEST minimale
(function() {
    console.log('TEST - Extension minimaliste chargée');
    
    function collapse() {
        const nav = document.querySelector('[data-element-id="nav-container"]');
        if (nav) {
            nav.classList.add('translate-x-[-100%]', 'opacity-0');
            document.documentElement.style.setProperty('--current-sidebar-width', '0px');
            console.log('Sidebar collapsée');
        }
    }
    
    setTimeout(collapse, 1000);
})();
