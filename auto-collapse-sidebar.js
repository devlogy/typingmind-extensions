// TypingMind Auto-Collapse Sidebar Extension v2.0 - FIXED
// Author: Devlogy Team - Problème de réouverture résolu
(function() {
    'use strict';
    
    console.log('🔧 TypingMind Auto-Collapse Sidebar v2.0 (FIXED) chargée');
    
    // Configuration
    const CONFIG = {
        MAX_ATTEMPTS: 10,
        RETRY_DELAY: 500,
        INITIAL_DELAY: 1000,
        ANIMATION_DURATION: '0.3s'
    };
    
    let isExtensionActive = true;
    
    // Fonction pour nettoyer nos styles inline et laisser TypingMind reprendre le contrôle
    function cleanupCustomStyles() {
        console.log('🧹 Nettoyage des styles personnalisés...');
        
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        const mainContent = document.querySelector('[data-element-id="main-content-area"]');
        
        if (navContainer) {
            // Supprimer nos styles inline
            navContainer.style.removeProperty('transform');
            navContainer.style.removeProperty('transition');
            navContainer.removeAttribute('data-sidebar-collapsed');
        }
        
        if (mainContent) {
            mainContent.style.removeProperty('padding-left');
            mainContent.style.removeProperty('transition');
        }
        
        // Restaurer la variable CSS originale
        document.documentElement.style.removeProperty('--current-sidebar-width');
    }
    
    // Fonction pour collapser la sidebar (améliorée)
    function collapseSidebar() {
        if (!isExtensionActive) return false;
        
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
    
    // Vérifier si déjà collapsé par notre extension
    function isCollapsedByExtension() {
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        return navContainer && navContainer.getAttribute('data-sidebar-collapsed') === 'true';
    }
    
    // Détecter si TypingMind veut ouvrir la sidebar
    function setupOpenSidebarListener() {
        // Écouter les clics sur le bouton "Ouvrir la barre latérale"
        document.addEventListener('click', function(event) {
            const button = event.target.closest('button[aria-label="Ouvrir la barre latérale"]');
            if (button && isCollapsedByExtension()) {
                console.log('🔓 Utilisateur veut ouvrir la sidebar - nettoyage des styles...');
                
                // Désactiver temporairement l'extension
                isExtensionActive = false;
                
                // Nettoyer nos styles pour laisser TypingMind reprendre le contrôle
                cleanupCustomStyles();
                
                // Réactiver l'extension après un délai
                setTimeout(() => {
                    isExtensionActive = true;
                    console.log('🔄 Extension réactivée');
                }, 2000);
                
                showNotification('↔️ Sidebar ouverte');
            }
        });
    }
    
    // Observer les changements de variables CSS de TypingMind
    function setupCSSVariableObserver() {
        const observer = new MutationObserver(() => {
            // Vérifier si --current-sidebar-width a changé
            const currentWidth = getComputedStyle(document.documentElement)
                .getPropertyValue('--current-sidebar-width').trim();
            
            // Si TypingMind a restauré la largeur et que notre extension n'est pas active
            if (currentWidth === '384px' && isCollapsedByExtension() && !isExtensionActive) {
                console.log('📏 Détection changement CSS - nettoyage...');
                cleanupCustomStyles();
            }
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    // Fonction d'initialisation avec retry
    function initCollapse(attempts = 0) {
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
            console.log('❌ Auto-collapse échoué après', CONFIG.MAX_ATTEMPTS, 'tentatives');
            return;
        }
        
        if (!isExtensionActive) {
            console.log('⏸️ Extension temporairement désactivée');
            return;
        }
        
        // Vérifier que les éléments sont chargés
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        const sidebarBg = document.querySelector('[data-element-id="side-bar-background"]');
        
        if (navContainer && sidebarBg && !isCollapsedByExtension()) {
            console.log('🎯 Sidebar détectée, collapse en cours... (tentative', attempts + 1, ')');
            
            setTimeout(() => {
                if (collapseSidebar()) {
                    console.log('🎉 Sidebar auto-collapsée avec succès !');
                    showNotification('✅ Sidebar auto-collapsée');
                } else {
                    setTimeout(() => initCollapse(attempts + 1), CONFIG.RETRY_DELAY);
                }
            }, 100);
        } else if (isCollapsedByExtension()) {
            console.log('ℹ️ Sidebar déjà collapsée par l\'extension');
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
    
    // Observer général pour les changements de page
    function setupGeneralObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && isExtensionActive) {
                    // Vérifier si une nouvelle sidebar a été créée (navigation)
                    const navContainer = document.querySelector('[data-element-id="nav-container"]');
                    if (navContainer && !isCollapsedByExtension()) {
                        // Délai pour éviter les conflits avec les animations de TypingMind
                        setTimeout(() => {
                            if (isExtensionActive && !isCollapsedByExtension()) {
                                console.log('🔄 Nouvelle sidebar détectée, collapse...');
                                collapseSidebar();
                            }
                        }, 1500);
                    }
                }
            });
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Fonction toggle manuelle améliorée
    window.toggleSidebarCollapse = function() {
        if (isCollapsedByExtension()) {
            console.log('🔓 Toggle manuel - ouverture');
            isExtensionActive = false;
            cleanupCustomStyles();
            showNotification('↔️ Sidebar ouverte manuellement');
            
            // Réactiver après délai
            setTimeout(() => {
                isExtensionActive = true;
            }, 2000);
        } else {
            console.log('🔒 Toggle manuel - fermeture');
            collapseSidebar();
        }
    };
    
    // Point d'entrée principal
    function init() {
        console.log('🚀 Initialisation Auto-Collapse Sidebar v2.0...');
        
        // Configuration des listeners
        setupOpenSidebarListener();
        setupCSSVariableObserver();
        setupGeneralObserver();
        
        // Démarrer le collapse initial
        setTimeout(() => initCollapse(), CONFIG.INITIAL_DELAY);
    }
    
    // Démarrage
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('🎉 Auto-Collapse Sidebar Extension v2.0 FIXED chargée !');
    console.log('💡 Tapez toggleSidebarCollapse() pour un toggle manuel.');
    console.log('🔧 La sidebar peut maintenant être rouverte normalement !');
})();

