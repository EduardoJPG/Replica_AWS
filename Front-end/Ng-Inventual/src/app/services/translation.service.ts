import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'en' | 'tr' | 'es' | 'fr';

type TranslationMap = Record<string, Partial<Record<AppLanguage, string>>>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly storageKey = 'inventual-language';
  private readonly defaultLanguage: AppLanguage = 'en';
  private observer?: MutationObserver;
  private translating = false;
  private readonly languageSubject = new BehaviorSubject<AppLanguage>(this.getStoredLanguage());

  language$ = this.languageSubject.asObservable();

  private readonly translations: TranslationMap = {
    'Template Settings': { es: 'Configuracion de plantilla', tr: 'Sablon Ayarlari', fr: 'Parametres du modele' },
    'Dashboard': { es: 'Panel principal', tr: 'Kontrol Paneli', fr: 'Tableau de bord' },
    'Product': { es: 'Producto', tr: 'Urun', fr: 'Produit' },
    'Products': { es: 'Productos', tr: 'Urunler', fr: 'Produits' },
    'Product List': { es: 'Lista de productos', tr: 'Urun Listesi', fr: 'Liste des produits' },
    'Add Product': { es: 'Agregar producto', tr: 'Urun Ekle', fr: 'Ajouter un produit' },
    'Import Product': { es: 'Importar producto', tr: 'Urun Ice Aktar', fr: 'Importer un produit' },
    'Importing...': { es: 'Importando...', tr: 'Ice aktariliyor...', fr: 'Importation...' },
    'Edit Product': { es: 'Editar producto', tr: 'Urunu Duzenle', fr: 'Modifier le produit' },
    'Add Products': { es: 'Agregar productos', tr: 'Urun Ekle', fr: 'Ajouter des produits' },
    'Create Product': { es: 'Crear producto', tr: 'Urun Olustur', fr: 'Creer le produit' },
    'Update Product': { es: 'Actualizar producto', tr: 'Urunu Guncelle', fr: 'Mettre a jour le produit' },
    'User Management': { es: 'Gestion de usuarios', tr: 'Kullanici Yonetimi', fr: 'Gestion des utilisateurs' },
    'User List': { es: 'Lista de usuarios', tr: 'Kullanici Listesi', fr: 'Liste des utilisateurs' },
    'Add User': { es: 'Agregar usuario', tr: 'Kullanici Ekle', fr: 'Ajouter un utilisateur' },
    'Create User': { es: 'Crear usuario', tr: 'Kullanici Olustur', fr: 'Creer un utilisateur' },
    'Update User': { es: 'Actualizar usuario', tr: 'Kullaniciyi Guncelle', fr: 'Mettre a jour l utilisateur' },
    'Create Role': { es: 'Crear rol', tr: 'Rol Olustur', fr: 'Creer un role' },
    'Update Role': { es: 'Actualizar rol', tr: 'Rolu Guncelle', fr: 'Mettre a jour le role' },
    'Role List': { es: 'Lista de roles', tr: 'Rol Listesi', fr: 'Liste des roles' },
    'Role': { es: 'Rol', tr: 'Rol', fr: 'Role' },
    'Description': { es: 'Descripcion', tr: 'Aciklama', fr: 'Description' },
    'Name': { es: 'Nombre', tr: 'Ad', fr: 'Nom' },
    'Full name': { es: 'Nombre completo', tr: 'Tam ad', fr: 'Nom complet' },
    'Username': { es: 'Usuario', tr: 'Kullanici adi', fr: 'Nom d utilisateur' },
    'Password': { es: 'Contrasena', tr: 'Sifre', fr: 'Mot de passe' },
    'Email': { es: 'Correo', tr: 'E-posta', fr: 'E-mail' },
    'Phone': { es: 'Telefono', tr: 'Telefon', fr: 'Telephone' },
    'Status': { es: 'Estado', tr: 'Durum', fr: 'Statut' },
    'Action': { es: 'Accion', tr: 'Islem', fr: 'Action' },
    'Actions': { es: 'Acciones', tr: 'Islemler', fr: 'Actions' },
    'View List': { es: 'Ver lista', tr: 'Listeyi gor', fr: 'Voir la liste' },
    'Filter': { es: 'Filtro', tr: 'Filtre', fr: 'Filtre' },
    'Search here': { es: 'Buscar aqui', tr: 'Burada ara', fr: 'Rechercher ici' },
    'Scan barcode or search by name': { es: 'Escanea codigo de barra o busca por nombre', tr: 'Barkod tara veya ada gore ara', fr: 'Scanner le code-barres ou chercher par nom' },
    'Category': { es: 'Categoria', tr: 'Kategori', fr: 'Categorie' },
    'Sub-Category': { es: 'Subcategoria', tr: 'Alt Kategori', fr: 'Sous-categorie' },
    'Brand': { es: 'Marca', tr: 'Marka', fr: 'Marque' },
    'Unit': { es: 'Unidad', tr: 'Birim', fr: 'Unite' },
    'Variant': { es: 'Variante', tr: 'Varyant', fr: 'Variante' },
    'Stock': { es: 'Stock', tr: 'Stok', fr: 'Stock' },
    'Price': { es: 'Precio', tr: 'Fiyat', fr: 'Prix' },
    'Code': { es: 'Codigo', tr: 'Kod', fr: 'Code' },
    'Image': { es: 'Imagen', tr: 'Gorsel', fr: 'Image' },
    'Unit/Value': { es: 'Unidad/Valor', tr: 'Birim/Deger', fr: 'Unite/Valeur' },
    'Generate Barcode': { es: 'Generar codigo de barras', tr: 'Barkod Olustur', fr: 'Generer un code-barres' },
    'Add Adjustment': { es: 'Agregar ajuste', tr: 'Ayarlama Ekle', fr: 'Ajouter un ajustement' },
    'Adjustment': { es: 'Ajuste', tr: 'Ayarlama', fr: 'Ajustement' },
    'Adjustments': { es: 'Ajustes', tr: 'Ayarlamalar', fr: 'Ajustements' },
    'Adjustment Details': { es: 'Detalle del ajuste', tr: 'Ayarlama Detaylari', fr: 'Details de l ajustement' },
    'Select Product': { es: 'Seleccionar producto', tr: 'Urun Sec', fr: 'Selectionner un produit' },
    'Scan or search products by name/code': { es: 'Escanea o busca productos por nombre/codigo', tr: 'Urunleri ad/kod ile tara veya ara', fr: 'Scanner ou rechercher des produits par nom/code' },
    'Adjustment notes': { es: 'Notas del ajuste', tr: 'Ayarlama notlari', fr: 'Notes de l ajustement' },
    'Remarks': { es: 'Observaciones', tr: 'Notlar', fr: 'Remarques' },
    'Reference': { es: 'Referencia', tr: 'Referans', fr: 'Reference' },
    'Items': { es: 'Productos', tr: 'Kalemler', fr: 'Articles' },
    'items': { es: 'productos', tr: 'kalem', fr: 'articles' },
    'Current Stock': { es: 'Stock actual', tr: 'Mevcut stok', fr: 'Stock actuel' },
    'Quantity': { es: 'Cantidad', tr: 'Miktar', fr: 'Quantite' },
    'Qty': { es: 'Cant.', tr: 'Miktar', fr: 'Qte' },
    'Type': { es: 'Tipo', tr: 'Tip', fr: 'Type' },
    'Addition': { es: 'Entrada', tr: 'Ekleme', fr: 'Ajout' },
    'Subtraction': { es: 'Salida', tr: 'Cikarma', fr: 'Soustraction' },
    'Mixed/Subtraction': { es: 'Mixto/Salida', tr: 'Karisik/Cikarma', fr: 'Mixte/Soustraction' },
    'Saving...': { es: 'Guardando...', tr: 'Kaydediliyor...', fr: 'Enregistrement...' },
    'View Details': { es: 'Ver detalle', tr: 'Detaylari Gor', fr: 'Voir les details' },
    'Deactivate': { es: 'Desactivar', tr: 'Pasif Yap', fr: 'Desactiver' },
    'No selected products': { es: 'No hay productos seleccionados', tr: 'Secili urun yok', fr: 'Aucun produit selectionne' },
    'Trading': { es: 'Comercio', tr: 'Ticaret', fr: 'Commerce' },
    'Sales': { es: 'Ventas', tr: 'Satislar', fr: 'Ventes' },
    'New Sales': { es: 'Nueva venta', tr: 'Yeni Satis', fr: 'Nouvelle vente' },
    'POS Sales': { es: 'Venta POS', tr: 'POS Satis', fr: 'Vente POS' },
    'POS Sale': { es: 'Venta POS', tr: 'POS Satis', fr: 'Vente POS' },
    'Add New Sale': { es: 'Agregar nueva venta', tr: 'Yeni Satis Ekle', fr: 'Ajouter une nouvelle vente' },
    'Sales List': { es: 'Lista de ventas', tr: 'Satis Listesi', fr: 'Liste des ventes' },
    'Sales Returns': { es: 'Devoluciones de ventas', tr: 'Satis Iadeleri', fr: 'Retours de ventes' },
    'Purchase': { es: 'Compras', tr: 'Satinalma', fr: 'Achat' },
    'Add Purchase': { es: 'Agregar compra', tr: 'Satinalma Ekle', fr: 'Ajouter un achat' },
    'Manage Purchase': { es: 'Gestionar compras', tr: 'Satinalma Yonetimi', fr: 'Gerer les achats' },
    'Purchase Returns': { es: 'Devoluciones de compras', tr: 'Satinalma Iadeleri', fr: 'Retours d achats' },
    'Invoice/Billing': { es: 'Factura/Facturacion', tr: 'Fatura/Faturalandirma', fr: 'Facture/Facturation' },
    'Sale Invoice': { es: 'Factura de venta', tr: 'Satis Faturasi', fr: 'Facture de vente' },
    'Sale List Invoice': { es: 'Lista de facturas de venta', tr: 'Satis Fatura Listesi', fr: 'Liste des factures de vente' },
    'Purchase Invoice': { es: 'Factura de compra', tr: 'Satinalma Faturasi', fr: 'Facture d achat' },
    'Purchase List Invoice': { es: 'Lista de facturas de compra', tr: 'Satinalma Fatura Listesi', fr: 'Liste des factures d achat' },
    'Expense Invoice': { es: 'Factura de gasto', tr: 'Gider Faturasi', fr: 'Facture de depense' },
    'Expense List Invoice': { es: 'Lista de facturas de gasto', tr: 'Gider Fatura Listesi', fr: 'Liste des factures de depense' },
    'Expesne': { es: 'Gastos', tr: 'Giderler', fr: 'Depenses' },
    'Expense': { es: 'Gasto', tr: 'Gider', fr: 'Depense' },
    'Add Expense': { es: 'Agregar gasto', tr: 'Gider Ekle', fr: 'Ajouter une depense' },
    'Gastos': { en: 'Expenses', tr: 'Giderler', fr: 'Depenses' },
    'Expense Category': { es: 'Categoria de gasto', tr: 'Gider Kategorisi', fr: 'Categorie de depense' },
    'Payment Expense': { es: 'Pago de gasto', tr: 'Gider Odeme', fr: 'Paiement de depense' },
    'People': { es: 'Personas', tr: 'Kisiler', fr: 'Personnes' },
    'Add Customer': { es: 'Agregar cliente', tr: 'Musteri Ekle', fr: 'Ajouter un client' },
    'Customer List': { es: 'Lista de clientes', tr: 'Musteri Listesi', fr: 'Liste des clients' },
    'Add Supplier': { es: 'Agregar proveedor', tr: 'Tedarikci Ekle', fr: 'Ajouter un fournisseur' },
    'Supplier List': { es: 'Lista de proveedores', tr: 'Tedarikci Listesi', fr: 'Liste des fournisseurs' },
    'Add Biller': { es: 'Agregar facturador', tr: 'Faturaci Ekle', fr: 'Ajouter un facturier' },
    'Biller List': { es: 'Lista de facturadores', tr: 'Faturaci Listesi', fr: 'Liste des facturiers' },
    'Supplier': { es: 'Proveedor', tr: 'Tedarikci', fr: 'Fournisseur' },
    'Biller': { es: 'Facturador', tr: 'Faturaci', fr: 'Facturier' },
    'Billers': { es: 'Facturadores', tr: 'Faturacilar', fr: 'Facturiers' },
    'Add Biller / Seller': { es: 'Agregar facturador', tr: 'Faturaci Ekle', fr: 'Ajouter un facturier' },
    'Create Supplier': { es: 'Crear proveedor', tr: 'Tedarikci Olustur', fr: 'Creer le fournisseur' },
    'Update Supplier': { es: 'Actualizar proveedor', tr: 'Tedarikciyi Guncelle', fr: 'Mettre a jour le fournisseur' },
    'Create Biller': { es: 'Crear facturador', tr: 'Faturaci Olustur', fr: 'Creer le facturier' },
    'Update Biller': { es: 'Actualizar facturador', tr: 'Faturaciyi Guncelle', fr: 'Mettre a jour le facturier' },
    'Edit Supplier': { es: 'Editar proveedor', tr: 'Tedarikciyi Duzenle', fr: 'Modifier le fournisseur' },
    'Deactivate Supplier': { es: 'Desactivar proveedor', tr: 'Tedarikciyi Pasif Yap', fr: 'Desactiver le fournisseur' },
    'Reactivate Supplier': { es: 'Reactivar proveedor', tr: 'Tedarikciyi Etkinlestir', fr: 'Reactiver le fournisseur' },
    'Edit Biller': { es: 'Editar facturador', tr: 'Faturaciyi Duzenle', fr: 'Modifier le facturier' },
    'Deactivate Biller': { es: 'Desactivar facturador', tr: 'Faturaciyi Pasif Yap', fr: 'Desactiver le facturier' },
    'Reactivate Biller': { es: 'Reactivar facturador', tr: 'Faturaciyi Etkinlestir', fr: 'Reactiver le facturier' },
    'Supplier Code': { es: 'Codigo proveedor', tr: 'Tedarikci kodu', fr: 'Code fournisseur' },
    'Biller Code': { es: 'Codigo facturador', tr: 'Faturaci kodu', fr: 'Code facturier' },
    'NIT / RUC': { es: 'NIT / RUC', tr: 'Vergi No', fr: 'NIT / RUC' },
    'Company': { es: 'Compania', tr: 'Sirket', fr: 'Entreprise' },
    'Country': { es: 'Pais', tr: 'Ulke', fr: 'Pays' },
    'City': { es: 'Ciudad', tr: 'Sehir', fr: 'Ville' },
    'Address': { es: 'Direccion', tr: 'Adres', fr: 'Adresse' },
    'Search biller': { es: 'Buscar facturador', tr: 'Faturaci ara', fr: 'Rechercher un facturier' },
    'No billers registered': { es: 'No hay facturadores registrados', tr: 'Kayitli faturaci yok', fr: 'Aucun facturier enregistre' },
    'Sure deactivate supplier?': { es: 'Seguro que deseas desactivar este proveedor?', tr: 'Bu tedarikciyi pasif yapmak istediginize emin misiniz?', fr: 'Voulez-vous vraiment desactiver ce fournisseur ?' },
    'Sure reactivate supplier?': { es: 'Seguro que deseas reactivar este proveedor?', tr: 'Bu tedarikciyi etkinlestirmek istediginize emin misiniz?', fr: 'Voulez-vous vraiment reactiver ce fournisseur ?' },
    'Sure deactivate biller?': { es: 'Seguro que deseas desactivar este facturador?', tr: 'Bu faturaciyi pasif yapmak istediginize emin misiniz?', fr: 'Voulez-vous vraiment desactiver ce facturier ?' },
    'Sure reactivate biller?': { es: 'Seguro que deseas reactivar este facturador?', tr: 'Bu faturaciyi etkinlestirmek istediginize emin misiniz?', fr: 'Voulez-vous vraiment reactiver ce facturier ?' },
    'Supplier deactivated successfully': { es: 'Proveedor desactivado correctamente', tr: 'Tedarikci basariyla pasif yapildi', fr: 'Fournisseur desactive correctement' },
    'Supplier reactivated successfully': { es: 'Proveedor reactivado correctamente', tr: 'Tedarikci basariyla etkinlestirildi', fr: 'Fournisseur reactive correctement' },
    'Biller deactivated successfully': { es: 'Facturador desactivado correctamente', tr: 'Faturaci basariyla pasif yapildi', fr: 'Facturier desactive correctement' },
    'Biller reactivated successfully': { es: 'Facturador reactivado correctamente', tr: 'Faturaci basariyla etkinlestirildi', fr: 'Facturier reactive correctement' },
    'Supplier created successfully': { es: 'Proveedor creado correctamente', tr: 'Tedarikci basariyla olusturuldu', fr: 'Fournisseur cree correctement' },
    'Supplier updated successfully': { es: 'Proveedor actualizado correctamente', tr: 'Tedarikci basariyla guncellendi', fr: 'Fournisseur mis a jour correctement' },
    'Biller created successfully': { es: 'Facturador creado correctamente', tr: 'Faturaci basariyla olusturuldu', fr: 'Facturier cree correctement' },
    'Biller updated successfully': { es: 'Facturador actualizado correctamente', tr: 'Faturaci basariyla guncellendi', fr: 'Facturier mis a jour correctement' },
    'Error loading supplier': { es: 'Error al cargar proveedor', tr: 'Tedarikci yuklenirken hata', fr: 'Erreur lors du chargement du fournisseur' },
    'Error saving supplier': { es: 'Error al guardar proveedor', tr: 'Tedarikci kaydedilirken hata', fr: 'Erreur lors de l enregistrement du fournisseur' },
    'Error updating supplier': { es: 'Error al actualizar proveedor', tr: 'Tedarikci guncellenirken hata', fr: 'Erreur lors de la mise a jour du fournisseur' },
    'Error loading suppliers': { es: 'Error al cargar proveedores', tr: 'Tedarikciler yuklenirken hata', fr: 'Erreur lors du chargement des fournisseurs' },
    'Error deactivating supplier': { es: 'Error al desactivar proveedor', tr: 'Tedarikci pasif yapilirken hata', fr: 'Erreur lors de la desactivation du fournisseur' },
    'Error reactivating supplier': { es: 'Error al reactivar proveedor', tr: 'Tedarikci etkinlestirilirken hata', fr: 'Erreur lors de la reactivation du fournisseur' },
    'Error saving biller': { es: 'Error al guardar facturador', tr: 'Faturaci kaydedilirken hata', fr: 'Erreur lors de l enregistrement du facturier' },
    'Error updating biller': { es: 'Error al actualizar facturador', tr: 'Faturaci guncellenirken hata', fr: 'Erreur lors de la mise a jour du facturier' },
    'Error loading billers': { es: 'Error al cargar facturadores', tr: 'Faturacilar yuklenirken hata', fr: 'Erreur lors du chargement des facturiers' },
    'Error deactivating biller': { es: 'Error al desactivar facturador', tr: 'Faturaci pasif yapilirken hata', fr: 'Erreur lors de la desactivation du facturier' },
    'Error reactivating biller': { es: 'Error al reactivar facturador', tr: 'Faturaci etkinlestirilirken hata', fr: 'Erreur lors de la reactivation du facturier' },
    'No permission to edit suppliers': { es: 'No tienes permiso para editar proveedores', tr: 'Tedarikcileri duzenleme izniniz yok', fr: 'Vous n avez pas la permission de modifier les fournisseurs' },
    'No permission to deactivate suppliers': { es: 'No tienes permiso para desactivar proveedores', tr: 'Tedarikcileri pasif yapma izniniz yok', fr: 'Vous n avez pas la permission de desactiver les fournisseurs' },
    'No permission to reactivate suppliers': { es: 'No tienes permiso para reactivar proveedores', tr: 'Tedarikcileri etkinlestirme izniniz yok', fr: 'Vous n avez pas la permission de reactiver les fournisseurs' },
    'No permission to edit billers': { es: 'No tienes permiso para editar facturadores', tr: 'Faturacilari duzenleme izniniz yok', fr: 'Vous n avez pas la permission de modifier les facturiers' },
    'No permission to deactivate billers': { es: 'No tienes permiso para desactivar facturadores', tr: 'Faturacilari pasif yapma izniniz yok', fr: 'Vous n avez pas la permission de desactiver les facturiers' },
    'No permission to reactivate billers': { es: 'No tienes permiso para reactivar facturadores', tr: 'Faturacilari etkinlestirme izniniz yok', fr: 'Vous n avez pas la permission de reactiver les facturiers' },
    'Do you want to update the information?': { es: 'Deseas actualizar la informacion?', tr: 'Bilgileri guncellemek istiyor musunuz?', fr: 'Voulez-vous mettre a jour les informations ?' },
    'Close': { es: 'Cerrar', tr: 'Kapat', fr: 'Fermer' },
    'Transfer': { es: 'Transferencia', tr: 'Transfer', fr: 'Transfert' },
    'Add Transfer': { es: 'Agregar transferencia', tr: 'Transfer Ekle', fr: 'Ajouter un transfert' },
    'Transfer List': { es: 'Lista de transferencias', tr: 'Transfer Listesi', fr: 'Liste des transferts' },
    'Reports': { es: 'Reportes', tr: 'Raporlar', fr: 'Rapports' },
    'Sales Report': { es: 'Reporte de ventas', tr: 'Satis Raporu', fr: 'Rapport des ventes' },
    'Purchase Report': { es: 'Reporte de compras', tr: 'Satinalma Raporu', fr: 'Rapport des achats' },
    'Payment Report': { es: 'Reporte de pagos', tr: 'Odeme Raporu', fr: 'Rapport des paiements' },
    'Product Report': { es: 'Reporte de productos', tr: 'Urun Raporu', fr: 'Rapport des produits' },
    'Stock Report': { es: 'Reporte de stock', tr: 'Stok Raporu', fr: 'Rapport de stock' },
    'Expense Report': { es: 'Reporte de gastos', tr: 'Gider Raporu', fr: 'Rapport des depenses' },
    'User Report': { es: 'Reporte de usuarios', tr: 'Kullanici Raporu', fr: 'Rapport des utilisateurs' },
    'Customer Report': { es: 'Reporte de clientes', tr: 'Musteri Raporu', fr: 'Rapport des clients' },
    'Warehouse Report': { es: 'Reporte de bodega', tr: 'Depo Raporu', fr: 'Rapport d entrepot' },
    'Supplier Report': { es: 'Reporte de proveedores', tr: 'Tedarikci Raporu', fr: 'Rapport des fournisseurs' },
    'Discount Report': { es: 'Reporte de descuentos', tr: 'Indirim Raporu', fr: 'Rapport des remises' },
    'Tax Report': { es: 'Reporte de impuestos', tr: 'Vergi Raporu', fr: 'Rapport des taxes' },
    'Shipping Charge': { es: 'Cargo de envio', tr: 'Kargo Ucreti', fr: 'Frais de livraison' },
    'Warehouse': { es: 'Bodega', tr: 'Depo', fr: 'Entrepot' },
    'Warehouse List': { es: 'Lista de bodegas', tr: 'Depo Listesi', fr: 'Liste des entrepots' },
    'Add Warehouse': { es: 'Agregar bodega', tr: 'Depo Ekle', fr: 'Ajouter un entrepot' },
    'Create Warehouse': { es: 'Crear bodega', tr: 'Depo Olustur', fr: 'Creer l entrepot' },
    'Update Warehouse': { es: 'Actualizar bodega', tr: 'Depoyu Guncelle', fr: 'Mettre a jour l entrepot' },
    'Edit Warehouse': { es: 'Editar bodega', tr: 'Depoyu Duzenle', fr: 'Modifier l entrepot' },
    'Deactivate Warehouse': { es: 'Desactivar bodega', tr: 'Depoyu Pasif Yap', fr: 'Desactiver l entrepot' },
    'Reactivate Warehouse': { es: 'Reactivar bodega', tr: 'Depoyu Etkinlestir', fr: 'Reactiver l entrepot' },
    'Zip': { es: 'Codigo postal', tr: 'Posta kodu', fr: 'Code postal' },
    'Warehouse name required': { es: 'El nombre de la bodega es obligatorio', tr: 'Depo adi zorunludur', fr: 'Le nom de l entrepot est obligatoire' },
    'Warehouse created successfully': { es: 'Bodega creada correctamente', tr: 'Depo basariyla olusturuldu', fr: 'Entrepot cree correctement' },
    'Warehouse updated successfully': { es: 'Bodega actualizada correctamente', tr: 'Depo basariyla guncellendi', fr: 'Entrepot mis a jour correctement' },
    'Warehouse deactivated successfully': { es: 'Bodega desactivada correctamente', tr: 'Depo basariyla pasif yapildi', fr: 'Entrepot desactive correctement' },
    'Warehouse reactivated successfully': { es: 'Bodega reactivada correctamente', tr: 'Depo basariyla etkinlestirildi', fr: 'Entrepot reactive correctement' },
    'Sure deactivate warehouse?': { es: 'Seguro que deseas desactivar esta bodega?', tr: 'Bu depoyu pasif yapmak istediginize emin misiniz?', fr: 'Voulez-vous vraiment desactiver cet entrepot ?' },
    'Sure reactivate warehouse?': { es: 'Seguro que deseas reactivar esta bodega?', tr: 'Bu depoyu etkinlestirmek istediginize emin misiniz?', fr: 'Voulez-vous vraiment reactiver cet entrepot ?' },
    'Error loading warehouses': { es: 'Error al cargar bodegas', tr: 'Depolar yuklenirken hata', fr: 'Erreur lors du chargement des entrepots' },
    'Error saving warehouse': { es: 'Error al guardar bodega', tr: 'Depo kaydedilirken hata', fr: 'Erreur lors de l enregistrement de l entrepot' },
    'Error updating warehouse': { es: 'Error al actualizar bodega', tr: 'Depo guncellenirken hata', fr: 'Erreur lors de la mise a jour de l entrepot' },
    'Error deactivating warehouse': { es: 'Error al desactivar bodega', tr: 'Depo pasif yapilirken hata', fr: 'Erreur lors de la desactivation de l entrepot' },
    'Error reactivating warehouse': { es: 'Error al reactivar bodega', tr: 'Depo etkinlestirilirken hata', fr: 'Erreur lors de la reactivation de l entrepot' },
    'No permission to edit warehouses': { es: 'No tienes permiso para editar bodegas', tr: 'Depolari duzenleme izniniz yok', fr: 'Vous n avez pas la permission de modifier les entrepots' },
    'No permission to deactivate warehouses': { es: 'No tienes permiso para desactivar bodegas', tr: 'Depolari pasif yapma izniniz yok', fr: 'Vous n avez pas la permission de desactiver les entrepots' },
    'No permission to reactivate warehouses': { es: 'No tienes permiso para reactivar bodegas', tr: 'Depolari etkinlestirme izniniz yok', fr: 'Vous n avez pas la permission de reactiver les entrepots' },
    'Administrative Tools': { es: 'Herramientas administrativas', tr: 'Yonetim Araclari', fr: 'Outils administratifs' },
    'Audit Logs': { es: 'Auditoria', tr: 'Denetim Kayitlari', fr: 'Journaux d audit' },
    'System': { es: 'Sistema', tr: 'Sistem', fr: 'Systeme' },
    'From date': { es: 'Fecha desde', tr: 'Baslangic tarihi', fr: 'Date de debut' },
    'To date': { es: 'Fecha hasta', tr: 'Bitis tarihi', fr: 'Date de fin' },
    'All categories': { es: 'Todas las categorias', tr: 'Tum kategoriler', fr: 'Toutes les categories' },
    'All actions': { es: 'Todas las acciones', tr: 'Tum islemler', fr: 'Toutes les actions' },
    'User ID': { es: 'ID de usuario', tr: 'Kullanici ID', fr: 'ID utilisateur' },
    'Clear': { es: 'Limpiar', tr: 'Temizle', fr: 'Effacer' },
    'Date': { es: 'Fecha', tr: 'Tarih', fr: 'Date' },
    'User': { es: 'Usuario', tr: 'Kullanici', fr: 'Utilisateur' },
    'Method': { es: 'Metodo', tr: 'Yontem', fr: 'Methode' },
    'Route': { es: 'Ruta', tr: 'Rota', fr: 'Route' },
    'Detail': { es: 'Detalle', tr: 'Detay', fr: 'Detail' },
    'records': { es: 'registros', tr: 'kayit', fr: 'enregistrements' },
    'Edit User': { es: 'Editar usuario', tr: 'Kullaniciyi Duzenle', fr: 'Modifier l utilisateur' },
    'Deactivate User': { es: 'Desactivar usuario', tr: 'Kullaniciyi Pasif Yap', fr: 'Desactiver l utilisateur' },
    'Reactivate User': { es: 'Reactivar usuario', tr: 'Kullaniciyi Etkinlestir', fr: 'Reactiver l utilisateur' },
    'Deactivate Product': { es: 'Desactivar producto', tr: 'Urunu Pasif Yap', fr: 'Desactiver le produit' },
    'Reactivate Product': { es: 'Reactivar producto', tr: 'Urunu Etkinlestir', fr: 'Reactiver le produit' },
    'Edit Brand': { es: 'Editar marca', tr: 'Markayi Duzenle', fr: 'Modifier la marque' },
    'Delete Brand': { es: 'Eliminar marca', tr: 'Markayi Sil', fr: 'Supprimer la marque' },
    'Profile': { es: 'Perfil', tr: 'Profil', fr: 'Profil' },
    'Logout': { es: 'Cerrar sesion', tr: 'Cikis Yap', fr: 'Se deconnecter' },
    'Photo': { es: 'Foto', tr: 'Fotograf', fr: 'Photo' },
    'Remove': { es: 'Quitar', tr: 'Kaldir', fr: 'Retirer' },
    'Select Gender': { es: 'Seleccionar genero', tr: 'Cinsiyet Sec', fr: 'Selectionner le genre' },
    'Select Role': { es: 'Seleccionar rol', tr: 'Rol Sec', fr: 'Selectionner le role' },
    'Male': { es: 'Masculino', tr: 'Erkek', fr: 'Masculin' },
    'Female': { es: 'Femenino', tr: 'Kadin', fr: 'Feminin' },
    'Online': { es: 'Activo', tr: 'Aktif', fr: 'Actif' },
    'Offline': { es: 'Inactivo', tr: 'Pasif', fr: 'Inactif' },
    'Activo': { en: 'Active', tr: 'Aktif', fr: 'Actif' },
    'Inactivo': { en: 'Inactive', tr: 'Pasif', fr: 'Inactif' },
    'No data matching the filter': { es: 'No hay datos que coincidan con el filtro', tr: 'Filtreyle eslesen veri yok', fr: 'Aucune donnee ne correspond au filtre' },
    'No data found': { es: 'No se encontraron datos', tr: 'Veri bulunamadi', fr: 'Aucune donnee trouvee' },
    'No hay datos': { en: 'No data found', tr: 'Veri bulunamadi', fr: 'Aucune donnee trouvee' },
    'Nombre del producto': { en: 'Product name', tr: 'Urun adi', fr: 'Nom du produit' },
    'Codigo del producto': { en: 'Product code', tr: 'Urun kodu', fr: 'Code du produit' },
    'Categoria': { en: 'Category', tr: 'Kategori', fr: 'Categorie' },
    'Sin categoria': { en: 'No category', tr: 'Kategori yok', fr: 'Sans categorie' },
    'Marca': { en: 'Brand', tr: 'Marka', fr: 'Marque' },
    'Tipo de producto': { en: 'Product type', tr: 'Urun tipi', fr: 'Type de produit' },
    'Unidad del producto': { en: 'Product unit', tr: 'Urun birimi', fr: 'Unite du produit' },
    'Sin unidad': { en: 'No unit', tr: 'Birim yok', fr: 'Sans unite' },
    'Precio de compra': { en: 'Purchase price', tr: 'Alis fiyati', fr: 'Prix d achat' },
    'Precio de venta': { en: 'Sale price', tr: 'Satis fiyati', fr: 'Prix de vente' },
    'Impuesto del producto %': { en: 'Product tax %', tr: 'Urun vergisi %', fr: 'Taxe produit %' },
    'Descuento %': { en: 'Discount %', tr: 'Indirim %', fr: 'Remise %' },
    'Stock actual': { en: 'Current stock', tr: 'Mevcut stok', fr: 'Stock actuel' },
    'Stock minimo': { en: 'Minimum stock', tr: 'Minimum stok', fr: 'Stock minimum' },
    'Proveedor': { en: 'Supplier', tr: 'Tedarikci', fr: 'Fournisseur' },
    'Sin proveedor': { en: 'No supplier', tr: 'Tedarikci yok', fr: 'Sans fournisseur' },
    'Imagen del producto': { en: 'Product image', tr: 'Urun gorseli', fr: 'Image du produit' },
    'Seleccionar imagen': { en: 'Select image', tr: 'Gorsel sec', fr: 'Selectionner une image' },
    'Quitar imagen': { en: 'Remove image', tr: 'Gorseli kaldir', fr: 'Retirer l image' },
    'Validacion requerida': { en: 'Validation required', tr: 'Dogrulama gerekli', fr: 'Validation requise' },
    'No se puede guardar': { en: 'Cannot save', tr: 'Kaydedilemiyor', fr: 'Impossible d enregistrer' },
    'Entendido': { en: 'Understood', tr: 'Anladim', fr: 'Compris' },
  };

  get currentLanguage(): AppLanguage {
    return this.languageSubject.value;
  }

  setLanguage(language: AppLanguage) {
    this.languageSubject.next(language);
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
    window.setTimeout(() => this.translateDocument(), 0);
  }

  start(root: HTMLElement = document.body) {
    document.documentElement.lang = this.currentLanguage;
    this.translateDocument(root);

    this.observer?.disconnect();
    this.observer = new MutationObserver(() => {
      if (this.translating) {
        return;
      }

      window.setTimeout(() => this.translateDocument(root), 0);
    });

    this.observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'aria-label', 'title']
    });
  }

  translateText(value: string, language: AppLanguage = this.currentLanguage): string {
    const normalized = this.normalize(value);
    const source = this.findSourceText(normalized);

    if (!source) {
      return value;
    }

    const translated = language === 'en'
      ? source
      : this.translations[source]?.[language];

    return translated || source;
  }

  private translateDocument(root: HTMLElement = document.body) {
    this.translating = true;
    this.translateElementAttributes(root);
    this.walkTextNodes(root);
    this.translating = false;
  }

  private walkTextNodes(root: HTMLElement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        const text = this.normalize(node.textContent || '');

        if (!parent || !text || parent.closest('script, style, textarea, input, mat-icon')) {
          return NodeFilter.FILTER_REJECT;
        }

        return this.hasTranslation(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes: Text[] = [];
    let current = walker.nextNode();

    while (current) {
      nodes.push(current as Text);
      current = walker.nextNode();
    }

    nodes.forEach(node => {
      const currentText = node.textContent || '';
      const translated = this.translateText(currentText);

      if (translated !== currentText) {
        node.textContent = currentText.replace(this.normalize(currentText), translated);
      }
    });
  }

  private translateElementAttributes(root: HTMLElement) {
    const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('[placeholder], [aria-label], [title]'))];

    elements.forEach(element => {
      ['placeholder', 'aria-label', 'title'].forEach(attribute => {
        const value = element.getAttribute(attribute);
        if (!value) {
          return;
        }

        const translated = this.translateText(value);
        if (translated !== value) {
          element.setAttribute(attribute, translated);
        }
      });
    });
  }

  private hasTranslation(text: string) {
    return !!this.findSourceText(text);
  }

  private findSourceText(text: string): string | null {
    if (this.translations[text]) {
      return text;
    }

    const entry = Object.entries(this.translations).find(([, values]) =>
      Object.values(values).includes(text)
    );

    return entry?.[0] || null;
  }

  private normalize(value: string) {
    return value.replace(/\s+/g, ' ').trim();
  }

  private getStoredLanguage(): AppLanguage {
    const savedLanguage = localStorage.getItem(this.storageKey) as AppLanguage | null;
    return savedLanguage && ['en', 'tr', 'es', 'fr'].includes(savedLanguage)
      ? savedLanguage
      : this.defaultLanguage;
  }
}
