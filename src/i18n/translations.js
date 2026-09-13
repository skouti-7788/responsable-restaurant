const translations = {
  // =========================================================
  // ENGLISH
  // =========================================================
  en: {
    Images: 'images',
    login: 'Login',
    register: 'Register new restaurant',
    loadingPreview: 'Loading preview...',
    email: 'Email',
    password: 'Password',

    restaurantName: 'Restaurant name',
    address: 'Address',
    phone: 'Phone',
    openingHours: 'Opening hours',

    dashboard: 'Dashboard',
    profile: 'Profile',
    categories: 'Categories',
    meals: 'Meals',
    orders: 'Orders',
    tables: 'Tables',
    qrCode: 'QR Code',
    appearance: 'Appearance',
    logo: 'Logo',
    headerImage: 'Header image',
    backgroundImage: 'Background image',
    primaryColor: 'Primary color',
    secondaryColor: 'Secondary color',
    textColor: 'Text color',
    backgroundColor: 'Background color',
    font: 'Font',
    remove: 'Remove',
    replace: 'Replace',
    upload: 'Upload',
    changesSavedSuccessfully: 'Changes saved successfully',
    errorSavingChanges: 'Error saving changes',

    logout: 'Logout',

    totalMeals: 'Total meals',
    totalCategories: 'Total categories',
    totalOrders: 'Total orders',
    totalTables: 'Total tables',

    availableTables: 'Available',
    occupiedTables: 'Occupied',

    menuViews: 'Menu views',
    popularMeals: 'Popular meals',
    recentActivit: 'Recent activity',

    saveChanges: 'Save changes',
    livePreview: 'Live preview',

    addCategory: 'Add category',
    editCategory: 'Edit category',
    deleteCategory: 'Delete category',

    addMeal: 'Add new meal',
    editMeal: 'Edit meal',

    // =====================================================
    // TABLES
    // =====================================================

    table: 'Table',
    tablesDescription:
      'Manage your restaurant tables and their availability.',

    addTable: 'Add table',
    editTable: 'Edit table',
    updateTable: 'Update table',
    deleteTable: 'Delete table',

    tableNumber: 'Table number',
    tableName: 'Table name',

    noTables: 'No tables yet',
    noTablesDescription:
      'Add your first table to start managing your restaurant tables.',

    addFirstTable:
      'Add your first restaurant table.',

    loadingTables: 'Loading tables...',
    loading: 'Loading...',

    refresh: 'Refresh',

    tableFormDescription:
      'Enter the information for the restaurant table.',

    qrToken: 'QR token',
    qrCodeDescription:
    'Share your digital menu with customers through a simple QR code experience.',

    loadingRestaurant: 'Loading restaurant...',

    howItWorks: 'How it works',

    createUniqueQr:
      'Create a unique QR code for your restaurant.',

    scanQrMenu:
      'Customers scan the QR code to open your digital menu.',

    updateMealsAvailability:
      'Update meals and availability from the dashboard.',
    // Bulk actions
    deleteAll: 'Delete all',
    deletingAll: 'Deleting...',
    bulkAddTitle: 'Add table',
    bulkAddDescription:
      'Enter the number of tables to add to your restaurant at once.',
    tableCount: 'Number of tables',
    tableCountPlaceholder: 'e.g. 10',
    tableCountRequired: 'Please enter a valid number of tables.',
    deleteAllTablesConfirm:
      'Are you sure you want to delete all tables',
    deleteAllTablesError:
      'Failed to delete all tables.',
    restaurantNotFound: 'Restaurant not found.',
    close: 'Close',

    // QR modal
    viewQrCode: 'View QR code',
    menuUrl: 'Menu URL',
    copied: 'Copied!',


    // Table status
    status: 'Status',
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',

    featured: 'Featured',
    availability: 'Availability',

    // Table messages
    deleteTableConfirm:
      'Are you sure you want to delete',

    tableNumberRequired:
      'Table number is required.',

    loadTablesError:
      'Failed to load tables.',

    saveTableError:
      'Failed to save table.',

    deleteTableError:
      'Failed to delete table.',

    accept: 'Accept',
    cancel: 'Cancel',

    accepted: 'Accepted',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',

    downloadQRCode: 'Download QR Code',
    copyMenuUrl: 'Copy menu URL',

    language: 'Language',

    arabic: 'Arabic',
    french: 'French',
    english: 'English',

    uploadLogo: 'Upload logo',
    uploadCover: 'Upload cover image',

    selectCategory: 'Select category',

    price: 'Price',
    description: 'Description',
    name: 'Name',
    image: 'Image',
    actions: 'Actions',
    createAccount: 'Create account',

    alreadyHaveAccount:
      'Already have an account? Login',

    // registerRestaurant:
    //   'Register restaurant',

    mealName: 'Meal name',

    customerName: 'Customer name',
    totalPrice: 'Total price',
    items: 'Items',
    orderStatus: 'Order status',

    updateProfile: 'Update profile',

    saving: 'Saving...',
    manageRestaurantDetails:
      'Manage restaurant details and media assets.',
    
    ordersDescription:
      'View real-time order flow and manage customer requests effectively.',

    noOrdersAvailable:
      'No orders available.',
    mealsDescription:
      'Build your curated meal catalog and highlight the best plates.',

    noMealsFound:
      'No meals found yet. Add a new meal to launch your menu.',
    active: 'Active',
    inactive: 'Inactive',
    chooseImage: 'Choose image',
    noFile: 'No image selected',
    categoriesDescription:
     'Create categories and organize your menu by cuisine and collection.',
    noCategoriesAdded: 'No categories added yet.',
    downloadInvoice: 'Download invoice',
    invoice: 'Invoice',
    orderNumber: 'Order number',
    date: 'Date',
    customer: 'Customer',
    quantity: 'Quantity',
    unitPrice: 'Unit price',
    total: 'Total',
    restaurant: 'Restaurant',
    managerDashboard: 'Manager Dashboard',
    weeklyPerformance: 'Weekly performance',
    live: 'Live', 
    recentActivity: 'Recent activity',
    updatesStream: 'Updates stream',
    accepting: 'Accepting...',
    cancelling: 'Cancelling...', 
    deleting: 'Deleting...', 
    colors: 'Colors',
    staff: 'Staff',
    staffDescription:
      'Manage your restaurant staff and their permissions.',

    addStaff: 'Add staff',
    addStaffDescription:
      'Create a staff account for your restaurant.',

    creatingStaff: 'Creating...',
    staffList: 'Staff list',
    noStaff: 'No staff members yet.',

    role: 'Role',
    permissions: 'Permissions',
    managePermissions: 'Manage permissions',
    savePermissions: 'Save permissions',

    selectAll: 'Select all',
    unselectAll: 'Unselect all',

    delete: 'Delete',

    staffNameRequired:
      'Staff name is required.',

    staffEmailRequired:
      'Staff email is required.',

    staffPasswordRequired:
      'Staff password is required.',

    staffPasswordMin:
      'Password must contain at least 8 characters.',

    deleteStaffConfirm:
      'Are you sure you want to delete this staff member?',

    loadStaffError:
      'Unable to load staff.',

    createStaffError:
      'Unable to create staff.',

    deleteStaffError:
      'Unable to delete staff.',

    loadPermissionsError:
      'Unable to load permissions.',

    savePermissionsError:
      'Unable to save permissions.',

    // Permissions
    permissionDashboardView:
      'View dashboard',

    permissionOrdersView:
      'View orders',
    permissionOrdersAdd:
      'Add orders',
    permissionOrdersUpdate:
      'Update orders',
    permissionOrdersDelete:
      'Delete orders',

    permissionMealsView:
      'View meals',
    permissionMealsAdd:
      'Add meals',
    permissionMealsUpdate:
      'Update meals',
    permissionMealsDelete:
      'Delete meals',

    permissionCategoriesView:
      'View categories',
    permissionCategoriesAdd:
      'Add categories',
    permissionCategoriesUpdate:
      'Update categories',
    permissionCategoriesDelete:
      'Delete categories',

    permissionTablesView:
      'View tables',
    permissionTablesAdd:
      'Add tables',
    permissionTablesUpdate:
      'Update tables',
    permissionTablesDelete:
      'Delete tables',

    permissionAppearanceView:
      'View appearance',
    permissionAppearanceUpdate:
      'Update appearance',
    permissionAppearanceDelete:
      'Delete appearance',

    permissionStaffView:
      'View staff',
    permissionStaffAdd:
      'Add staff',
    permissionStaffUpdate:
      'Update staff',
    permissionStaffDelete:
      'Delete staff',

    permissionQrCodeView:
      'View QR code',

    permissionProfileView:
      'View profile',
    permissionProfileUpdate:
      'Update profile', 
    restaurantNamePlaceholder: 'Enter your restaurant name', 
    emailPlaceholder: 'Enter your restaurant email', 
    phonePlaceholder: 'Enter your phone number', 
    addressPlaceholder: 'Enter your restaurant address',
    openingHoursPlaceholder: 'Example: Monday: 08:00-18:00, Tuesday: 08:00-18:00', 
    facebookPlaceholder: 'Enter your Facebook URL',
   },

  // =========================================================
  // FRANÇAIS
  // =========================================================
  fr: {
    login: 'Se connecter',
    register: 'Enregistrer un restaurant',

    email: 'Email',
    password: 'Mot de passe',

    restaurantName: 'Nom du restaurant',
    address: 'Adresse',
    phone: 'Téléphone',
    openingHours: 'Horaires',

    dashboard: 'Tableau de bord',
    profile: 'Profil',
    categories: 'Catégories',
    meals: 'Plats',
    orders: 'Commandes',
    tables: 'Tables',
    qrCode: 'QR Code',
    appearance: 'Apparence',
    logo: 'Logo',
    headerImage: 'Image d’en-tête',
    backgroundImage: 'Image de fond',
    primaryColor: 'Couleur principale',
    secondaryColor: 'Couleur secondaire',
    textColor: 'Couleur du texte',
    backgroundColor: 'Couleur de fond',
    font: 'Police',
    remove: 'Supprimer',
    replace: 'Remplacer',
    upload: 'Télécharger',
    changesSavedSuccessfully: 'Modifications enregistrées avec succès',
    errorSavingChanges: 'Erreur lors de l’enregistrement des modifications',
    qrCodeDescription:
      'Partagez votre menu numérique avec vos clients grâce à un simple QR code.',

    loadingRestaurant: 'Chargement du restaurant...',

    howItWorks: 'Comment ça marche ?',

    createUniqueQr:
      'Créez un QR code unique pour votre restaurant.',

    scanQrMenu:
      'Les clients scannent le QR code pour ouvrir votre menu numérique.',

    updateMealsAvailability:
      'Mettez à jour les plats et leur disponibilité depuis le tableau de bord.',
    logout: 'Se déconnecter',

    totalMeals: 'Plats totaux',
    totalCategories: 'Catégories totales',
    totalOrders: 'Commandes totales',
    totalTables: 'Nombre total de tables',

    availableTables: 'Disponibles',
    occupiedTables: 'Occupées',

    menuViews: 'Vues du menu',
    popularMeals: 'Plats populaires',
 
    saveChanges: 'Enregistrer',
    livePreview: 'Aperçu en direct',

    addCategory: 'Ajouter une catégorie',
    editCategory: 'Modifier la catégorie',
    deleteCategory: 'Supprimer la catégorie',

    addMeal: 'Ajouter un plat',
    editMeal: 'Modifier le plat',

    // =====================================================
    // TABLES
    // =====================================================

    table: 'Table',
    tablesDescription:
      'Gérez les tables de votre restaurant et leur disponibilité.',

    addTable: 'Ajouter une table',
    editTable: 'Modifier la table',
    updateTable: 'Mettre à jour la table',
    deleteTable: 'Supprimer la table',

    tableNumber: 'Numéro de table',
    tableName: 'Nom de la table',

    noTables: 'Aucune table',
    noTablesDescription:
      'Ajoutez votre première table pour commencer à gérer les tables du restaurant.',

    addFirstTable:
      'Ajoutez votre première table de restaurant.',

    loadingTables: 'Chargement des tables...',
    loading: 'Chargement...',

    refresh: 'Actualiser',

    tableFormDescription:
      'Saisissez les informations de la table du restaurant.',

    qrToken: 'Jeton QR',

    // Bulk actions
    deleteAll: 'Tout supprimer',
    deletingAll: 'Suppression...',
    bulkAddTitle: 'Ajouter une table',
    bulkAddDescription:
      'Saisissez le nombre de tables à ajouter à votre restaurant en une seule fois.',
    tableCount: 'Nombre de tables',
    tableCountPlaceholder: 'ex. 10',
    tableCountRequired: 'Veuillez saisir un nombre de tables valide.',
    deleteAllTablesConfirm:
      'Êtes-vous sûr de vouloir supprimer toutes les tables',
    deleteAllTablesError:
      'Impossible de supprimer toutes les tables.',
    restaurantNotFound: 'Restaurant introuvable.',
    close: 'Fermer',

    // QR modal
    viewQrCode: 'Voir le QR code',
    menuUrl: 'URL du menu',
    copied: 'Copié !',


    // Table status
    status: 'Statut',
    available: 'Disponible',
    occupied: 'Occupée',
    reserved: 'Réservée',

    featured: 'En vedette',
    availability: 'Disponibilité',

    // Table messages
    deleteTableConfirm:
      'Êtes-vous sûr de vouloir supprimer',

    tableNumberRequired:
      'Le numéro de table est obligatoire.',

    loadTablesError:
      'Impossible de charger les tables.',

    saveTableError:
      'Impossible d’enregistrer la table.',

    deleteTableError:
      'Impossible de supprimer la table.',

    accept: 'Accepter',
    cancel: 'Annuler',

    accepted: 'Accepté',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',

    downloadQRCode:
      'Télécharger le QR Code',

    copyMenuUrl: 'Copier l’URL',

    language: 'Langue',

    arabic: 'Arabe',
    french: 'Français',
    english: 'Anglais',

    uploadLogo: 'Télécharger le logo',
    uploadCover: 'Télécharger la couverture',

    selectCategory:
      'Sélectionner une catégorie',

    price: 'Prix',
    description: 'Description',
    name: 'Nom',
    image: 'Image',
    actions: 'Actions',
    createAccount: 'Créer un compte',
    
    alreadyHaveAccount:
      'Vous avez déjà un compte ? Se connecter',

    registerRestaurant:
      'Enregistrer le restaurant',

    mealName: 'Nom du plat',

    customerName: 'Nom du client',
    totalPrice: 'Prix total',
    items: 'Articles',
    orderStatus: 'Statut de la commande',

    updateProfile:
      'Mettre à jour le profil',

    saving: 'Enregistrement...',
    manageRestaurantDetails:   'Gérez les informations du restaurant et les éléments multimédias.',
    ordersDescription:
      'Consultez les commandes en temps réel et gérez efficacement les demandes des clients.',

    noOrdersAvailable:
      'Aucune commande disponible.',
        mealsDescription:
      'Créez votre catalogue de plats et mettez en avant vos meilleures spécialités.',

    noMealsFound:
      'Aucun plat trouvé pour le moment. Ajoutez un nouveau plat pour lancer votre menu.',
    active: 'Actif',
    inactive: 'Inactif',
    chooseImage: 'Choisir une image',
    noFile: 'Aucun une image sélectionnée',
    categoriesDescription:
    'Créez des catégories et organisez votre menu par cuisine et collection.',
    noCategoriesAdded: 'Aucune catégorie ajoutée pour le moment.',
    downloadInvoice: 'Télécharger la facture',
    invoice: 'Facture',
    orderNumber: 'Numéro de commande',
    date: 'Date',
    customer: 'Client',
    quantity: 'Quantité',
    unitPrice: 'Prix unitaire',
    total: 'Total',
    restaurant: 'Restaurant',
    managerDashboard: 'Tableau de bord du restaurant',
    weeklyPerformance: 'Performance hebdomadaire',
    live: 'En direct',
    recentActivity: 'Activité récente',
    updatesStream: 'Flux des mises à jour',
    accepting: 'Acceptation...', 
    cancelling: 'Annulation...', 
    deleting: 'Suppression...',
    loadingPreview: 'Chargement de l’aperçu...',
    colors: 'Couleurs', 
    staff: 'Personnel',
    staffDescription:
      'Gérez le personnel de votre restaurant et ses permissions.',

    addStaff: 'Ajouter un membre',
    addStaffDescription:
      'Créez un compte pour un membre du personnel.',

    creatingStaff: 'Création...',
    staffList: 'Liste du personnel',
    noStaff: 'Aucun membre du personnel.',

    role: 'Rôle',
    permissions: 'Permissions',
    managePermissions: 'Gérer les permissions',
    savePermissions: 'Enregistrer les permissions',

    selectAll: 'Tout sélectionner',
    unselectAll: 'Tout désélectionner',

    delete: 'Supprimer',

    staffNameRequired:
      'Le nom du membre est obligatoire.',

    staffEmailRequired:
      'L’adresse e-mail est obligatoire.',

    staffPasswordRequired:
      'Le mot de passe est obligatoire.',

    staffPasswordMin:
      'Le mot de passe doit contenir au moins 8 caractères.',

    deleteStaffConfirm:
      'Êtes-vous sûr de vouloir supprimer ce membre du personnel ?',

    loadStaffError:
      'Impossible de charger le personnel.',

    createStaffError:
      'Impossible de créer le membre du personnel.',

    deleteStaffError:
      'Impossible de supprimer le membre du personnel.',

    loadPermissionsError:
      'Impossible de charger les permissions.',

    savePermissionsError:
      'Impossible d’enregistrer les permissions.',

    // Permissions
    permissionDashboardView:
      'Voir le tableau de bord',

    permissionOrdersView:
      'Voir les commandes',
    permissionOrdersAdd:
      'Ajouter des commandes',
    permissionOrdersUpdate:
      'Modifier les commandes',
    permissionOrdersDelete:
      'Supprimer les commandes',

    permissionMealsView:
      'Voir les plats',
    permissionMealsAdd:
      'Ajouter des plats',
    permissionMealsUpdate:
      'Modifier les plats',
    permissionMealsDelete:
      'Supprimer les plats',

    permissionCategoriesView:
      'Voir les catégories',
    permissionCategoriesAdd:
      'Ajouter des catégories',
    permissionCategoriesUpdate:
      'Modifier les catégories',
    permissionCategoriesDelete:
      'Supprimer les catégories',

    permissionTablesView:
      'Voir les tables',
    permissionTablesAdd:
      'Ajouter des tables',
    permissionTablesUpdate:
      'Modifier les tables',
    permissionTablesDelete:
      'Supprimer les tables',

    permissionAppearanceView:
      'Voir l’apparence',
    permissionAppearanceUpdate:
      'Modifier l’apparence',
    permissionAppearanceDelete:
      'Supprimer l’apparence',

    permissionStaffView:
      'Voir le personnel',
    permissionStaffAdd:
      'Ajouter du personnel',
    permissionStaffUpdate:
      'Modifier le personnel',
    permissionStaffDelete:
      'Supprimer du personnel',

    permissionQrCodeView:
      'Voir le QR code',

    permissionProfileView:
      'Voir le profil',
    permissionProfileUpdate:
      'Modifier le profil',
    
    restaurantNamePlaceholder: 'Entrez le nom de votre restaurant', 
    emailPlaceholder: 'Entrez l’adresse e-mail de votre restaurant',
    phonePlaceholder: 'Entrez le numéro de téléphone', 
    addressPlaceholder: 'Entrez l’adresse de votre restaurant', 
    openingHoursPlaceholder: 'Exemple : Lundi : 08:00-18:00, Mardi : 08:00-18:00', 
    facebookPlaceholder: 'Entrez le lien Facebook',
    Images: 'images'
  },

  // =========================================================
  // العربية
  // =========================================================
  ar: {
    colors: 'الألوان',
    login: 'تسجيل الدخول',
    register: 'تسجيل المطعم',
    loadingPreview: 'جاري تحميل المعاينة...',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',

    restaurantName: 'اسم المطعم',
    address: 'العنوان',
    phone: 'الهاتف',
    openingHours: 'ساعات العمل',

    dashboard: 'لوحة القيادة',
    profile: 'الملف الشخصي',
    categories: 'الفئات',
    meals: 'الأطباق',
    orders: 'الطلبات',
    tables: 'الطاولات',
    qrCode: 'رمز الاستجابة السريعة',
    appearance: 'المظهر',
    logo: 'الشعار',
    headerImage: 'صورة العنوان',
    backgroundImage: 'صورة الخلفية',
    primaryColor: 'اللون الأساسي',
    secondaryColor: 'اللون الثانوي',
    textColor: 'لون النص',
    backgroundColor: 'لون الخلفية',
    font: 'الخط',
    remove: 'إزالة',
    replace: 'استبدال',
    upload: 'رفع',
    changesSavedSuccessfully: 'تم حفظ التغييرات بنجاح',
    errorSavingChanges: 'خطأ أثناء حفظ التغييرات',
    qrCodeDescription:
    'شارك قائمتك الرقمية مع العملاء من خلال تجربة بسيطة باستخدام رمز QR.',

    loadingRestaurant: 'جاري تحميل المطعم...',

    howItWorks: 'كيف يعمل؟',

    createUniqueQr:
      'أنشئ رمز QR خاصًا بمطعمك.',

    scanQrMenu:
      'يقوم العملاء بمسح رمز QR لفتح قائمتك الرقمية.',

    updateMealsAvailability:
      'قم بتحديث الأطباق وتوفرها من لوحة التحكم.',
    logout: 'تسجيل الخروج',

    totalMeals: 'إجمالي الأطباق',
    totalCategories: 'إجمالي الفئات',
    totalOrders: 'إجمالي الطلبات',
    totalTables: 'إجمالي الطاولات',

    availableTables: 'المتاحة',
    occupiedTables: 'المشغولة',

    menuViews: 'مشاهدات القائمة',
    popularMeals: 'الأطباق الشعبية',
 
    saveChanges: 'حفظ التغييرات',
    livePreview: 'معاينة مباشرة',

    addCategory: 'إضافة فئة',
    editCategory: 'تعديل الفئة',
    deleteCategory: 'حذف الفئة',

    addMeal: 'إضافة طبق جديد',
    editMeal: 'تعديل الطبق',

    // =====================================================
    // TABLES
    // =====================================================

    table: 'طاولة',

    tablesDescription:
      'إدارة طاولات مطعمك وحالة توفرها.',

    addTable: 'إضافة طاولة',
    editTable: 'تعديل الطاولة',
    updateTable: 'تحديث الطاولة',
    deleteTable: 'حذف الطاولة',

    tableNumber: 'رقم الطاولة',
    tableName: 'اسم الطاولة',

    noTables: 'لا توجد طاولات بعد',

    noTablesDescription:
      'أضف أول طاولة لبدء إدارة طاولات المطعم.',

    addFirstTable:
      'أضف أول طاولة في مطعمك.',

    loadingTables:
      'جاري تحميل الطاولات...',

    loading: 'جاري التحميل...',

    refresh: 'تحديث',

    tableFormDescription:
      'أدخل معلومات طاولة المطعم.',

    qrToken: 'رمز QR',

    // Bulk actions
    deleteAll: 'مسح الكل',
    deletingAll: 'جاري الحذف...',
    bulkAddTitle: 'إضافة طاولة',
    bulkAddDescription:
      'أدخل عدد الطاولات التي تريد إضافتها إلى مطعمك دفعة واحدة.',
    tableCount: 'عدد الطاولات',
    tableCountPlaceholder: 'مثال: 10',
    tableCountRequired: 'الرجاء إدخال عدد صحيح من الطاولات.',
    deleteAllTablesConfirm:
      'هل أنت متأكد أنك تريد حذف جميع الطاولات',
    deleteAllTablesError:
      'فشل حذف جميع الطاولات.',
    restaurantNotFound: 'المطعم غير موجود.',
    close: 'إغلاق',

    // QR modal
    viewQrCode: 'عرض رمز QR',
    menuUrl: 'رابط القائمة',
    copied: 'تم النسخ!',


    // Table status
    status: 'الحالة',
    available: 'متاحة',
    occupied: 'مشغولة',
    reserved: 'محجوزة',

    featured: 'مميز',
    availability: 'التوفر',

    // Table messages
    deleteTableConfirm:
      'هل أنت متأكد من أنك تريد حذف',

    tableNumberRequired:
      'رقم الطاولة مطلوب.',

    loadTablesError:
      'فشل تحميل الطاولات.',

    saveTableError:
      'فشل حفظ الطاولة.',

    deleteTableError:
      'فشل حذف الطاولة.',

    accept: 'قبول',
    cancel: 'إلغاء',

    accepted: 'مقبول',
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    cancelled: 'ملغي',

    downloadQRCode:
      'تحميل رمز الاستجابة السريعة',

    copyMenuUrl:
      'نسخ رابط القائمة',

    language: 'اللغة',

    arabic: 'العربية',
    french: 'الفرنسية',
    english: 'الإنجليزية',

    uploadLogo: 'رفع الشعار',
    uploadCover: 'رفع صورة الغلاف',

    selectCategory: 'اختر فئة',

    price: 'السعر',
    description: 'الوصف',
    name: 'الاسم',
    image: 'الصورة',
    actions: 'الإجراءات',

    createAccount: 'إنشاء حساب',

    alreadyHaveAccount:
      'هل لديك حساب؟ تسجيل الدخول',

    registerRestaurant:
      'سجل المطعم',

    mealName: 'اسم الطبق',

    customerName: 'اسم العميل',
    totalPrice: 'السعر الإجمالي',
    items: 'العناصر',
    orderStatus: 'حالة الطلب',

    updateProfile:
      'تحديث الملف الشخصي',

    saving: 'جاري الحفظ...',
    manageRestaurantDetails:   'إدارة معلومات المطعم ومواده الإعلامية.',
    ordersDescription:
      'تابع سير الطلبات في الوقت الفعلي وقم بإدارة طلبات العملاء بفعالية.',

    noOrdersAvailable:
      'لا توجد طلبات متاحة.',
      mealsDescription:
      'أنشئ قائمة أطباقك المميزة وسلّط الضوء على أفضل أطباقك.',

    noMealsFound:
      'لم يتم العثور على أي أطباق بعد. أضف طبقًا جديدًا لبدء قائمتك.',
    active: 'نشط',
    inactive: 'غير نشط',
    chooseImage: 'اختر صورة',
    noFile: 'لم يتم اختيار صورة',  
    categoriesDescription:
    'أنشئ الفئات ونظّم قائمتك حسب نوع المطبخ والمجموعة.', 
    noCategoriesAdded: 'لم تتم إضافة أي فئات بعد.',
    downloadInvoice: 'تحميل الفاتورة',
    invoice: 'الفاتورة',
    orderNumber: 'رقم الطلب',
    date: 'التاريخ',
    customer: 'العميل',
    quantity: 'الكمية',
    unitPrice: 'سعر الوحدة',
    total: 'المجموع',
    restaurant: 'المطعم',
    managerDashboard: 'لوحة تحكم المطعم',
    weeklyPerformance: 'الأداء الأسبوعي',
    live: 'مباشر',
    recentActivity: 'النشاط الأخير',
    updatesStream: 'سجل التحديثات',
    accepting: 'جاري القبول...', 
    cancelling: 'جاري الإلغاء...', 
    deleting: 'جاري الحذف...', 
    staff: 'الموظفون',
    staffDescription:
      'إدارة موظفي المطعم والصلاحيات الخاصة بهم.',

    addStaff: 'إضافة موظف',
    addStaffDescription:
      'إنشاء حساب لموظف في مطعمك.',

    creatingStaff: 'جاري إنشاء الموظف...',
    staffList: 'قائمة الموظفين',
    noStaff: 'لا يوجد موظفون بعد.',

    role: 'الدور',
    permissions: 'الصلاحيات',
    managePermissions: 'إدارة الصلاحيات',
    savePermissions: 'حفظ الصلاحيات',

    selectAll: 'تحديد الكل',
    unselectAll: 'إلغاء تحديد الكل',

    delete: 'حذف',

    staffNameRequired:
      'اسم الموظف مطلوب.',

    staffEmailRequired:
      'البريد الإلكتروني للموظف مطلوب.',

    staffPasswordRequired:
      'كلمة مرور الموظف مطلوبة.',

    staffPasswordMin:
      'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.',

    deleteStaffConfirm:
      'هل أنت متأكد أنك تريد حذف هذا الموظف؟',

    loadStaffError:
      'فشل تحميل الموظفين.',

    createStaffError:
      'فشل إنشاء الموظف.',

    deleteStaffError:
      'فشل حذف الموظف.',

    loadPermissionsError:
      'فشل تحميل الصلاحيات.',

    savePermissionsError:
      'فشل حفظ الصلاحيات.',

    // Permissions
    permissionDashboardView:
      'عرض لوحة التحكم',

    permissionOrdersView:
      'عرض الطلبات',
    permissionOrdersAdd:
      'إضافة الطلبات',
    permissionOrdersUpdate:
      'تعديل الطلبات',
    permissionOrdersDelete:
      'حذف الطلبات',

    permissionMealsView:
      'عرض الأطباق',
    permissionMealsAdd:
      'إضافة الأطباق',
    permissionMealsUpdate:
      'تعديل الأطباق',
    permissionMealsDelete:
      'حذف الأطباق',

    permissionCategoriesView:
      'عرض الفئات',
    permissionCategoriesAdd:
      'إضافة الفئات',
    permissionCategoriesUpdate:
      'تعديل الفئات',
    permissionCategoriesDelete:
      'حذف الفئات',

    permissionTablesView:
      'عرض الطاولات',
    permissionTablesAdd:
      'إضافة الطاولات',
    permissionTablesUpdate:
      'تعديل الطاولات',
    permissionTablesDelete:
      'حذف الطاولات',

    permissionAppearanceView:
      'عرض المظهر',
    permissionAppearanceUpdate:
      'تعديل المظهر',
    permissionAppearanceDelete:
      'حذف المظهر',

    permissionStaffView:
      'عرض الموظفين',
    permissionStaffAdd:
      'إضافة الموظفين',
    permissionStaffUpdate:
      'تعديل الموظفين',
    permissionStaffDelete:
      'حذف الموظفين',

    permissionQrCodeView:
      'عرض رمز QR',

    permissionProfileView:
      'عرض الملف الشخصي',
    permissionProfileUpdate:
      'تعديل الملف الشخصي',
    
    restaurantNamePlaceholder: 'أدخل اسم المطعم', 
    emailPlaceholder: 'أدخل البريد الإلكتروني للمطعم', 
    phonePlaceholder: 'أدخل رقم الهاتف', 
    addressPlaceholder: 'أدخل عنوان المطعم', 
    openingHoursPlaceholder: 'مثال: الإثنين: 08:00-18:00، الثلاثاء: 08:00-18:00', 
    facebookPlaceholder: 'أدخل رابط Facebook',
    Images:'الصور'
   },
}

export default translations