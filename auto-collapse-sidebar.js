// TypingMind Auto-Collapse Sidebar Extension v3.0 - SOLUTION DÉFINITIVE
// Author: Devlogy Team - Problème classes CSS résolu
(function() {
    'use strict';
    
    console.log('🔧 TypingMind Auto-Collapse Sidebar v3.0 (SOLUTION DÉFINITIVE) chargée');
    
    const CONFIG = {
        MAX_ATTEMPTS: 10,
        RETRY_DELAY: 500,
        INITIAL_DELAY: 1000,
        NATIVE_HIDDEN_CLASS: 'translate-x-[-100%]',
        NATIVE_OPACITY_CLASS: 'opacity-0'
    };
    
    let isExtensionActive = true;
    let extensionCollapsed = false;
    
    // Fonction pour utiliser le système natif de TypingMind
    function collapseSidebarNative() {
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        if (!navContainer) return false;
        
        console.log('🎯 Collapse via système natif TypingMind');
        
        // Utiliser les classes CSS natives de TypingMind au lieu de styles inline
        navContainer.classList.add(CONFIG.NATIVE_HIDDEN_CLASS, CONFIG.NATIVE_OPACITY_CLASS);
        
        // Modifier la variable CSS comme TypingMind le fait
        document.documentElement.style.setProperty('--current-sidebar-width', '0px');
        
        // Ajuster le contenu principal avec les classes natives
        const mainContent = document.querySelector('[data-element-id="main-content-area"]');
        if (mainContent) {
            // Enlever la classe qui utilise la variable CSS et mettre padding 0
            mainContent.classList.remove('md:pl-[--current-sidebar-width]');
            mainContent.classList.add('pl-0');
        }
        
        extensionCollapsed = true;
        return true;
    }
    
    // Observer les changements de classes pour détecter quand TypingMind veut ouvrir
    function setupClassObserver() {
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        if (!navContainer) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const currentClasses = navContainer.className;
                    
                    // Détecter si TypingMind essaie de montrer la sidebar
                    if (extensionCollapsed && 
                        !currentClasses.includes(CONFIG.NATIVE_HIDDEN_CLASS) && 
                        !currentClasses.includes(CONFIG.NATIVE_OPACITY_CLASS)) {
                        
                        console.log('🔓 TypingMind veut ouvrir la sidebar - autorisation...');
                        
                        // Laisser TypingMind reprendre le contrôle
                        extensionCollapsed = false;
                        
                        // Nettoyer nos modifications
                        document.documentElement.style.removeProperty('--current-sidebar-width');
                        
                        // Restaurer les classes du main content
                        const mainContent = document.querySelector('[data-element-id="main-content-area"]');
                        if (mainContent) {
                            mainContent.classList.remove('pl-0');
                            mainContent.classList.add('md:pl-[--current-sidebar-width]');
                        }
                        
                        showNotification('↔️ Sidebar ouverte');
                        
                        // Désactiver temporairement l'extension
                        isExtensionActive = false;
                        setTimeout(() => {
                            isExtensionActive = true;
                            console.log('🔄 Extension réactivée');
                        }, 3000);
                    }
                }
            });
        });
        
        observer.observe(navContainer, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        console.log('👁️ Observer classes configuré');
    }
    
    // Fonction d'initialisation
    function initCollapse(attempts = 0) {
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
            console.log('❌ Auto-collapse échoué après', CONFIG.MAX_ATTEMPTS, 'tentatives');
            return;
        }
        
        if (!isExtensionActive) {
            console.log('⏸️ Extension temporairement désactivée');
            return;
        }
        
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        const sidebarBg = document.querySelector('[data-element-id="side-bar-background"]');
        
        if (navContainer && sidebarBg && !extensionCollapsed) {
            console.log('🎯 Sidebar détectée, collapse natif... (tentative', attempts + 1, ')');
            
            setTimeout(() => {
                if (collapseSidebarNative()) {
                    console.log('🎉 Sidebar auto-collapsée avec système natif !');
                    showNotification('✅ Sidebar auto-collapsée');
                    
                    // Configurer l'observer après le collapse
                    setTimeout(() => setupClassObserver(), 500);
                } else {
                    setTimeout(() => initCollapse(attempts + 1), CONFIG.RETRY_DELAY);
                }
            }, 100);
        } else if (extensionCollapsed) {
            console.log('ℹ️ Sidebar déjà collapsée par l\'extension');
            setupClassObserver(); // S'assurer que l'observer est actif
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
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    // Observer général pour les nouvelles pages
    function setupGeneralObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && isExtensionActive && !extensionCollapsed) {
                    const navContainer = document.querySelector('[data-element-id="nav-container"]');
                    if (navContainer) {
                        setTimeout(() => {
                            if (isExtensionActive && !extensionCollapsed) {
                                console.log('🔄 Nouvelle sidebar détectée, collapse...');
                                initCollapse();
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
    
    // Toggle manuel amélioré
    window.toggleSidebarCollapse = function() {
        const navContainer = document.querySelector('[data-element-id="nav-container"]');
        if (!navContainer) return;
        
        if (extensionCollapsed) {
            console.log('🔓 Toggle manuel - ouverture');
            
            // Simuler ce que fait TypingMind pour ouvrir
            navContainer.classList.remove(CONFIG.NATIVE_HIDDEN_CLASS, CONFIG.NATIVE_OPACITY_CLASS);
            extensionCollapsed = false;
            
            showNotification('↔️ Sidebar ouverte manuellement');
        } else {
            console.log('🔒 Toggle manuel - fermeture');
            collapseSidebarNative();
            setTimeout(() => setupClassObserver(), 500);
        }
    };
    
    // Point d'entrée principal
    function init() {
        console.log('🚀 Initialisation Auto-Collapse Sidebar v3.0...');
        
        setupGeneralObserver();
        setTimeout(() => initCollapse(), CONFIG.INITIAL_DELAY);
    }
    
    // Démarrage
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('🎉 Auto-Collapse Sidebar Extension v3.0 SOLUTION DÉFINITIVE chargée !');
    console.log('💡 Utilise le système natif TypingMind (classes CSS au lieu de styles inline)');
    console.log('🔧 Toggle manuel: toggleSidebarCollapse()');
})();
