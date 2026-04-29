import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical,
  X, Upload, Package, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { productService } from "@/lib/productService";
import { uploadService, type UploadProgress } from "@/lib/uploadService";
import { categoryService } from "@/lib/categoryService";
import { useCollections } from "@/hooks/useCollections";
import { pagesService } from "@/lib/pagesService";
import { supabase } from "@/integrations/supabase/client";
import type { Product, AdminProduct } from "@/lib/productService";

const initialProducts: AdminProduct[] = [];

// Dynamic Page Display Component
const DynamicPageDisplay = ({ selectedPages }: { selectedPages: string[] }) => {
  const [pages, setPages] = useState<Array<{ displayId: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const allPages = await pagesService.getAllPages();
        const productPages = allPages
          .filter(page => page.path !== '/' && page.status === 'published')
          .map(page => ({
            displayId: page.path.replace('/', '').replace('-', '') || 'home',
            name: page.name
          }));
        
        const hardcodedPages = [
          { displayId: 'home', name: 'Home Page' },
          { displayId: 'safari', name: 'Safari Collection' },
          { displayId: 'paradise', name: 'Paradise Collection' },
          { displayId: 'collection2026', name: 'Collection 2026' },
          { displayId: 'clearance', name: 'Clearance Page' }
        ];
        
        const allPagesCombined = [...hardcodedPages, ...productPages];
        const uniquePages = allPagesCombined.filter((page, index, self) => 
          index === self.findIndex(p => p.displayId === page.displayId)
        );
        
        setPages(uniquePages);
      } catch (error) {
        console.error('Error loading pages:', error);
        setPages([
          { displayId: 'home', name: 'Home Page' },
          { displayId: 'safari', name: 'Safari Collection' },
          { displayId: 'paradise', name: 'Paradise Collection' },
          { displayId: 'collection2026', name: 'Collection 2026' },
          { displayId: 'clearance', name: 'Clearance Page' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  if (loading) {
    return "Loading...";
  }

  if (selectedPages.includes("all")) {
    return "All Pages";
  }

  if (selectedPages.length === 0) {
    return "No pages selected";
  }

  const selectedPageNames = selectedPages.map(pageId => {
    const page = pages.find(p => p.displayId === pageId);
    return page ? page.name : pageId;
  });

  return selectedPageNames.join(", ");
};

// Dynamic Page Selector Component
const DynamicPageSelector = ({ selectedPages, onChange }: { selectedPages: string[]; onChange: (pages: string[]) => void }) => {
  const [pages, setPages] = useState<Array<{ id: string; name: string; path: string; displayId: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPages = async () => {
      try {
        const allPages = await pagesService.getAllPages();
        // Filter for product pages and convert to display format
        const productPages = allPages
          .filter(page => page.path !== '/' && page.status === 'published')
          .map(page => ({
            id: page.id,
            name: page.name,
            path: page.path,
            displayId: page.path.replace('/', '').replace('-', '') || 'home'
          }));
        
        // Add hardcoded pages that might not be in the database yet
        const hardcodedPages = [
          { id: 'home', name: 'Home Page', path: '/', displayId: 'home' },
          { id: 'safari', name: 'Safari Collection', path: '/safari-collection', displayId: 'safari' },
          { id: 'paradise', name: 'Paradise Collection', path: '/paradise-collection', displayId: 'paradise' },
          { id: 'collection2026', name: 'Collection 2026', path: '/collection-2026', displayId: 'collection2026' },
          { id: 'clearance', name: 'Clearance Page', path: '/clearance', displayId: 'clearance' }
        ];
        
        // Combine and deduplicate by displayId
        const allPagesCombined = [...hardcodedPages, ...productPages];
        const uniquePages = allPagesCombined.filter((page, index, self) => 
          index === self.findIndex(p => p.displayId === page.displayId)
        );
        
        setPages(uniquePages);
      } catch (error) {
        console.error('Error loading pages:', error);
        // Fallback to hardcoded pages
        setPages([
          { id: 'home', name: 'Home Page', path: '/', displayId: 'home' },
          { id: 'safari', name: 'Safari Collection', path: '/safari-collection', displayId: 'safari' },
          { id: 'paradise', name: 'Paradise Collection', path: '/paradise-collection', displayId: 'paradise' },
          { id: 'collection2026', name: 'Collection 2026', path: '/collection-2026', displayId: 'collection2026' },
          { id: 'clearance', name: 'Clearance Page', path: '/clearance', displayId: 'clearance' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  const handlePageToggle = (displayId: string) => {
    if (selectedPages.includes(displayId)) {
      onChange(selectedPages.filter(p => p !== displayId));
    } else {
      onChange([...selectedPages, displayId]);
    }
  };

  // Filter pages based on search query
  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-xs text-muted-foreground ml-6">Loading pages...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Search Field */}
      <div className="ml-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pages by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Page List */}
      <div className="space-y-2">
        {filteredPages.map((page) => (
          <div key={page.displayId} className="flex items-center space-x-2 ml-6">
            <input
              type="checkbox"
              id={`page-${page.displayId}`}
              checked={selectedPages.includes(page.displayId)}
              onChange={() => handlePageToggle(page.displayId)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <Label htmlFor={`page-${page.displayId}`} className="font-body text-sm text-foreground">
              {page.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [sortBy, setSortBy] = useState("created_at");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const { collections, loading: collectionsLoading } = useCollections();
  const [form, setForm] = useState<{ 
    name: string; 
    price: string; 
    original_price: string; 
    category: string; 
    stock: string; 
    sku: string; 
    status: "Active" | "Draft" | "Archived";
    selectedCollections: string[];
    style: string;
    color: string;
    size: string;
    display_pages: string[];
  }>({ 
    name: "", 
    price: "", 
    original_price: "", 
    category: "", 
    stock: "", 
    sku: "", 
    status: "Active",
    selectedCollections: [],
    style: "",
    color: "",
    size: "",
    display_pages: ["all"]
  });

  // Load products and categories from database
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      const catNames = cats.filter(c => c.active).map(c => c.name);
      setCategories(["All", ...catNames]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      // Convert to AdminProduct format
      const adminProducts: AdminProduct[] = data.map(p => ({
        ...p,
        stock: p.stock ?? (p.in_stock ? 100 : 0),
        status: p.status || "Active",
        sku: p.sku || `FS-${p.id.slice(-4).toUpperCase()}`,
        original_price: p.original_price
      }));
      setProducts(adminProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({ title: "Error loading products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "collection-order":
        // Sort by collection first, then by sort order
        if (a.collection !== b.collection) {
          return (a.collection || '').localeCompare(b.collection || '');
        }
        return (a.sort_order || 999) - (b.sort_order || 999);
      case "created_at":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const openAdd = () => {
    setEditProduct(null);
    const resetForm = () => {
      setForm({
        name: "",
        price: "",
        original_price: "",
        category: "",
        stock: "",
        sku: "",
        status: "Active",
        selectedCollections: [],
        style: "",
        color: "",
        size: "",
        display_pages: ["all"]
      });
      setUploadedImages([]);
      setShowModal(true);
    };
    resetForm();
  };

  const openEdit = async (p: AdminProduct) => {
    setEditProduct(p);
    
    // Fetch collections for this product from the database
    const productCollections = await fetchProductCollections(p.id);
    
    setForm({
      name: p.name,
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      category: p.category,
      stock: String(p.stock),
      sku: p.sku,
      status: p.status,
      selectedCollections: productCollections,
      style: p.style || "",
      color: p.color || "",
      size: p.size || "",
      display_pages: (p as any).display_pages || ["all"]
    });
    setUploadedImages(p.images || []);
    setShowModal(true);
  };

  // Fetch collections for a specific product
  const fetchProductCollections = async (productId: string): Promise<string[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('collection_products')
        .select('collection_id')
        .eq('product_id', productId);
      
      if (error) throw error;
      return data?.map((item: any) => item.collection_id) || [];
    } catch (error) {
      console.error('Error fetching product collections:', error);
      return [];
    }
  };

  const handleSave = async () => {
    console.log('🔘 handleSave called');
    console.log('Form data:', form);
    console.log('Uploaded images:', uploadedImages);
    
    if (!form.name || !form.stock) {
      console.log('❌ Validation failed - missing required fields');
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    
    let productId: string;
    
    if (editProduct) {
      console.log('📝 Updating existing product:', editProduct.id);
      // Update existing product
      try {
        // Delete old images if new images are uploaded
        if (uploadedImages.length > 0 && editProduct.images && editProduct.images.length > 0) {
          console.log('🗑️ Deleting old images:', editProduct.images);
          for (const oldImage of editProduct.images) {
            if (oldImage && oldImage !== '/placeholder.svg') {
              try {
                await uploadService.deleteImage(oldImage);
                console.log('✅ Deleted old image:', oldImage);
              } catch (error) {
                console.warn('⚠️ Failed to delete old image:', oldImage, error);
              }
            }
          }
        }

        const updateData = {
          name: form.name,
          price: form.price ? Number(form.price) : 0,
          original_price: form.original_price ? Number(form.original_price) : null,
          category: form.category,
          collection: form.category,
          images: uploadedImages.length > 0 ? uploadedImages : editProduct.images || ["/placeholder.svg"],
          featured: false,
          in_stock: Number(form.stock) > 0,
          stock: Number(form.stock),
          sku: form.sku || `FS-${Date.now().toString(36).toUpperCase().slice(-6)}`,
          status: form.status,
          style: form.style,
          color: form.color,
          size: form.size,
          display_pages: form.display_pages,
        };
        console.log('Update data:', updateData);
        
        await productService.updateProduct(editProduct.id, updateData);
        productId = editProduct.id;
        toast({ title: "Product updated!" });
        loadProducts(); // Reload products
      } catch (error) {
        console.error('❌ Error updating product:', error);
        toast({ title: "Error updating product", variant: "destructive" });
        return;
      }
    } else {
      console.log('➕ Creating new product');
      // Create new product
      try {
        const createData = {
          name: form.name,
          price: form.price ? Number(form.price) : 0,
          original_price: form.original_price ? Number(form.original_price) : null,
          category: form.category,
          images: uploadedImages.length > 0 ? uploadedImages : ["/placeholder.svg"],
          featured: false,
          in_stock: Number(form.stock) > 0,
          stock: Number(form.stock),
          sku: form.sku || `FS-${Date.now().toString(36).toUpperCase().slice(-6)}`,
          colors: [],
          sizes: [],
          description: "",
          collection: form.category,
          slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          status: form.status,
          style: form.style,
          color: form.color,
          size: form.size,
          display_pages: form.display_pages,
        };
        console.log('Create data:', createData);
        
        const newProduct = await productService.createProduct(createData);
        productId = newProduct.id;
        toast({ title: "Product added!" });
        loadProducts(); // Reload products
      } catch (error) {
        console.error('❌ Error creating product:', error);
        toast({ title: "Error adding product", variant: "destructive" });
        return;
      }
    }
    
    // Save collections for the product (always update collections, even if empty)
    if (productId) {
      try {
        console.log('🔄 Saving collections for product:', productId);
        console.log('📋 Selected collections:', form.selectedCollections);
        
        // First, remove existing collections for this product
        const { error: deleteError } = await (supabase as any)
          .from('collection_products')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) {
          console.error('❌ Error deleting existing collections:', deleteError);
          throw deleteError;
        }
        
        // Then add new collections if any are selected
        if (form.selectedCollections.length > 0) {
          const collectionProducts = form.selectedCollections.map(collectionId => ({
            collection_id: collectionId,
            product_id: productId
          }));
          
          console.log('📝 Inserting collection products:', collectionProducts);
          
          const { error: insertError } = await (supabase as any)
            .from('collection_products')
            .insert(collectionProducts);
          
          if (insertError) {
            console.error('❌ Error inserting collections:', insertError);
            throw insertError;
          }
          
          console.log('✅ Collections inserted successfully');
        } else {
          console.log('ℹ️ No collections selected, removed all existing collections');
        }
        
        console.log('✅ Collections saved successfully');
      } catch (error) {
        console.error('❌ Error saving collections:', error);
        toast({ 
          title: "Product saved but collections failed", 
          description: "Please try updating collections separately",
          variant: "destructive" 
        });
      }
    }
    
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      toast({ title: "Product deleted" });
      loadProducts(); // Reload products
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    console.log('Files selected:', files.map(f => f.name));
    console.log('File details:', files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    })));

    setUploading(true);
    setUploadProgress(null);
    try {
      const uploadedFiles = await uploadService.uploadMultipleImages(files, (progress) => {
        setUploadProgress(progress);
      });
      console.log('Upload successful:', uploadedFiles);
      setUploadedImages([...uploadedImages, ...uploadedFiles.map(f => f.url)]);
      toast({ title: `${files.length} image(s) uploaded successfully!` });
    } catch (error) {
      console.error('❌ Upload failed:', error);
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Please check console for details",
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...uploadedImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setUploadedImages(newImages);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      moveImage(dragIndex, dropIndex);
    }
  };

  const statusBadge = (s: string) => {
    const statusStyles = {
      Active: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      Draft: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      Archived: "bg-muted text-muted-foreground",
    };
    return statusStyles[s] || "";
  };

  // Sort order management functions
  const updateSortOrder = async (productId: string, newSortOrder: number) => {
    try {
      const { error } = await (supabase as any)
        .from('products')
        .update({ sort_order: newSortOrder })
        .eq('id', productId);
      
      if (error) throw error;
      
      toast({ title: "Sort order updated" });
      loadProducts(); // Reload products to show changes
    } catch (error) {
      console.error('Error updating sort order:', error);
      toast({ title: "Error updating sort order", variant: "destructive" });
    }
  };

  const moveProductUp = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentSort = product.sort_order || 999;
    const newSort = Math.max(1, currentSort - 1);
    
    await updateSortOrder(productId, newSort);
  };

  const moveProductDown = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentSort = product.sort_order || 999;
    const newSort = currentSort + 1;
    
    await updateSortOrder(productId, newSort);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Products</h1>
          <p className="font-body text-sm text-muted-foreground">{products.length} products in catalog</p>
        </div>
        <Button className="font-body text-xs tracking-wider uppercase" onClick={openAdd}>
          <Plus size={14} className="mr-1" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card border-border font-body" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-lg font-body text-xs whitespace-nowrap transition-all ${
                category === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] h-10 bg-card border-border font-body">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Latest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price-low">Price (Low to High)</SelectItem>
            <SelectItem value="price-high">Price (High to Low)</SelectItem>
            <SelectItem value="collection-order">Collection Order</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Collection</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Sort Order</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Stock</th>
                <th className="text-right px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || "/placeholder.svg"} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                      <div>
                        <p className="font-body text-sm font-medium text-foreground truncate max-w-[200px]">{p.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden sm:table-cell">{p.sku}</td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm font-medium text-foreground">$ {p.price}</p>
                    {p.original_price && <p className="font-body text-xs text-muted-foreground line-through">$ {p.original_price}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge className={statusBadge(p.status)}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary" className="font-body text-xs">
                      {p.collection || 'Uncategorized'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={p.sort_order || 999}
                        onChange={(e) => updateSortOrder(p.id, parseInt(e.target.value) || 999)}
                        className="w-20 h-8 text-xs font-body"
                        min="1"
                        max="999"
                      />
                      <button
                        onClick={() => moveProductUp(p.id)}
                        className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                        title="Move Up"
                      >
                        <ChevronUp size={12} />
                      </button>
                      <button
                        onClick={() => moveProductDown(p.id)}
                        className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                        title="Move Down"
                      >
                        <ChevronDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`font-body text-sm ${Number(p.stock || 0) < 10 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                      {String(p.stock || 0).replace(/[^\d]/g, '') || '0'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/product/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground" title="View Product">
                        <Eye size={14} />
                      </a>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      {loading ? (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-muted-foreground/30 mb-3 animate-pulse" />
          <p className="font-body text-sm text-muted-foreground">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-body text-sm text-muted-foreground">No products found</p>
        </div>
      ) : null}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60" 
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(false);
            }} 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              // Allow normal scrolling behavior
              e.stopPropagation();
            }}
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-heading text-xl font-semibold text-foreground">{editProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-body text-xs uppercase text-muted-foreground">Product Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-10 bg-card border-border font-body" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Price ($)</Label>
                  <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Compare Price</Label>
                  <Input type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Category</Label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground">
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Stock *</Label>
                  <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">SKU</Label>
                  <Input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Status</Label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "Active" | "Draft" | "Archived" }))} className="w-full h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              
              {/* Display Page Selection - PROMINENT POSITION */}
              <div className="space-y-1.5 p-4 bg-card">
                <Label className="font-body text-sm uppercase text-foreground font-bold">
                  Display Page Selection *
                  <span className="ml-2 text-xs font-normal text-muted-foreground">(Choose where this product appears)</span>
                </Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="all-pages"
                      checked={form.display_pages.includes("all")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(f => ({ ...f, display_pages: ["all"] }));
                        } else {
                          setForm(f => ({ ...f, display_pages: [] }));
                        }
                      }}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="all-pages" className="font-body text-sm text-foreground">
                      Show on All Pages (Recommended)
                    </Label>
                  </div>
                  
                  {form.display_pages.includes("all") && (
                    <div className="text-xs text-muted-foreground ml-6">
                      When selected, product will appear everywhere including home, collections, and search results
                    </div>
                  )}
                  
                  {!form.display_pages.includes("all") && (
                    <>
                      <div className="text-xs text-muted-foreground font-semibold mt-3 mb-2">
                        Select specific pages where this product should appear:
                      </div>
                      
                      {/* Dynamic page selection from database */}
                      <DynamicPageSelector 
                        selectedPages={form.display_pages}
                        onChange={(pages) => setForm(f => ({ ...f, display_pages: pages }))}
                      />
                    </>
                  )}
                </div>
                
                <div className="bg-muted border border-border rounded p-2 mt-3">
                  <div className="text-xs text-muted-foreground font-semibold">
                    IMPORTANT: This controls where customers can see this product
                  </div>
                  <div className="text-xs text-foreground mt-1">
                    Current selection: 
                    <span className="font-bold text-foreground ml-1">
                      <DynamicPageDisplay selectedPages={form.display_pages} />
                    </span>
                  </div>
                </div>
              </div>
              
              {/* New Fields: Style, Color, Size */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Style</Label>
                  <Input value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} className="h-10 bg-card border-border font-body" placeholder="e.g., Long Dress" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Color</Label>
                  <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="h-10 bg-card border-border font-body" placeholder="e.g., Black, Blue" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Size</Label>
                  <Input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className="h-10 bg-card border-border font-body" placeholder="e.g., M, L, XL" />
                </div>
              </div>
              
              {/* Collections Selection */}
              <div className="space-y-1.5">
                <Label className="font-body text-xs uppercase text-muted-foreground">Collections</Label>
                {collectionsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading collections...</div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border border-border rounded-lg p-2">
                      {collections.map((collection) => (
                        <label key={collection.id} className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={form.selectedCollections.includes(collection.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm(f => ({ ...f, selectedCollections: [...f.selectedCollections, collection.id] }));
                              } else {
                                setForm(f => ({ ...f, selectedCollections: f.selectedCollections.filter(id => id !== collection.id) }));
                              }
                            }}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <div className="flex items-center gap-2">
                            {collection.featured && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                            <span className="text-sm font-body">{collection.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {form.selectedCollections.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Selected: {form.selectedCollections.length > 0 
                          ? form.selectedCollections
                              .map(id => collections.find(c => c.id === id)?.name)
                              .filter(Boolean)
                              .join(', ')
                          : 'None'
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="font-body text-sm text-muted-foreground">Drag & drop images or click to upload</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">PNG, JPG - No size limit</p>
                  {uploading && uploadProgress && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-body text-muted-foreground">
                          {uploadProgress.fileName}
                        </span>
                        <span className="font-body text-primary">
                          {uploadProgress.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {uploading && !uploadProgress && (
                    <p className="font-body text-xs text-primary mt-2">Uploading...</p>
                  )}
                </label>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-body text-xs uppercase text-muted-foreground">Uploaded Images</Label>
                    <span className="font-body text-xs text-muted-foreground">Drag to reorder • First image will be main</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-move ${
                          index === 0 ? 'ring-2 ring-primary rounded-lg' : ''
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <img src={img} alt={`Upload ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-body">
                            MAIN
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-30 transition-opacity rounded-lg pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
            
            {/* Fixed Footer */}
            <div className="flex gap-3 p-6 border-t border-border">
              <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1 font-body text-xs tracking-wider uppercase" onClick={handleSave}>{editProduct ? "Update" : "Add"} Product</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
