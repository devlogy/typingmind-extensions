// Version corrigée - Occupe l'espace libéré
(function() {
    console.log('🔧 Extension sidebar avec ajustement espace chargée');
    
    function collapse() {
        const nav = document.querySelector('[data-element-id="nav-container"]');
        const mainContent = document.querySelector('[data-element-id="main-content-area"]');
        
        if (nav) {
            // Cacher la sidebar
            nav.classList.add('translate-x-[-100%]', 'opacity-0');
            document.documentElement.style.setProperty('--current-sidebar-width', '0px');
            
            // Ajuster le contenu principal pour occuper tout l'espace
            if (mainContent) {
                mainContent.classList.remove('md:pl-[--current-sidebar-width]');
                mainContent.classList.add('pl-0');
            }
            
            console.log('✅ Sidebar collapsée et espace récupéré');
        }
    }
    
    // Observer pour restaurer l'espace quand la sidebar réapparaît
    function setupRestoreObserver() {
        const nav = document.querySelector('[data-element-id="nav-container"]');
        if (!nav) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isHidden = nav.classList.contains('translate-x-[-100%]');
                    const mainContent = document.querySelector('[data-element-id="main-content-area"]');
                    
                    if (!isHidden && mainContent) {
                        // Sidebar réapparue - restaurer l'espace
                        mainContent.classList.remove('pl-0');
                        mainContent.classList.add('md:pl-[--current-sidebar-width]');
                        document.documentElement.style.setProperty('--current-sidebar-width', '384px');
                        console.log('🔄 Espace sidebar restauré');
                    }
                }
            });
        });
        
        observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Démarrage
    setTimeout(() => {
        collapse();
        setupRestoreObserver();
    }, 1000);
})();
