// Extension TypingMind : Auto-collapse Sidebar
(function() {
    'use strict';
    
    console.log('🔧 Extension TypingMind : Auto-collapse Sidebar chargée');
    
    // Fonction pour collapser la sidebar
    function collapseSidebar() {
        // Méthode 1: Chercher le bouton "Fermer la barre latérale"
        const closeButton = document.querySelector('button[aria-label="Fermer la barre latérale"]');
        if (closeButton) {
            console.log('✅ Bouton fermer trouvé (mobile)');
            closeButton.click();
            return true;
        }
        
        // Méthode 2: Modifier directement les variables CSS
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        if (navContainer) {
            console.log('✅ Container nav trouvé - Collapsing via CSS');
            
            // Masquer la sidebar en modifiant les variables CSS
            document.documentElement.style.setProperty('--current-sidebar-width', '0px');
            navContainer.style.transform = 'translateX(-100%)';
            navContainer.style.transition = 'transform 0.3s ease-in-out';
            
            // Ajuster le contenu principal
            const mainContent = document.querySelector('[data-element-id="main-content-area"]');
            if (mainContent) {
                mainContent.style.paddingLeft = '0px';
                mainContent.style.transition = 'padding-left 0.3s ease-in-out';
            }
            return true;
        }
        
        return false;
    }
    
    // Fonction d'initialisation avec retry
    function initCollapse(attempts = 0) {
        const maxAttempts = 10;
        
        if (attempts >= maxAttempts) {
            console.log('❌ Échec du collapse après', maxAttempts, 'tentatives');
            return;
        }
        
        // Vérifier que les éléments sont chargés
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        const sidebarBg = document.querySelector('[data-element-id="side-bar-background"]');
        
        if (navContainer && sidebarBg) {
            console.log('🎯 Éléments sidebar détectés, tentative de collapse...');
            
            setTimeout(() => {
                if (collapseSidebar()) {
                    console.log('🎉 Sidebar collapsée avec succès !');
                } else {
                    console.log('⚠️ Tentative', attempts + 1, 'échouée, retry...');
                    setTimeout(() => initCollapse(attempts + 1), 500);
                }
            }, 100);
        } else {
            console.log('⏳ Éléments non trouvés, retry...', attempts + 1);
            setTimeout(() => initCollapse(attempts + 1), 500);
        }
    }
    
    // Démarrage de l'extension
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initCollapse(), 1000);
        });
    } else {
        setTimeout(() => initCollapse(), 1000);
    }
    
    // Observer les changements de DOM pour réagir aux rechargements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const navContainer = document.querySelector('[data-element-id="nav-container"]');
                if (navContainer && navContainer.style.transform !== 'translateX(-100%)') {
                    // La sidebar a été restaurée, on la collapse à nouveau
                    setTimeout(() => collapseSidebar(), 500);
                }
            }
        });
    });
    
    // Observer le body pour les changements
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('🎉 Extension Auto-collapse Sidebar initialisée !');
})();
