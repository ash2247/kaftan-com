import { useState, useEffect } from "react";
import { GripVertical, Plus, X, ExternalLink, Edit2, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { headerFooterService, type HeaderFooterContent, type NavItem, type FooterSection, type FooterItem } from "@/lib/headerFooterService";

interface HeaderFooterEditorProps {
  onSave?: (content: HeaderFooterContent) => void;
  initialContent?: HeaderFooterContent;
}

const HeaderFooterEditor = ({ onSave, initialContent }: HeaderFooterEditorProps) => {
  const { toast } = useToast();
  const [content, setContent] = useState<HeaderFooterContent>(initialContent || {
    header: {
      navItems: [],
      whereToBuyLinks: [],
    },
    footer: {
      sections: [],
      newsletterTitle: "",
      newsletterSubtitle: "",
      ctaText: "",
      copyright: "",
      socialLinks: {
        instagram: "",
        facebook: "",
        twitter: "",
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ type: string; index: number } | null>(null);

  useEffect(() => {
    if (!initialContent) {
      loadContent();
    }
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await headerFooterService.getHeaderFooterContent();
      setContent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load header footer content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await headerFooterService.saveHeaderFooterContent(content);
      if (success) {
        toast({
          title: "Success",
          description: "Header and footer content saved successfully",
        });
        onSave?.(content);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save header footer content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNavItem = (type: 'nav' | 'whereToBuy') => {
    const newItem: NavItem = {
      id: headerFooterService.generateId(),
      label: "New Item",
      order: (type === 'nav' ? content.header.navItems.length : content.header.whereToBuyLinks.length) + 1,
      enabled: true,
    };

    if (type === 'nav') {
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          navItems: [...prev.header.navItems, newItem],
        },
      }));
    } else {
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          whereToBuyLinks: [...prev.header.whereToBuyLinks, { ...newItem, url: "", isExternal: true }],
        },
      }));
    }
  };

  const updateNavItem = (type: 'nav' | 'whereToBuy', index: number, field: keyof NavItem, value: any) => {
    if (type === 'nav') {
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          navItems: prev.header.navItems.map((item, i) => i === index ? { ...item, [field]: value } : item),
        },
      }));
    } else {
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          whereToBuyLinks: prev.header.whereToBuyLinks.map((item, i) => i === index ? { ...item, [field]: value } : item),
        },
      }));
    }
  };

  const removeNavItem = (type: 'nav' | 'whereToBuy', index: number) => {
    if (type === 'nav') {
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          navItems: prev.header.navItems.filter((_, i) => i !== index),
        },
      }));
    } else {
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          whereToBuyLinks: prev.header.whereToBuyLinks.filter((_, i) => i !== index),
        },
      }));
    }
  };

  const reorderNavItems = (type: 'nav' | 'whereToBuy', fromIndex: number, toIndex: number) => {
    if (type === 'nav') {
      const reordered = headerFooterService.reorderItems(content.header.navItems, fromIndex, toIndex);
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          navItems: reordered,
        },
      }));
    } else {
      const reordered = headerFooterService.reorderItems(content.header.whereToBuyLinks, fromIndex, toIndex);
      setContent(prev => ({
        ...prev,
        header: {
          ...prev.header,
          whereToBuyLinks: reordered,
        },
      }));
    }
  };

  const addFooterSection = () => {
    const newSection: FooterSection = {
      id: headerFooterService.generateId(),
      title: "New Section",
      order: content.footer.sections.length + 1,
      enabled: true,
      items: [],
    };

    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        sections: [...prev.footer.sections, newSection],
      },
    }));
  };

  const updateFooterSection = (index: number, field: keyof FooterSection, value: any) => {
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        sections: prev.footer.sections.map((section, i) => i === index ? { ...section, [field]: value } : section),
      },
    }));
  };

  const removeFooterSection = (index: number) => {
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        sections: prev.footer.sections.filter((_, i) => i !== index),
      },
    }));
  };

  const addFooterItem = (sectionIndex: number) => {
    const newItem: FooterItem = {
      id: headerFooterService.generateId(),
      label: "New Item",
      path: "#",
      order: content.footer.sections[sectionIndex].items.length + 1,
      enabled: true,
    };

    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        sections: prev.footer.sections.map((section, i) => 
          i === sectionIndex 
            ? { ...section, items: [...section.items, newItem] }
            : section
        ),
      },
    }));
  };

  const updateFooterItem = (sectionIndex: number, itemIndex: number, field: keyof FooterItem, value: any) => {
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        sections: prev.footer.sections.map((section, i) => 
          i === sectionIndex 
            ? {
                ...section,
                items: section.items.map((item, j) => j === itemIndex ? { ...item, [field]: value } : item),
              }
            : section
        ),
      },
    }));
  };

  const removeFooterItem = (sectionIndex: number, itemIndex: number) => {
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        sections: prev.footer.sections.map((section, i) => 
          i === sectionIndex 
            ? { ...section, items: section.items.filter((_, j) => j !== itemIndex) }
            : section
        ),
      },
    }));
  };

  const reorderFooterSections = (fromIndex: number, toIndex: number) => {
    const reordered = headerFooterService.reorderItems(content.footer.sections, fromIndex, toIndex);
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        sections: reordered,
      },
    }));
  };

  const NavItemEditor = ({ item, type, index }: { item: NavItem; type: 'nav' | 'whereToBuy'; index: number }) => (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-card">
      <div className="cursor-move">
        <GripVertical size={16} className="text-muted-foreground" />
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          value={item.label}
          onChange={(e) => updateNavItem(type, index, 'label', e.target.value)}
          placeholder="Label"
          className="text-sm"
        />
        
        {type === 'nav' ? (
          <Input
            value={item.to || ''}
            onChange={(e) => updateNavItem(type, index, 'to', e.target.value)}
            placeholder="Path (e.g., /about)"
            className="text-sm"
          />
        ) : (
          <Input
            value={item.url || ''}
            onChange={(e) => updateNavItem(type, index, 'url', e.target.value)}
            placeholder="URL (e.g., https://example.com)"
            className="text-sm"
          />
        )}
        
        <div className="flex items-center gap-2">
          <Switch
            checked={item.enabled}
            onCheckedChange={(checked) => updateNavItem(type, index, 'enabled', checked)}
          />
          <span className="text-xs text-muted-foreground">Enabled</span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeNavItem(type, index)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );

  const FooterSectionEditor = ({ section, sectionIndex }: { section: FooterSection; sectionIndex: number }) => (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="cursor-move">
            <GripVertical size={16} className="text-muted-foreground" />
          </div>
          <Input
            value={section.title}
            onChange={(e) => updateFooterSection(sectionIndex, 'title', e.target.value)}
            placeholder="Section Title"
            className="font-semibold"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={section.enabled}
            onCheckedChange={(checked) => updateFooterSection(sectionIndex, 'enabled', checked)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFooterSection(sectionIndex)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {section.items.map((item, itemIndex) => (
          <div key={item.id} className="flex items-center gap-2 p-2 border rounded bg-background">
            <div className="cursor-move">
              <GripVertical size={14} className="text-muted-foreground" />
            </div>
            
            <Input
              value={item.label}
              onChange={(e) => updateFooterItem(sectionIndex, itemIndex, 'label', e.target.value)}
              placeholder="Label"
              className="flex-1 text-sm"
            />
            
            <Input
              value={item.path}
              onChange={(e) => updateFooterItem(sectionIndex, itemIndex, 'path', e.target.value)}
              placeholder="Path"
              className="flex-1 text-sm"
            />
            
            <Switch
              checked={item.enabled}
              onCheckedChange={(checked) => updateFooterItem(sectionIndex, itemIndex, 'enabled', checked)}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFooterItem(sectionIndex, itemIndex)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFooterItem(sectionIndex)}
          className="w-full"
        >
          <Plus size={14} className="mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Header & Footer Editor</h2>
        <Button onClick={handleSave} disabled={loading}>
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation Items</h3>
            <div className="space-y-2">
              {content.header.navItems.map((item, index) => (
                <NavItemEditor key={item.id} item={item} type="nav" index={index} />
              ))}
              <Button
                variant="outline"
                onClick={() => addNavItem('nav')}
                className="w-full"
              >
                <Plus size={14} className="mr-2" />
                Add Navigation Item
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Where to Buy Links</h3>
            <div className="space-y-2">
              {content.header.whereToBuyLinks.map((item, index) => (
                <NavItemEditor key={item.id} item={item} type="whereToBuy" index={index} />
              ))}
              <Button
                variant="outline"
                onClick={() => addNavItem('whereToBuy')}
                className="w-full"
              >
                <Plus size={14} className="mr-2" />
                Add Where to Buy Link
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Footer Sections</h3>
            <div className="space-y-4">
              {content.footer.sections.map((section, index) => (
                <FooterSectionEditor key={section.id} section={section} sectionIndex={index} />
              ))}
              <Button
                variant="outline"
                onClick={addFooterSection}
                className="w-full"
              >
                <Plus size={14} className="mr-2" />
                Add Footer Section
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newsletterTitle">Newsletter Title</Label>
                <Input
                  id="newsletterTitle"
                  value={content.footer.newsletterTitle}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    footer: { ...prev.footer, newsletterTitle: e.target.value },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="newsletterSubtitle">Newsletter Subtitle</Label>
                <Input
                  id="newsletterSubtitle"
                  value={content.footer.newsletterSubtitle}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    footer: { ...prev.footer, newsletterSubtitle: e.target.value },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input
                  id="ctaText"
                  value={content.footer.ctaText}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    footer: { ...prev.footer, ctaText: e.target.value },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                  id="copyright"
                  value={content.footer.copyright}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    footer: { ...prev.footer, copyright: e.target.value },
                  }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={content.footer.socialLinks.instagram || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      socialLinks: { ...prev.footer.socialLinks, instagram: e.target.value },
                    },
                  }))}
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={content.footer.socialLinks.facebook || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      socialLinks: { ...prev.footer.socialLinks, facebook: e.target.value },
                    },
                  }))}
                  placeholder="https://facebook.com/page"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={content.footer.socialLinks.twitter || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      socialLinks: { ...prev.footer.socialLinks, twitter: e.target.value },
                    },
                  }))}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeaderFooterEditor;
