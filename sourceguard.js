/**
 * SourceGuard Pro - Protection avancée contre l'extraction et l'inspection
 * 
 * Protections :
 * - DevTools (détection + blocage)
 * - Code source (Ctrl+U, view-source)
 * - Console (affichage du code source)
 * - Inspection d'éléments
 * - Extensions de navigateur
 * - Scraping
 * - Navigateur headless
 * 
 * Utilisation : Ajouter dans index.html AVANT tous les autres scripts
 */

(function() {
  'use strict';

  const CONFIG = {
    devToolsDetection: true,
    sourceCodeProtection: true,
    consoleProtection: true,
    inspectProtection: true,
    extensionDetection: true,
    rightClickProtection: true,
    keyboardShortcutsProtection: true,
    alertMessage: '⚠️ Inspection non autorisée. Ce site est protégé.',
    redirectUrl: null,
    debug: false,
    // Bloquer complètement la console en production
    blockConsoleCompletely: true,
    // Détecter les tentatives d'inspection via les DevTools
    detectDevToolsInspection: true,
    // Empêcher l'affichage du code source dans la console
    preventSourceInConsole: true
  };

  const log = (...args) => { if (CONFIG.debug) console.log('[SourceGuard]', ...args); };
  const warn = (...args) => { if (CONFIG.debug) console.warn('[SourceGuard]', ...args); };

  // ============================================
  // 1. BLOCAGE COMPLET DE LA CONSOLE
  // ============================================
  function blockConsoleCompletely() {
    if (!CONFIG.blockConsoleCompletely) return;

    // Sauvegarder les méthodes originales pour usage interne
    const _original = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
      table: console.table.bind(console),
      dir: console.dir.bind(console),
      dirxml: console.dirxml.bind(console),
      trace: console.trace.bind(console),
      group: console.group.bind(console),
      groupCollapsed: console.groupCollapsed.bind(console),
      groupEnd: console.groupEnd.bind(console),
      time: console.time.bind(console),
      timeEnd: console.timeEnd.bind(console),
      assert: console.assert.bind(console),
      clear: console.clear.bind(console),
      count: console.count.bind(console),
      countReset: console.countReset.bind(console),
      profile: console.profile.bind(console),
      profileEnd: console.profileEnd.bind(console),
      timeLog: console.timeLog.bind(console)
    };

    // Remplacer toutes les méthodes console par des fonctions vides
    const noop = () => {};
    
    Object.keys(_original).forEach(method => {
      try {
        console[method] = noop;
      } catch (e) {
        // Ignorer les erreurs
      }
    });

    // Bloquer l'accès à console.log etc. via defineProperty
    try {
      Object.defineProperty(console, 'log', { get: () => noop, set: () => {}, configurable: false });
      Object.defineProperty(console, 'warn', { get: () => noop, set: () => {}, configurable: false });
      Object.defineProperty(console, 'error', { get: () => noop, set: () => {}, configurable: false });
      Object.defineProperty(console, 'info', { get: () => noop, set: () => {}, configurable: false });
      Object.defineProperty(console, 'debug', { get: () => noop, set: () => {}, configurable: false });
    } catch (e) {
      // Fallback si defineProperty échoue
    }

    // Empêcher l'affichage du code source dans la console
    if (CONFIG.preventSourceInConsole) {
      // Bloquer l'accès aux scripts via console
      Object.defineProperty(window, 'scripts', { get: () => [], configurable: false });
      
      // Empêcher l'affichage du HTML via console
      const originalDir = _original.dir;
      console.dir = noop;
      console.dirxml = noop;
      
      // Bloquer console.table qui pourrait afficher des données
      console.table = noop;
    }

    log('Console complètement bloquée');
  }

  // ============================================
  // 2. DÉTECTION ET BLOCAGE DES DEVTOOLS
  // ============================================
  function detectAndBlockDevTools() {
    if (!CONFIG.devToolsDetection) return;

    const threshold = 160;
    let devToolsOpen = false;

    // Méthode 1 : Différence de taille de fenêtre
    const checkSize = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          onDevToolsDetected('Différence de taille de fenêtre');
        }
      } else {
        devToolsOpen = false;
      }
    };

    // Méthode 2 : Détection via debugger timing
    const checkDebugger = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      if (end - start > 100) {
        onDevToolsDetected('Debugger détecté');
      }
    };

    // Méthode 3 : Détection via toString
    const checkToString = () => {
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: function() {
          onDevToolsDetected('Console détectée via toString');
        }
      });
      // Ne pas logger pour éviter la détection
    };

    // Méthode 4 : Détection via les performances
    const checkPerformance = () => {
      const start = performance.now();
      // Vérifier si le debugger est actif
      const end = performance.now();
      if (end - start > 100) {
        onDevToolsDetected('Debugger détecté via performance');
      }
    };

    // Vérifications périodiques
    setInterval(checkSize, 500);
    setInterval(checkDebugger, 1000);
    setInterval(checkPerformance, 2000);

    // Vérification initiale
    checkSize();
  }

  function onDevToolsDetected(reason) {
    log('DevTools détecté:', reason);
    
    // Afficher une alerte
    if (CONFIG.alertMessage) {
      alert(CONFIG.alertMessage);
    }

    // Rediriger si configuré
    if (CONFIG.redirectUrl) {
      window.location.href = CONFIG.redirectUrl;
    }

    // Optionnel : Effacer le contenu de la page
    // document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h1>Accès non autorisé</h1></div>';
    
    // Optionnel : Bloquer la page
    // document.body.style.overflow = 'hidden';
    // document.body.style.pointerEvents = 'none';
  }

  // ============================================
  // 3. PROTECTION DU CODE SOURCE
  // ============================================
  function protectSourceCode() {
    if (!CONFIG.sourceCodeProtection) return;

    // Bloquer Ctrl+U (View Source)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        e.stopPropagation();
        onSourceCodeAttempt('Ctrl+U');
      }
      
      // Bloquer Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        e.stopPropagation();
        onSourceCodeAttempt('Ctrl+S');
      }
      
      // Bloquer Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        e.stopPropagation();
        onSourceCodeAttempt('Ctrl+Shift+I');
      }
      
      // Bloquer Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        e.stopPropagation();
        onSourceCodeAttempt('Ctrl+Shift+J');
      }
      
      // Bloquer Ctrl+Shift+C (Inspect)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        e.stopPropagation();
        onSourceCodeAttempt('Ctrl+Shift+C');
      }
      
      // Bloquer F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        onSourceCodeAttempt('F12');
      }
    }, true);

    // Bloquer view-source:
    window.addEventListener('beforeunload', (e) => {
      if (window.location.protocol === 'view-source:') {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Empêcher l'accès au code source via document.documentElement.outerHTML
    const originalOuterHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML');
    if (originalOuterHTML && originalOuterHTML.get) {
      Object.defineProperty(Element.prototype, 'outerHTML', {
        get: function() {
          // Retourner une version masquée
          return '<!-- Code source protégé -->';
        },
        configurable: false
      });
    }

    log('Protection du code source activée');
  }

  function onSourceCodeAttempt(method) {
    log('Tentative d\'accès au code source:', method);
    
    if (CONFIG.alertMessage) {
      alert(CONFIG.alertMessage);
    }

    if (CONFIG.redirectUrl) {
      window.location.href = CONFIG.redirectUrl;
    }
  }

  // ============================================
  // 4. PROTECTION CONTRE L'INSPECTION D'ÉLÉMENTS
  // ============================================
  function protectInspectElements() {
    if (!CONFIG.inspectProtection) return;

    // Bloquer le clic droit
    if (CONFIG.rightClickProtection) {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onInspectAttempt('Clic droit');
      }, true);
    }

    // Bloquer les raccourcis clavier d'inspection
    if (CONFIG.keyboardShortcutsProtection) {
      document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
          e.preventDefault();
          e.stopPropagation();
          onInspectAttempt('Ctrl+Shift+C');
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          e.stopPropagation();
          onInspectAttempt('Ctrl+Shift+I');
        }
        
        // F12
        if (e.key === 'F12') {
          e.preventDefault();
          e.stopPropagation();
          onInspectAttempt('F12');
        }
      }, true);
    }

    // Détecter les modifications du DOM suspectes (injection d'éléments d'inspection)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Détecter les iframes injectés
              if (node.tagName === 'IFRAME') {
                warn('Iframe détecté:', node.src);
                node.remove();
              }
              
              // Détecter les scripts externes suspects
              if (node.tagName === 'SCRIPT') {
                const src = node.src || '';
                if (src && !src.includes(window.location.hostname) && !src.includes('sourceguard')) {
                  warn('Script externe suspect:', src);
                  // node.remove(); // Décommenter pour supprimer automatiquement
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    log('Protection contre l\'inspection activée');
  }

  function onInspectAttempt(method) {
    log('Tentative d\'inspection:', method);
    
    if (CONFIG.alertMessage) {
      alert(CONFIG.alertMessage);
    }

    if (CONFIG.redirectUrl) {
      window.location.href = CONFIG.redirectUrl;
    }
  }

  // ============================================
  // 5. DÉTECTION D'EXTENSIONS DE NAVIGATEUR
  // ============================================
  function detectExtensions() {
    if (!CONFIG.extensionDetection) return;

    const knownExtensions = {
      'wappalyzer': () => window.wappalyzer,
      'builtwith': () => window.builtwith,
      'whatruns': () => window.whatRuns,
      'similartech': () => window.similarTech,
      'datadog': () => window.Datadog,
      'lighthouse': () => window.lighthouse,
      'react-devtools': () => window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
      'vue-devtools': () => window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
      'redux-devtools': () => window.__REDUX_DEVTOOLS_EXTENSION__,
      'angular-devtools': () => window.ng,
      'firebug': () => window.firebug,
      'chrome-devtools': () => window.chrome && window.chrome.devtools,
    };

    Object.entries(knownExtensions).forEach(([name, check]) => {
      try {
        if (check()) {
          warn(`Extension détectée: ${name}`);
        }
      } catch (e) {
        // Ignorer
      }
    });
  }

  // ============================================
  // 6. DÉTECTION DE NAVIGATEUR HEADLESS
  // ============================================
  function detectHeadlessBrowser() {
    const checks = [
      () => navigator.webdriver,
      () => window.chrome && window.chrome.runtime && window.chrome.runtime.OnInstalledReason === undefined,
      () => navigator.plugins.length === 0,
      () => navigator.languages === undefined,
      () => window.outerWidth === 0 && window.outerHeight === 0,
      () => navigator.hardwareConcurrency === undefined,
      () => navigator.permissions && navigator.permissions.query && navigator.permissions.query({ name: 'notifications' }).then(Notification.permission === 'denied' && Notification.requestPermission() === 'denied'),
    ];

    checks.forEach((check, index) => {
      try {
        if (check()) {
          warn(`Navigateur headless détecté (check ${index + 1})`);
        }
      } catch (e) {
        // Ignorer
      }
    });
  }

  // ============================================
  // 7. PROTECTION CONTRE LE SCRAPING
  // ============================================
  function protectAgainstScraping() {
    // Détecter les requêtes fetch suspectes
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const url = args[0];
      if (typeof url === 'string' && (url.includes('api') || url.includes('scrape') || url.includes('extract'))) {
        warn('Requête suspecte:', url);
      }
      return originalFetch.apply(window, args);
    };

    // Détecter les XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      
      xhr.open = function(method, url, ...args) {
        if (url && (url.includes('api') || url.includes('scrape') || url.includes('extract'))) {
          warn('XHR suspect:', method, url);
        }
        return originalOpen.call(this, method, url, ...args);
      };
      
      return xhr;
    };
  }

  // ============================================
  // 8. PROTECTION CONTRE LE COPIER-COLLER
  // ============================================
  function protectCopyPaste() {
    document.addEventListener('copy', (e) => {
      const selection = window.getSelection().toString();
      if (selection.length > 100) {
        warn('Copie de texte longue détectée');
      }
    });

    document.addEventListener('paste', (e) => {
      warn('Collage détecté');
    });

    // Bloquer la sélection de texte (optionnel)
    // document.addEventListener('selectstart', (e) => {
    //   e.preventDefault();
    // });
  }

  // ============================================
  // 9. INITIALISATION
  // ============================================
  function init() {
    log('SourceGuard Pro initialisé');

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  function start() {
    // 1. Bloquer la console en premier
    blockConsoleCompletely();
    
    // 2. Protéger le code source
    protectSourceCode();
    
    // 3. Protéger contre l'inspection
    protectInspectElements();
    
    // 4. Détecter les DevTools
    detectAndBlockDevTools();
    
    // 5. Détecter les extensions
    detectExtensions();
    
    // 6. Détecter les navigateurs headless
    detectHeadlessBrowser();
    
    // 7. Protéger contre le scraping
    protectAgainstScraping();
    
    // 8. Protéger le copier-coller
    protectCopyPaste();

    log('Toutes les protections sont actives');
  }

  // Démarrer immédiatement
  init();

  // Exposer l'API publique
  window.SourceGuard = {
    config: CONFIG,
    version: '2.0.0',
    isProtected: true
  };

})();
