// PWA Utilities - Funcionalidades para melhorar a experiência do PWA

class PWAUtils {
    constructor() {
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupServiceWorkerUpdates();
        this.setupLazyLoading();
    }

    // Configurar prompt de instalação
    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton();
        });

        // Criar botão de instalação
        const installBtn = document.createElement('button');
        installBtn.id = 'install-btn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installBtn.className = 'install-btn hidden';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Usuário ${outcome} a instalação`);
                deferredPrompt = null;
                this.hideInstallButton();
            }
        });

        document.body.appendChild(installBtn);
    }

    showInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            installBtn.style.display = 'flex';
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.classList.add('hidden');
            installBtn.style.display = 'none';
        }
    }



    // Configurar atualizações do Service Worker
    setupServiceWorkerUpdates() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                this.showUpdateNotification();
            });
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>Nova versão disponível!</span>
                <button onclick="window.location.reload()" class="update-btn">Atualizar</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #28a745;
            color: white;
            padding: 12px;
            text-align: center;
            z-index: 1002;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Auto-hide após 10 segundos
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => notification.remove(), 300);
        }, 10000);
    }

    // Configurar lazy loading para imagens
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Verificar se está rodando como PWA
    static isPWA() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    // Obter informações de conectividade
    static getConnectionInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    }
}

// Adicionar estilos CSS para os componentes PWA
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
    .hidden {
        display: none !important;
    }
    
    .install-btn:hover {
        background: #0056b3 !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4) !important;
    }
    
    .update-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }
    
    .update-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .update-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    img.lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    img.lazy.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(pwaStyles);

// Inicializar PWA Utils quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PWAUtils());
} else {
    new PWAUtils();
}

