const FIXED_FILE_NAME = 'database.json';
const STORAGE_AUTH_KEY = 'finans_takip_is_logged_in';
const STORAGE_LOCAL_DATA = 'finans_takip_encrypted_data';
const THEME_KEY = 'finans_takip_theme';

let appState = {
    user: null,
    categories: [],
    records: [],
    sidebarWidth: 250
};

let pendingRecordFormData = null;

let rawEncryptedPayload = null;
let chartInstance = null;
let deleteCallback = null;
let pendingDatabaseImport = null;

// WEB CRYPTO API ŞİFRELEME (AES-GCM / PBKDF2)
const MASTER_SECRET = 'FT_SECURE_SECRET_2026_MASTER_KEY';

async function getCryptoKey(salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw", enc.encode(MASTER_SECRET), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(jsonObject) {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getCryptoKey(salt);
    
    const encodedData = enc.encode(JSON.stringify(jsonObject));
    const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedData
    );

    return {
        salt: Array.from(salt),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedContent))
    };
}

async function decryptData(encryptedPayload) {
    try {
        const salt = new Uint8Array(encryptedPayload.salt);
        const iv = new Uint8Array(encryptedPayload.iv);
        const data = new Uint8Array(encryptedPayload.data);
        
        const key = await getCryptoKey(salt);
        const decryptedContent = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );

        const dec = new TextDecoder();
        return JSON.parse(dec.decode(decryptedContent));
    } catch (err) {
        console.error("Şifre çözme hatası:", err);
        return null;
    }
}

function updateDashboardMonthTitle() {
    const monthTitle = document.getElementById('dashboardMonthTitle');
    if (!monthTitle) return;

    const monthText = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    const formattedMonth = monthText.charAt(0).toUpperCase() + monthText.slice(1);

    monthTitle.textContent = `${formattedMonth} Özeti`;
    document.title = `Kredi & Taksit Takip Sistemi - ${formattedMonth}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    document.addEventListener('contextmenu', handleGlobalContextMenu);

    initTheme();
    setDefaultDate();
    initSidebarResize();
    updateDashboardMonthTitle();
    syncSidebarCollapsedState(true);
    
    await scanAndInitializeDataFile();
    
    initChart();
    checkAuthStatus();

    document.getElementById('sidebarToggleBtn').addEventListener('click', toggleSidebar);
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('openRecordModalBtn').addEventListener('click', openRecordModal);
    document.getElementById('openCategoryModalBtn').addEventListener('click', openCategoryModal);
    document.getElementById('openUserModalBtn').addEventListener('click', openUserModal);
    document.getElementById('databaseOperationsBtn').addEventListener('click', openDatabaseOperationsModal);
    document.getElementById('deleteDatabaseBtn').addEventListener('click', startDatabaseDeletion);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('backupDatabaseBtn').addEventListener('click', handleDatabaseBackup);
    document.getElementById('loadDatabaseBtn').addEventListener('click', openDatabaseUploadModal);
    document.getElementById('databaseFileInput').addEventListener('change', handleDatabaseFileSelection);

    const uploadDropzone = document.getElementById('databaseUploadDropzone');
    uploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('drag-over');
    });
    uploadDropzone.addEventListener('dragleave', () => uploadDropzone.classList.remove('drag-over'));
    uploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            prepareDatabaseImport(e.dataTransfer.files[0]);
        }
    });
    uploadDropzone.addEventListener('click', () => document.getElementById('databaseFileInput').click());
    uploadDropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('databaseFileInput').click();
        }
    });

    document.getElementById('recordModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'recordModalOverlay') closeRecordModal();
    });
    document.getElementById('categoryModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'categoryModalOverlay') closeCategoryModal();
    });
    document.getElementById('userModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'userModalOverlay') closeUserModal();
    });
    document.getElementById('editCategoryModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'editCategoryModalOverlay') closeEditCategoryModal();
    });
    document.getElementById('deleteConfirmModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'deleteConfirmModalOverlay') closeDeleteConfirmModal();
    });
    document.getElementById('databaseOperationsModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'databaseOperationsModalOverlay') closeDatabaseOperationsModal();
    });
    document.getElementById('recordDetailsModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'recordDetailsModalOverlay') closeRecordDetailsModal();
    });
    document.getElementById('databaseUploadModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'databaseUploadModalOverlay') closeDatabaseUploadModal();
    });

    document.getElementById('customContextMenu').addEventListener('click', handleContextMenuAction);
    document.addEventListener('click', hideCustomContextMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideCustomContextMenu();
    });
    window.addEventListener('resize', hideCustomContextMenu);
    window.addEventListener('scroll', hideCustomContextMenu, true);

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('userUpdateForm').addEventListener('submit', handleUserUpdate);
    document.getElementById('loanForm').addEventListener('submit', handleAddOrEditRecord);
    document.getElementById('addCategoryBtn').addEventListener('click', handleAddCategory);
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        if (deleteCallback) {
            deleteCallback();
            closeDeleteConfirmModal();
        }
    });
});

// KREDİ VE VERGİ DAHİL FAİZ HESAPLAMA MOTORU
function calculateLoanDetails() {
    const netAmount = parseFloat(document.getElementById('netAmount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const bsmvRate = parseFloat(document.getElementById('bsmvRate').value) || 0;
    const kkdfRate = parseFloat(document.getElementById('kkdfRate').value) || 0;
    const count = parseInt(document.getElementById('installmentCount').value) || 1;

    if (netAmount > 0 && interestRate > 0 && count > 0) {
        const grossInterestRate = (interestRate / 100) * (1 + (bsmvRate / 100) + (kkdfRate / 100));
        
        let monthlyPayment = 0;
        if (grossInterestRate === 0) {
            monthlyPayment = netAmount / count;
        } else {
            const factor = Math.pow(1 + grossInterestRate, count);
            monthlyPayment = netAmount * (grossInterestRate * factor) / (factor - 1);
        }

        const totalAmount = monthlyPayment * count;

        document.getElementById('previewGrossInterestRate').innerText = `%${(grossInterestRate * 100).toFixed(2)}`;
        document.getElementById('previewMonthlyPayment').innerText = `${formatCurrency(monthlyPayment)} ₺`;
        document.getElementById('previewTotalAmount').innerText = `${formatCurrency(totalAmount)} ₺`;
        
        document.getElementById('totalAmount').value = totalAmount.toFixed(2);
    } else {
        document.getElementById('previewGrossInterestRate').innerText = `%0.00`;
        document.getElementById('previewMonthlyPayment').innerText = `0.00 ₺`;
        document.getElementById('previewTotalAmount').innerText = `0.00 ₺`;
    }
}

// ERKEN KAPAMA VE ANAPARA HESAPLAMA DİNAMİK FONKSİYONU
function calculateEarlyClosureDetails(rec) {
    const netAmount = parseFloat(rec.netAmount) || 0;
    const interestRate = parseFloat(rec.interestRate) || 0;
    const bsmvRate = rec.bsmvRate !== undefined ? parseFloat(rec.bsmvRate) : 15;
    const kkdfRate = rec.kkdfRate !== undefined ? parseFloat(rec.kkdfRate) : 15;
    const totalCount = parseInt(rec.installmentCount) || 1;
    const paidCount = parseInt(rec.paidInstallments) || 0;

    if (netAmount <= 0 || interestRate <= 0) {
        const simpleRemaining = rec.totalAmount - ((rec.totalAmount / totalCount) * paidCount);
        return {
            remainingPrincipal: simpleRemaining,
            closureToday: simpleRemaining
        };
    }

    const grossRate = (interestRate / 100) * (1 + (bsmvRate / 100) + (kkdfRate / 100));

    let remainingPrincipal = netAmount;
    const factor = Math.pow(1 + grossRate, totalCount);
    const monthlyPayment = netAmount * (grossRate * factor) / (factor - 1);

    for (let i = 0; i < paidCount; i++) {
        const monthlyInterest = remainingPrincipal * grossRate;
        const monthlyPrincipalPayment = monthlyPayment - monthlyInterest;
        remainingPrincipal -= monthlyPrincipalPayment;
    }

    if (remainingPrincipal < 0) remainingPrincipal = 0;

    const startDate = new Date(rec.startDate);
    const lastPaymentDate = new Date(startDate);
    lastPaymentDate.setMonth(lastPaymentDate.getMonth() + paidCount);

    const today = new Date();
    const diffTime = Math.max(0, today - lastPaymentDate);
    const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const dailyInterestRate = grossRate / 30;
    const accruedInterest = remainingPrincipal * dailyInterestRate * elapsedDays;

    const closureToday = remainingPrincipal + accruedInterest;

    return {
        remainingPrincipal: remainingPrincipal,
        accruedInterest: accruedInterest,
        elapsedDays: elapsedDays,
        closureToday: closureToday
    };
}

// SIDEBAR GENİŞLİK AYARLAMA (RESIZABLE & JSON SAVED)
function initSidebarResize() {
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebarResizer');
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        if (sidebar.classList.contains('collapsed')) return;
        isResizing = true;
        resizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = e.clientX - sidebar.getBoundingClientRect().left;
        if (newWidth >= 200 && newWidth <= 450) {
            sidebar.style.width = `${newWidth}px`;
            appState.sidebarWidth = newWidth;
        }
    });

    document.addEventListener('mouseup', async () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('resizing');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            await autoSaveAllData();
        }
    });
}

function applySavedSidebarWidth() {
    const sidebar = document.getElementById('sidebar');
    if (appState.sidebarWidth && !sidebar.classList.contains('collapsed')) {
        sidebar.style.width = `${appState.sidebarWidth}px`;
    }
}

function syncSidebarCollapsedState(forceCollapsed = null) {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('sidebarToggleIcon');
    const toggleBtn = document.getElementById('sidebarToggleBtn');

    if (!sidebar || !icon || !toggleBtn) return;

    const nextState = forceCollapsed === null
        ? !sidebar.classList.contains('collapsed')
        : Boolean(forceCollapsed);

    sidebar.classList.toggle('collapsed', nextState);

    if (nextState) {
        icon.className = 'fa-solid fa-chevron-right';
        toggleBtn.title = 'Menüyü Genişlet';
        sidebar.style.width = '68px';
    } else {
        icon.className = 'fa-solid fa-chevron-left';
        toggleBtn.title = 'Menüyü Daralt';
        applySavedSidebarWidth();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    syncSidebarCollapsedState(!sidebar.classList.contains('collapsed'));
}

function handleGlobalContextMenu(e) {
    e.preventDefault();

    const appLayout = document.getElementById('appLayout');
    if (!appLayout || getComputedStyle(appLayout).display === 'none') return;

    const contextMenu = document.getElementById('customContextMenu');
    contextMenu.classList.add('visible');
    contextMenu.style.left = '0px';
    contextMenu.style.top = '0px';

    const menuRect = contextMenu.getBoundingClientRect();
    const left = Math.min(e.clientX, window.innerWidth - menuRect.width - 12);
    const top = Math.min(e.clientY, window.innerHeight - menuRect.height - 12);

    contextMenu.style.left = `${Math.max(12, left)}px`;
    contextMenu.style.top = `${Math.max(12, top)}px`;
}

function hideCustomContextMenu() {
    const contextMenu = document.getElementById('customContextMenu');
    if (contextMenu) contextMenu.classList.remove('visible');
}

function handleContextMenuAction(e) {
    const actionButton = e.target.closest('[data-context-action]');
    if (!actionButton) return;

    hideCustomContextMenu();

    const actions = {
        record: openRecordModal,
        category: openCategoryModal,
        user: openUserModal,
        database: openDatabaseOperationsModal
    };

    const action = actions[actionButton.dataset.contextAction];
    if (action) action();
}

function createInitialAppState() {
    return {
        user: {
            email: 'admin@admin.local',
            password: 'admin123'
        },
        categories: ["Kredi", "Kredi Kartı", "Elektronik", "Eğitim", "Kişisel Borç", "Diğer"],
        records: [],
        sidebarWidth: 250
    };
}

// AKILLI TARAMA VE YÜKLEME / SUNUCU KAYIT MEKANİZMASI
async function scanAndInitializeDataFile() {
    try {
        const response = await fetch(FIXED_FILE_NAME, { cache: 'no-store' });
        if (response.ok) {
            rawEncryptedPayload = await response.json();
            const decryptedData = await decryptData(rawEncryptedPayload);
            if (decryptedData) {
                appState = decryptedData;
                localStorage.setItem(STORAGE_LOCAL_DATA, JSON.stringify(rawEncryptedPayload));
                applySavedSidebarWidth();
                showToast(`Sunucudaki '${FIXED_FILE_NAME}' dosyasından veriler alındı.`);
                return;
            }
        }
    } catch (err) {
        console.log("Sunucuda dosya yok veya erişilemedi. Yerel/Sıfırdan yapılandırma kontrol ediliyor.");
    }

    const localSaved = localStorage.getItem(STORAGE_LOCAL_DATA);
    if (localSaved) {
        try {
            rawEncryptedPayload = JSON.parse(localSaved);
            const decryptedData = await decryptData(rawEncryptedPayload);
            if (decryptedData) {
                appState = decryptedData;
                appState.records.forEach(syncRecordLastPaymentMonth);
                applySavedSidebarWidth();
                showToast("Önceki kaydedilmiş yerel veriler okundu.");
                await autoSaveAllData();
                return;
            }
        } catch (e) {}
    }

    appState = createInitialAppState();

    appState.records.forEach(syncRecordLastPaymentMonth);
    applySavedSidebarWidth();
    await autoSaveAllData();
    showToast("Sıfırdan veri yapısı oluşturuldu ve sunucuya kaydedildi.");
}

async function autoSaveAllData() {
    rawEncryptedPayload = await encryptData(appState);
    localStorage.setItem(STORAGE_LOCAL_DATA, JSON.stringify(rawEncryptedPayload));
    
    const statusText = document.getElementById('autosaveText');

    try {
        await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rawEncryptedPayload)
        });
        statusText.innerText = "Kaydedildi";
    } catch (err) {
        console.error("Sunucu kayıt hatası:", err);
        statusText.innerText = "Yerel Kaydedildi";
    }

    setTimeout(() => {
        statusText.innerText = "Oto Kayıt Aktif";
    }, 1500);
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
    const loginOverlay = document.getElementById('loginOverlay');
    const mainHeader = document.getElementById('mainHeader');
    const appLayout = document.getElementById('appLayout');
    const mainFooter = document.getElementById('mainFooter');

    if (isLoggedIn) {
        loginOverlay.style.display = 'none';
        mainHeader.style.display = 'block';
        appLayout.style.display = 'flex';
        mainFooter.style.display = 'block';
        render();
    } else {
        loginOverlay.style.display = 'flex';
        mainHeader.style.display = 'none';
        appLayout.style.display = 'none';
        mainFooter.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail').value.trim();
    const passwordInput = document.getElementById('loginPassword').value;

    if (appState.user && emailInput === appState.user.email && passwordInput === appState.user.password) {
        localStorage.setItem(STORAGE_AUTH_KEY, 'true');
        checkAuthStatus();
        document.getElementById('loginForm').reset();
        showToast("Giriş başarılı.");
    } else {
        showToast("Hata: Geçersiz e-posta veya parola!", true);
    }
}

function handleLogout() {
    openDeleteConfirmModal("Mevcut oturumunuz sonlandırılacaktır.", () => {
        localStorage.removeItem(STORAGE_AUTH_KEY);
        checkAuthStatus();
        showToast("Oturum kapatıldı.");
    }, "Oturumu Kapatmak İstediğinize Emin misiniz?", "danger");
}

function openDatabaseOperationsModal() {
    document.getElementById('databaseOperationsModalOverlay').classList.add('active');
}

function closeDatabaseOperationsModal() {
    document.getElementById('databaseOperationsModalOverlay').classList.remove('active');
}

function openDatabaseUploadModal() {
    closeDatabaseOperationsModal();
    document.getElementById('databaseUploadModalOverlay').classList.add('active');
}

function closeDatabaseUploadModal() {
    document.getElementById('databaseUploadModalOverlay').classList.remove('active');
}

function handleDatabaseBackup() {
    closeDatabaseOperationsModal();
    openDeleteConfirmModal("Veritabanı yedeği (.json) cihazınıza indirilecektir. Onaylıyor musunuz?", async () => {
        if (!rawEncryptedPayload) {
            rawEncryptedPayload = await encryptData(appState);
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rawEncryptedPayload, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", FIXED_FILE_NAME);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Veritabanı yedeği başarıyla indirildi.");
    }, "Veritabanı Yedekleme Onayı", "success");
}

function handleDatabaseFileSelection(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) prepareDatabaseImport(file);
}

async function prepareDatabaseImport(file) {
    try {
        const fileContent = await file.text();
        const encryptedPayload = JSON.parse(fileContent);
        const importedState = await decryptData(encryptedPayload);

        if (!importedState || !importedState.user || !Array.isArray(importedState.categories) || !Array.isArray(importedState.records)) {
            throw new Error('Geçersiz veritabanı yapısı.');
        }

        pendingDatabaseImport = { encryptedPayload, importedState };
        closeDatabaseUploadModal();
        openDeleteConfirmModal(
            "Bu işlem geri alınamaz. Seçilen veritabanı mevcut verilerin üzerine yazılacak, oturum sonlandırılacak ve ilk oturum başlangıcına dönülecek. Devam etmek istiyor musunuz?",
            applyDatabaseImport,
            "Veritabanı Yükleme Onayı",
            "info"
        );
    } catch (err) {
        pendingDatabaseImport = null;
        console.error("Veritabanı dosyası okuma hatası:", err);
        showToast("Geçerli ve şifreli bir veritabanı dosyası seçin.", true);
    }
}

async function applyDatabaseImport() {
    if (!pendingDatabaseImport) return;

    const { encryptedPayload, importedState } = pendingDatabaseImport;
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(encryptedPayload)
        });

        if (!response.ok) throw new Error('Veritabanı sunucuya kaydedilemedi.');

        appState = importedState;
        rawEncryptedPayload = encryptedPayload;
        localStorage.setItem(STORAGE_LOCAL_DATA, JSON.stringify(encryptedPayload));
        localStorage.removeItem(STORAGE_AUTH_KEY);
        pendingDatabaseImport = null;
        checkAuthStatus();
        showToast("Veritabanı başarıyla yüklendi. İlk oturum başlangıcına dönülüyor ve mevcut oturum sonlandırıldı.");
    } catch (err) {
        console.error("Veritabanı yükleme hatası:", err);
        pendingDatabaseImport = null;
        showToast("Veritabanı yüklenemedi. Mevcut veriler korunuyor; lütfen tekrar deneyin.", true);
    }
}

function startDatabaseDeletion() {
    closeDatabaseOperationsModal();
    requestDatabaseDeletionConfirmation(1);
}

function requestDatabaseDeletionConfirmation(step) {
    const isFinalConfirmation = step === 3;
    const message = isFinalConfirmation
        ? "Son onay: Tüm kredi, taksit, kategori ve kullanıcı verileri silinecek. Temiz başlangıç verileri oluşturulsun mu?"
        : `Dikkat: Veritabanı silme işlemi geri alınamaz. Devam etmek istediğinizi onaylayın (${step}/3).`;

    openDeleteConfirmModal(message, () => {
        if (isFinalConfirmation) {
            deleteDatabase();
            return;
        }

        setTimeout(() => requestDatabaseDeletionConfirmation(step + 1), 150);
    }, `Veritabanı Silme Onayı (${step}/3)`, "danger");
}

async function deleteDatabase() {
    try {
        const initialState = createInitialAppState();
        let response = await fetch('/api/database', { method: 'DELETE' });

        if (!response.ok && (response.status === 404 || response.status === 405)) {
            rawEncryptedPayload = await encryptData(initialState);
            response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rawEncryptedPayload)
            });
        }

        if (!response.ok) throw new Error('Veritabanı silinemedi.');

        appState = initialState;
        rawEncryptedPayload = null;
        localStorage.removeItem(STORAGE_AUTH_KEY);
        localStorage.removeItem(STORAGE_LOCAL_DATA);
        await autoSaveAllData();
        checkAuthStatus();
        showToast("Veritabanı silindi. İlk kullanıcı tanımlaması hazırlandı.");
    } catch (err) {
        console.error("Veritabanı silme hatası:", err);
        showToast("Veritabanı silinemedi. Lütfen tekrar deneyin.", true);
    }
}

function openUserModal() {
    if (appState.user) {
        document.getElementById('updateEmail').value = appState.user.email;
    }
    document.getElementById('updateCurrentPassword').value = '';
    document.getElementById('updateNewPassword').value = '';
    document.getElementById('userModalOverlay').classList.add('active');
}

function closeUserModal() {
    document.getElementById('userModalOverlay').classList.remove('active');
}

async function handleUserUpdate(e) {
    e.preventDefault();
    const newEmail = document.getElementById('updateEmail').value.trim();
    const currentPass = document.getElementById('updateCurrentPassword').value;
    const newPass = document.getElementById('updateNewPassword').value;

    if (currentPass !== appState.user.password) {
        showToast("Hata: Mevcut parolanız hatalı!", true);
        return;
    }

    appState.user.email = newEmail;
    if (newPass) {
        appState.user.password = newPass;
    }

    await autoSaveAllData();
    closeUserModal();
    showToast("Kullanıcı bilgileri güncellendi.");
}

function openRecordModal() {
    populateCategoryDropdown();
    
    if (pendingRecordFormData) {
        document.getElementById('editRecordId').value = pendingRecordFormData.editId || '';
        document.getElementById('title').value = pendingRecordFormData.title || '';
        document.getElementById('netAmount').value = pendingRecordFormData.netAmount || '';
        document.getElementById('interestRate').value = pendingRecordFormData.interestRate || '';
        document.getElementById('bsmvRate').value = pendingRecordFormData.bsmvRate || 15;
        document.getElementById('kkdfRate').value = pendingRecordFormData.kkdfRate || 15;
        document.getElementById('totalAmount').value = pendingRecordFormData.totalAmount || '';
        document.getElementById('installmentCount').value = pendingRecordFormData.installmentCount || 12;
        document.getElementById('paidInstallments').value = pendingRecordFormData.paidInstallments || 0;
        document.getElementById('startDate').value = pendingRecordFormData.startDate || new Date().toISOString().split('T')[0];
        document.getElementById('notes').value = pendingRecordFormData.notes || '';
        
        if (pendingRecordFormData.selectedCategory && appState.categories.includes(pendingRecordFormData.selectedCategory)) {
            document.getElementById('categorySelect').value = pendingRecordFormData.selectedCategory;
        } else if (appState.categories.length > 0) {
            document.getElementById('categorySelect').value = appState.categories[appState.categories.length - 1];
        }

        if (pendingRecordFormData.editId) {
            document.getElementById('recordModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--accent-primary);"></i> Kaydı Düzenle`;
            document.getElementById('recordSubmitBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet`;
        } else {
            document.getElementById('recordModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--accent-primary);"></i> Yeni Kayıt Ekle`;
            document.getElementById('recordSubmitBtn').innerHTML = `<i class="fa-solid fa-plus"></i> Kaydı Oluştur ve Kaydet`;
        }

        pendingRecordFormData = null;
    } else {
        document.getElementById('loanForm').reset();
        document.getElementById('editRecordId').value = '';
        document.getElementById('bsmvRate').value = 15;
        document.getElementById('kkdfRate').value = 15;
        document.getElementById('recordModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--accent-primary);"></i> Yeni Kayıt Ekle`;
        document.getElementById('recordSubmitBtn').innerHTML = `<i class="fa-solid fa-plus"></i> Kaydı Oluştur ve Kaydet`;
        setDefaultDate();
    }

    calculateLoanDetails();
    document.getElementById('recordModalOverlay').classList.add('active');
}

function editRecordModal(id) {
    const rec = appState.records.find(r => r.id === id);
    if (!rec) return;

    populateCategoryDropdown();
    document.getElementById('editRecordId').value = rec.id;
    document.getElementById('title').value = rec.title;
    document.getElementById('categorySelect').value = rec.category;
    document.getElementById('netAmount').value = rec.netAmount || '';
    document.getElementById('interestRate').value = rec.interestRate || '';
    document.getElementById('bsmvRate').value = rec.bsmvRate !== undefined ? rec.bsmvRate : 15;
    document.getElementById('kkdfRate').value = rec.kkdfRate !== undefined ? rec.kkdfRate : 15;
    document.getElementById('totalAmount').value = rec.totalAmount;
    document.getElementById('installmentCount').value = rec.installmentCount;
    document.getElementById('paidInstallments').value = rec.paidInstallments;
    document.getElementById('startDate').value = rec.startDate;
    document.getElementById('notes').value = rec.notes || '';

    document.getElementById('recordModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--accent-primary);"></i> Kaydı Düzenle`;
    document.getElementById('recordSubmitBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet`;

    calculateLoanDetails();
    document.getElementById('recordModalOverlay').classList.add('active');
}

function openRecordDetailsModal(id) {
    const record = appState.records.find(r => r.id === id);
    if (!record) return;

    syncRecordLastPaymentMonth(record);
    const monthlyPayment = record.totalAmount / record.installmentCount;
    const progressPercent = Math.round((record.paidInstallments / record.installmentCount) * 100);
    const isCompleted = record.paidInstallments === record.installmentCount;
    const paymentDueThisMonth = isPaymentDueThisMonth(record);
    const closureDetails = calculateEarlyClosureDetails(record);
    const detailTitle = escapeHtml(String(record.title || 'Kredi Kaydı'));
    const statusLabel = isCompleted ? 'Tamamlandı' : 'Devam Ediyor';

    document.getElementById('recordDetailsTitle').innerHTML = `
        <i class="fa-solid fa-circle-info" style="color: var(--accent-primary);"></i>
        ${detailTitle}
    `;
    document.getElementById('recordDetailsContent').innerHTML = `
        ${paymentDueThisMonth ? '<div class="record-details-alert"><i class="fa-solid fa-triangle-exclamation"></i> Bu ayın taksit ödemesi yapılmamış.</div>' : ''}
        <div class="record-details-status-row">
            <span class="badge ${isCompleted ? 'badge-success' : 'badge-warning'}">
                <i class="fa-solid ${isCompleted ? 'fa-check' : 'fa-clock'}"></i> ${statusLabel}
            </span>
            <strong>%${progressPercent} tamamlandı</strong>
        </div>
        <div class="record-details-grid">
            <div class="record-detail-item"><span>Kategori</span><strong>${escapeHtml(String(record.category || '-'))}</strong></div>
            <div class="record-detail-item"><span>Aylık Tutar</span><strong>${formatCurrency(monthlyPayment)} ₺</strong></div>
            <div class="record-detail-item"><span>Net Tutar</span><strong>${formatCurrency(Number(record.netAmount) || 0)} ₺</strong></div>
            <div class="record-detail-item"><span>Toplam Geri Ödeme</span><strong>${formatCurrency(Number(record.totalAmount) || 0)} ₺</strong></div>
            <div class="record-detail-item"><span>Aylık Faiz</span><strong>%${record.interestRate || 0}</strong></div>
            <div class="record-detail-item"><span>BSMV</span><strong>%${record.bsmvRate || 0}</strong></div>
            <div class="record-detail-item"><span>KKDF / Stopaj</span><strong>%${record.kkdfRate || 0}</strong></div>
            <div class="record-detail-item"><span>Taksit Durumu</span><strong>${record.paidInstallments} / ${record.installmentCount}</strong></div>
            <div class="record-detail-item"><span>Başlangıç Tarihi</span><strong>${escapeHtml(String(record.startDate || '-'))}</strong></div>
            <div class="record-detail-item"><span>Son Ödenen Ay</span><strong>${escapeHtml(getRecordLastPaidMonthLabel(record))}</strong></div>
            <div class="record-detail-item"><span>Son Taksit Ayı</span><strong>${escapeHtml(getRecordFinalPaymentMonthLabel(record))}</strong></div>
            <div class="record-detail-item"><span>Kalan Anapara</span><strong>${formatCurrency(isCompleted ? 0 : closureDetails.remainingPrincipal)} ₺</strong></div>
            <div class="record-detail-item"><span>Bugün Kapatılırsa</span><strong>${formatCurrency(isCompleted ? 0 : closureDetails.closureToday)} ₺</strong></div>
        </div>
        <div class="record-details-note">
            <span>Notlar</span>
            <p>${record.notes ? escapeHtml(String(record.notes)) : 'Not eklenmemiş.'}</p>
        </div>
    `;

    document.getElementById('recordDetailsModalOverlay').classList.add('active');
}

function closeRecordDetailsModal() {
    document.getElementById('recordDetailsModalOverlay').classList.remove('active');
}

function closeRecordModal() {
    document.getElementById('recordModalOverlay').classList.remove('active');
}

function openCategoryModal() {
    renderCategoryList();
    document.getElementById('categoryModalOverlay').classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('categoryModalOverlay').classList.remove('active');
    
    if (pendingRecordFormData) {
        setTimeout(() => {
            openRecordModal();
        }, 150);
    }
}

function openDeleteConfirmModal(msg, onConfirm, title = "İşlem Onayı", type = "warning") {
    document.getElementById('deleteConfirmTitle').innerText = title;
    document.getElementById('deleteConfirmMessage').innerText = msg;
    
    const iconContainer = document.getElementById('confirmIconContainer');
    const icon = document.getElementById('confirmIcon');
    const confirmBtn = document.getElementById('confirmDeleteBtn');

    if (type === "success" || type === "info") {
        iconContainer.style.color = "var(--accent-primary)";
        icon.className = "fa-solid fa-circle-check";
        confirmBtn.className = "btn btn-primary";
    } else {
        iconContainer.style.color = "var(--danger)";
        icon.className = "fa-solid fa-triangle-exclamation";
        confirmBtn.className = "btn btn-danger";
    }

    deleteCallback = onConfirm;
    document.getElementById('deleteConfirmModalOverlay').classList.add('active');
}

function closeDeleteConfirmModal() {
    document.getElementById('deleteConfirmModalOverlay').classList.remove('active');
    deleteCallback = null;
    document.getElementById('deleteConfirmTitle').innerText = "İşlem Onayı";
}

function openEditCategoryModal(index) {
    document.getElementById('editCategoryIndex').value = index;
    document.getElementById('editCategoryInput').value = appState.categories[index];
    document.getElementById('editCategoryModalOverlay').classList.add('active');
}

function closeEditCategoryModal() {
    document.getElementById('editCategoryModalOverlay').classList.remove('active');
}

async function saveCategoryEdit() {
    const index = parseInt(document.getElementById('editCategoryIndex').value);
    const newName = document.getElementById('editCategoryInput').value.trim();

    if (!newName) {
        showToast("Kategori adı boş olamaz!", true);
        return;
    }

    const oldName = appState.categories[index];
    if (newName !== oldName && appState.categories.includes(newName)) {
        showToast("Bu kategori zaten var!", true);
        return;
    }

    appState.categories[index] = newName;
    appState.records.forEach(r => {
        if (r.category === oldName) r.category = newName;
    });

    await autoSaveAllData();
    renderCategoryList();
    populateCategoryDropdown();
    render();
    closeEditCategoryModal();
    showToast("Kategori güncellendi.");
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateChartColors();
    showToast(`Tema değiştirildi.`);
}

function renderCategoryList() {
    const container = document.getElementById('categoryListContainer');
    container.innerHTML = '';

    appState.categories.forEach((cat, index) => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.draggable = true;
        item.dataset.index = index;

        item.innerHTML = `
            <div class="category-left-content">
                <div class="category-drag-handle" title="Sürükleyin">
                    <i class="fa-solid fa-grip-vertical"></i>
                </div>
                <span class="category-item-text">${escapeHtml(cat)}</span>
            </div>
            <div class="category-item-actions">
                <button class="icon-btn move-btn" title="Yukarı" onclick="moveCategory(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3;"' : ''}>
                    <i class="fa-solid fa-arrow-up"></i>
                </button>
                <button class="icon-btn move-btn" title="Aşağı" onclick="moveCategory(${index}, 1)" ${index === appState.categories.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
                    <i class="fa-solid fa-arrow-down"></i>
                </button>
                <button class="icon-btn edit" title="Düzenle" onclick="openEditCategoryModal(${index})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="icon-btn delete" title="Sil" onclick="deleteCategory(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);

        container.appendChild(item);
    });
}

let draggedIndex = null;

function handleDragStart(e) {
    draggedIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

async function handleDrop(e) {
    e.preventDefault();
    const targetIndex = parseInt(this.dataset.index);
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
        const itemToMove = appState.categories.splice(draggedIndex, 1)[0];
        appState.categories.splice(targetIndex, 0, itemToMove);
        await autoSaveAllData();
        renderCategoryList();
        populateCategoryDropdown();
        render();
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedIndex = null;
}

async function moveCategory(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= appState.categories.length) return;

    const temp = appState.categories[index];
    appState.categories[index] = appState.categories[targetIndex];
    appState.categories[targetIndex] = temp;

    await autoSaveAllData();
    renderCategoryList();
    populateCategoryDropdown();
    render();
}

async function handleAddCategory() {
    const input = document.getElementById('newCategoryInput');
    const catName = input.value.trim();

    if (!catName) {
        showToast("Geçerli bir kategori girin!", true);
        return;
    }

    if (appState.categories.includes(catName)) {
        showToast("Kategori zaten var!", true);
        return;
    }

    appState.categories.push(catName);
    input.value = '';
    await autoSaveAllData();
    renderCategoryList();
    populateCategoryDropdown();
    render();

    showToast(`'${catName}' eklendi.`);

    if (pendingRecordFormData) {
        pendingRecordFormData.selectedCategory = catName;
        closeCategoryModal();
    }
}

function deleteCategory(index) {
    const catName = appState.categories[index];
    openDeleteConfirmModal(`'${catName}' kategorisini silmek istediğinize emin misiniz?`, async () => {
        appState.categories.splice(index, 1);
        await autoSaveAllData();
        renderCategoryList();
        populateCategoryDropdown();
        render();
        showToast("Kategori silindi.");
    }, "Kategori Silme Onayı", "danger");
}

// KATEGORİ DROPDOWN DOLDURMA
function populateCategoryDropdown() {
    const select = document.getElementById('categorySelect');
    select.innerHTML = '';

    if (appState.categories.length === 0) {
        const createOpt = document.createElement('option');
        createOpt.value = "__CREATE_NEW__";
        createOpt.innerText = "➕ Yeni Kategori Oluştur...";
        createOpt.style.fontWeight = "bold";
        createOpt.selected = true;
        select.appendChild(createOpt);
    } else {
        appState.categories.forEach((cat, idx) => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.innerText = cat;
            if (idx === 0) opt.selected = true;
            select.appendChild(opt);
        });

        const createOpt = document.createElement('option');
        createOpt.value = "__CREATE_NEW__";
        createOpt.innerText = "➕ Yeni Kategori Oluştur...";
        createOpt.style.fontWeight = "bold";
        select.appendChild(createOpt);
    }
}

// Form Verilerini Geçici Saklama ve Kategoriler Ekranına Geçiş
function saveCurrentFormStateAndOpenCategoryModal() {
    pendingRecordFormData = {
        editId: document.getElementById('editRecordId').value,
        title: document.getElementById('title').value,
        netAmount: document.getElementById('netAmount').value,
        interestRate: document.getElementById('interestRate').value,
        bsmvRate: document.getElementById('bsmvRate').value,
        kkdfRate: document.getElementById('kkdfRate').value,
        totalAmount: document.getElementById('totalAmount').value,
        installmentCount: document.getElementById('installmentCount').value,
        paidInstallments: document.getElementById('paidInstallments').value,
        startDate: document.getElementById('startDate').value,
        notes: document.getElementById('notes').value
    };

    closeRecordModal();
    setTimeout(() => {
        openCategoryModal();
    }, 150);
}

function handleCategorySelectChange(selectElem) {
    if (selectElem.value === "__CREATE_NEW__") {
        saveCurrentFormStateAndOpenCategoryModal();
    }
}

function handleCategorySelectClick(selectElem) {
    if (selectElem.value === "__CREATE_NEW__") {
        saveCurrentFormStateAndOpenCategoryModal();
    }
}

async function handleAddOrEditRecord(e) {
    e.preventDefault();

    const editId = document.getElementById('editRecordId').value;
    const title = document.getElementById('title').value;
    const category = document.getElementById('categorySelect').value;

    if (category === "__CREATE_NEW__" || !category) {
        showToast("Lütfen geçerli bir kategori seçin veya yeni oluşturun!", true);
        saveCurrentFormStateAndOpenCategoryModal();
        return;
    }

    const netAmount = parseFloat(document.getElementById('netAmount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const bsmvRate = parseFloat(document.getElementById('bsmvRate').value) || 0;
    const kkdfRate = parseFloat(document.getElementById('kkdfRate').value) || 0;
    const totalAmount = parseFloat(document.getElementById('totalAmount').value);
    const installmentCount = parseInt(document.getElementById('installmentCount').value);
    const paidInstallments = parseInt(document.getElementById('paidInstallments').value) || 0;
    const startDate = document.getElementById('startDate').value;
    const notes = document.getElementById('notes').value;

    if (paidInstallments > installmentCount) {
        showToast("Ödenen taksit toplam taksitten büyük olamaz!", true);
        return;
    }

    if (editId) {
        const recIndex = appState.records.findIndex(r => r.id === editId);
        if (recIndex !== -1) {
            const updatedRecord = {
                id: editId,
                title,
                category,
                netAmount,
                interestRate,
                bsmvRate,
                kkdfRate,
                totalAmount,
                installmentCount,
                paidInstallments,
                startDate,
                notes,
                lastPaidMonth: paidInstallments > 0 ? getInstallmentMonthLabel(startDate, paidInstallments) : 'Ödeme yapılmadı',
                finalPaymentMonth: getInstallmentMonthLabel(startDate, installmentCount)
            };
            appState.records[recIndex] = updatedRecord;
            showToast("Kayıt güncellendi.");
        }
    } else {
        const newRecord = {
            id: Date.now().toString(),
            title,
            category,
            netAmount,
            interestRate,
            bsmvRate,
            kkdfRate,
            totalAmount,
            installmentCount,
            paidInstallments,
            startDate,
            notes,
            lastPaidMonth: paidInstallments > 0 ? getInstallmentMonthLabel(startDate, paidInstallments) : 'Ödeme yapılmadı',
            finalPaymentMonth: getInstallmentMonthLabel(startDate, installmentCount)
        };
        appState.records.push(newRecord);
        showToast("Yeni kayıt eklendi.");
    }

    await autoSaveAllData();
    render();

    document.getElementById('loanForm').reset();
    setDefaultDate();
    closeRecordModal();
}

// FRAME UYARI/ONAY İLE TAKSİT ÖDENSEİN (GÜNCELLENEN KISIM)
function getInstallmentMonthLabel(startDate, installmentNumber) {
    const date = new Date(startDate);
    if (Number.isNaN(date.getTime())) {
        return 'Bilinmeyen ay';
    }

    date.setMonth(date.getMonth() + (installmentNumber - 1));
    const monthText = date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    return monthText.charAt(0).toUpperCase() + monthText.slice(1);
}

function syncRecordLastPaymentMonth(record) {
    if (!record) return;

    const paidCount = parseInt(record.paidInstallments) || 0;
    const installmentCount = parseInt(record.installmentCount) || 0;

    record.lastPaidMonth = paidCount > 0
        ? getInstallmentMonthLabel(record.startDate, paidCount)
        : 'Ödeme yapılmadı';

    record.finalPaymentMonth = installmentCount > 0
        ? getInstallmentMonthLabel(record.startDate, installmentCount)
        : 'Bilinmeyen ay';
}

function getRecordLastPaidMonthLabel(record) {
    if (!record) return 'Ödeme yapılmadı';
    if (record.lastPaidMonth) return record.lastPaidMonth;
    syncRecordLastPaymentMonth(record);
    return record.lastPaidMonth || 'Ödeme yapılmadı';
}

function getRecordFinalPaymentMonthLabel(record) {
    if (!record) return 'Bilinmeyen ay';
    if (record.finalPaymentMonth) return record.finalPaymentMonth;
    syncRecordLastPaymentMonth(record);
    return record.finalPaymentMonth || 'Bilinmeyen ay';
}

function isPaymentDueThisMonth(record) {
    const paidCount = parseInt(record.paidInstallments) || 0;
    const installmentCount = parseInt(record.installmentCount) || 0;
    const startDate = new Date(record.startDate);
    const today = new Date();

    if (!record || installmentCount === 0 || paidCount >= installmentCount || Number.isNaN(startDate.getTime())) {
        return false;
    }

    startDate.setMonth(startDate.getMonth() + paidCount);
    return startDate.getFullYear() === today.getFullYear()
        && startDate.getMonth() === today.getMonth();
}

function incrementPaid(id) {
    const rec = appState.records.find(r => r.id === id);
    if (!rec || rec.paidInstallments >= rec.installmentCount) return;

    const nextInstallmentNumber = rec.paidInstallments + 1;
    const monthlyAmount = rec.totalAmount / rec.installmentCount;
    const installmentMonth = getInstallmentMonthLabel(rec.startDate, nextInstallmentNumber);
    
    const confirmMsg = `'${rec.title}' kaydı için ${installmentMonth} ayına ait ${nextInstallmentNumber}. taksit ödemesini (${formatCurrency(monthlyAmount)} ₺) onaylıyor musunuz?`;

    openDeleteConfirmModal(confirmMsg, async () => {
        rec.paidInstallments++;
        syncRecordLastPaymentMonth(rec);
        await autoSaveAllData();
        render();
        showToast(`'${rec.title}' ${nextInstallmentNumber}. taksidi ödendi.`);
    }, "Taksit Ödeme Onayı", "info");
}

function deleteRecord(id) {
    const rec = appState.records.find(r => r.id === id);
    const recTitle = rec ? `'${rec.title}'` : 'Bu kaydı';
    
    openDeleteConfirmModal(`${recTitle} silmek istediğinize emin misiniz?`, async () => {
        appState.records = appState.records.filter(r => r.id !== id);
        await autoSaveAllData();
        render();
        showToast("Kayıt silindi.");
    }, "Kayıt Silme Onayı", "danger");
}

function render() {
    renderTable();
    renderStats();
    renderChart();
}

function renderTable() {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';

    if (appState.records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    <div class="empty-state">
                        <i class="fa-solid fa-folder-open"></i>
                        <p>Henüz eklenmiş bir kredi veya taksit kaydı bulunmuyor.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    appState.records.forEach(rec => {
        syncRecordLastPaymentMonth(rec);
        const monthlyPayment = rec.totalAmount / rec.installmentCount;
        const progressPercent = Math.round((rec.paidInstallments / rec.installmentCount) * 100);
        const isCompleted = rec.paidInstallments === rec.installmentCount;
        const paymentDueThisMonth = isPaymentDueThisMonth(rec);

        const closureDetails = calculateEarlyClosureDetails(rec);

        let detailSubtext = rec.notes ? escapeHtml(rec.notes) : 'Not yok';
        if (rec.netAmount && rec.interestRate) {
            detailSubtext = `Çekilen Net: ${formatCurrency(rec.netAmount)} ₺ | Faiz: %${rec.interestRate} | ${detailSubtext}`;
        }

        const tr = document.createElement('tr');
        tr.classList.add('record-row');
        tr.classList.toggle('payment-due', paymentDueThisMonth);
        tr.addEventListener('click', (e) => {
            if (!e.target.closest('button')) openRecordDetailsModal(rec.id);
        });
        tr.innerHTML = `
            <td>
                <strong style="color: var(--text-primary); font-size: 0.95rem; font-weight:800;">${escapeHtml(rec.title)}</strong>
                ${paymentDueThisMonth ? '<div class="payment-due-indicator"><i class="fa-solid fa-triangle-exclamation"></i> Bu ay ödeme bekliyor</div>' : ''}
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top:2px; font-weight:600;">${detailSubtext}</div>
            </td>
            <td><span class="badge badge-indigo">${rec.category}</span></td>
            <td><strong style="font-weight:800;">${formatCurrency(monthlyPayment)} ₺</strong></td>
            <td>
                <span style="font-weight:700; color: var(--text-primary);">${escapeHtml(getRecordLastPaidMonthLabel(rec))}</span>
            </td>
            <td>
                <span style="font-weight:700; color: var(--text-primary);">${escapeHtml(getRecordFinalPaymentMonthLabel(rec))}</span>
            </td>
            <td style="min-width: 130px;">
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700;">
                    <span>${rec.paidInstallments} / ${rec.installmentCount} Taksit</span>
                    <span>%${progressPercent}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%; background-color: ${isCompleted ? 'var(--success)' : 'var(--accent-primary)'};"></div>
                </div>
            </td>
            <td>
                <span style="color: var(--text-primary); font-weight: 800;">${formatCurrency(isCompleted ? 0 : closureDetails.remainingPrincipal)} ₺</span>
            </td>
            <td>
                <span style="color: ${isCompleted ? 'var(--success)' : 'var(--danger)'}; font-weight: 900;">
                    ${formatCurrency(isCompleted ? 0 : closureDetails.closureToday)} ₺
                </span>
                ${!isCompleted && closureDetails.elapsedDays > 0 ? `<div style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">+${closureDetails.elapsedDays} gün faiz dahil</div>` : ''}
            </td>
            <td>
                ${isCompleted 
                    ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Tamamlandı</span>' 
                    : '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Devam Ediyor</span>'}
            </td>
            <td>
                <div class="action-btns">
                    <button class="icon-btn" title="Taksit Öde (+1)" onclick="incrementPaid('${rec.id}')" ${isCompleted ? 'disabled style="opacity:0.5;"' : ''}>
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <button class="icon-btn edit" title="Düzenle" onclick="editRecordModal('${rec.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="icon-btn delete" title="Sil" onclick="deleteRecord('${rec.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderStats() {
    let totalDebt = 0;
    let monthlyPaymentTotal = 0;
    let totalPaid = 0;
    let totalRemainingPrincipal = 0;
    let totalClosureToday = 0;

    appState.records.forEach(rec => {
        totalDebt += rec.totalAmount;
        const monthly = rec.totalAmount / rec.installmentCount;
        
        if (rec.paidInstallments < rec.installmentCount) {
            monthlyPaymentTotal += monthly;
            
            const closureDetails = calculateEarlyClosureDetails(rec);
            totalRemainingPrincipal += closureDetails.remainingPrincipal;
            totalClosureToday += closureDetails.closureToday;
        }
        
        totalPaid += monthly * rec.paidInstallments;
    });

    const remainingDebt = totalDebt - totalPaid;

    document.getElementById('statTotalDebt').innerText = `${formatCurrency(totalDebt)} ₺`;
    document.getElementById('statMonthlyPayment').innerText = `${formatCurrency(monthlyPaymentTotal)} ₺`;
    document.getElementById('statRemainingPrincipal').innerText = `${formatCurrency(totalRemainingPrincipal)} ₺`;
    document.getElementById('statClosureToday').innerText = `${formatCurrency(totalClosureToday)} ₺`;
    document.getElementById('statTotalPaid').innerText = `${formatCurrency(totalPaid)} ₺`;
    document.getElementById('statRemainingDebt').innerText = `${formatCurrency(remainingDebt)} ₺`;
}

function initChart() {
    const ctx = document.getElementById('debtChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#6366f1',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4',
                    '#ec4899',
                    '#84cc16'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 0,
                    right: 55, // Grafikle sağdaki açıklamalar arasındaki yatay boşluk
                    top: 0,
                    bottom: 0
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim(),
                        font: { family: 'Plus Jakarta Sans', size: 13, weight: '800' },
                        boxWidth: 12,
                        padding: 10 // Açıklamalar (satırlar) arasındaki dikey boşluk
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function renderChart() {
    if (!chartInstance) return;

    const categoryTotals = {};
    appState.records.forEach(rec => {
        const remaining = rec.totalAmount - ((rec.totalAmount / rec.installmentCount) * rec.paidInstallments);
        if (remaining > 0) {
            categoryTotals[rec.category] = (categoryTotals[rec.category] || 0) + remaining;
        }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    chartInstance.data.labels = labels.length ? labels : ['Kayıt Yok'];
    chartInstance.data.datasets[0].data = data.length ? data : [1];
    chartInstance.update();
}

function updateChartColors() {
    if (chartInstance) {
        chartInstance.options.plugins.legend.labels.color = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();
        chartInstance.update();
    }
}

function formatCurrency(val) {
    return val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.innerText = msg;
    if (isError) {
        toastIcon.className = "fa-solid fa-circle-exclamation";
        toastIcon.style.color = "var(--danger)";
    } else {
        toastIcon.className = "fa-solid fa-circle-check";
        toastIcon.style.color = "var(--success)";
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}
