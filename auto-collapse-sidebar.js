// TypingMind Auto-Collapse Sidebar Extension v1.0
// Author: Devlogy Team
(function() {
    'use strict';
    
    console.log('🔧 TypingMind Auto-Collapse Sidebar v1.0 chargée');
    
    // Configuration
    const CONFIG = {
        MAX_ATTEMPTS: 10,
        RETRY_DELAY: 500,
        INITIAL_DELAY: 1000,
        ANIMATION_DURATION: '0.3s'
    };
    
    // Fonction pour collapser la sidebar
    function collapseSidebar() {
        // Méthode 1: Bouton natif mobile
        const closeButton = document.querySelector('button[aria-label="Fermer la barre latérale"]');
        if (closeButton && window.innerWidth < 768) {
            console.log('✅ Collapse via bouton mobile');
            closeButton.click();
            return true;
        }
        
        // Méthode 2: Manipulation CSS pour desktop
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        if (navContainer) {
            console.log('✅ Collapse via CSS manipulation');
            
            // Variables CSS
            document.documentElement.style.setProperty('--current-sidebar-width', '0px');
            
            // Animation de la sidebar
            navContainer.style.transform = 'translateX(-384px)';
            navContainer.style.transition = `transform ${CONFIG.ANIMATION_DURATION} ease-in-out`;
            
            // Ajuster le contenu principal
            const mainContent = document.querySelector('[data-element-id="main-content-area"]');
            if (mainContent) {
                mainContent.style.paddingLeft = '0px';
                mainContent.style.transition = `padding-left ${CONFIG.ANIMATION_DURATION} ease-in-out`;
            }
            
            // Marquer comme collapsé
            navContainer.setAttribute('data-sidebar-collapsed', 'true');
            return true;
        }
        
        return false;
    }
    
    // Vérifier si déjà collapsé
    function isCollapsed() {
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        return navContainer && navContainer.getAttribute('data-sidebar-collapsed') === 'true';
    }
    
    // Fonction d'initialisation avec retry
    function initCollapse(attempts = 0) {
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
            console.log('❌ Auto-collapse échoué après', CONFIG.MAX_ATTEMPTS, 'tentatives');
            return;
        }
        
        // Vérifier que les éléments sont chargés
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        const sidebarBg = document.querySelector('[data-element-id="side-bar-background"]');
        
        if (navContainer && sidebarBg && !isCollapsed()) {
            console.log('🎯 Sidebar détectée, collapse en cours... (tentative', attempts + 1, ')');
            
            setTimeout(() => {
                if (collapseSidebar()) {
                    console.log('🎉 Sidebar auto-collapsée avec succès !');
                    
                    // Notification discrète à l'utilisateur
                    showNotification('✅ Sidebar auto-collapsée');
                } else {
                    setTimeout(() => initCollapse(attempts + 1), CONFIG.RETRY_DELAY);
                }
            }, 100);
        } else if (isCollapsed()) {
            console.log('ℹ️ Sidebar déjà collapsée');
        } else {
            setTimeout(() => initCollapse(attempts + 1), CONFIG.RETRY_DELAY);
        }
    }
    
    // Notification discrète
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Disparition automatique
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    // Observer pour les changements de page
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Vérifier si la sidebar a été restaurée
                const navContainer = document.querySelector('[data-element-id="nav-container"]');
                if (navContainer && !isCollapsed()) {
                    // Délai pour éviter les conflits
                    setTimeout(() => {
                        if (!isCollapsed()) {
                            console.log('🔄 Sidebar restaurée détectée, re-collapse...');
                            collapseSidebar();
                        }
                    }, 1000);
                }
            }
        });
    });
    
    // Démarrage
    function init() {
        console.log('🚀 Initialisation Auto-Collapse Sidebar...');
        
        // Observer le DOM
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Démarrer le collapse
        setTimeout(() => initCollapse(), CONFIG.INITIAL_DELAY);
    }
    
    // Point d'entrée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Exposer une fonction globale pour toggle manuel (bonus)
    window.toggleSidebarCollapse = function() {
        if (isCollapsed()) {
            // Restaurer
            const navContainer = document.querySelector('[data-element-id="nav-container"]');
            if (navContainer) {
                navContainer.style.transform = 'translateX(0px)';
                navContainer.removeAttribute('data-sidebar-collapsed');
                document.documentElement.style.setProperty('--current-sidebar-width', '384px');
                
                const mainContent = document.querySelector('[data-element-id="main-content-area"]');
                if (mainContent) {
                    mainContent.style.paddingLeft = '384px';
                }
                showNotification('↔️ Sidebar restaurée');
            }
        } else {
            // Collapser
            collapseSidebar();
        }
    };
    
    console.log('🎉 Auto-Collapse Sidebar Extension chargée ! Tapez toggleSidebarCollapse() dans la console pour un toggle manuel.');
})();
