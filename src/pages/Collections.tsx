import CatalogPage from "@/components/CatalogPage";
import { getAllProducts } from "@/lib/productUtils";
import { useCatalogPageContent } from "@/hooks/usePageContent";

const Collections = () => {
  const cmsContent = useCatalogPageContent("collections");
  return (
    <CatalogPage
      title="Collections"
      subtitle="Curated collections for every occasion"
      products={getAllProducts()}
      bannerImage=""
      cmsContent={cmsContent}
      columns={3}
    />
  );
};

export default Collections;
