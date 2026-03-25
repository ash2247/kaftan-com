// Migration script to update products with collection, style, and color extracted from product names
import { supabase } from './src/integrations/supabase/client';

// Function to extract collection, style, and color from product name
function parseProductName(productName) {
  // Handle different naming patterns
  let collection = '';
  let style = '';
  let color = '';
  
  // Pattern 1: "Collection Style - Color" (e.g., "Athena Long Shirt Dress - Blue")
  if (productName.includes(' - ')) {
    const parts = productName.split(' - ');
    const mainPart = parts[0];
    color = parts[1];
    
    // Extract collection from main part
    const words = mainPart.split(' ');
    if (words.length >= 2) {
      // Check if first word is a known collection name
      const knownCollections = [
        'Athena', 'Sorento', 'Tropical', 'Pardus', 'Merika', 'Brown', 
        'Aqua', 'Black', 'Tiger', 'Garden', 'Delight', 'Marigold', 
        'Monet', 'Zahara', 'Picasso', 'Paradise', 'Safari'
      ];
      
      if (knownCollections.includes(words[0])) {
        collection = words[0];
        style = words.slice(1).join(' ');
      } else if (knownCollections.includes(words[0] + ' ' + words[1])) {
        collection = words[0] + ' ' + words[1];
        style = words.slice(2).join(' ');
      } else {
        // No clear collection, treat everything as style
        style = mainPart;
      }
    } else {
      style = mainPart;
    }
  } 
  // Pattern 2: "Collection Style Color" (e.g., "Picasso Long Coat Multi")
  else {
    const words = productName.split(' ');
    const knownCollections = [
      'Athena', 'Sorento', 'Tropical', 'Pardus', 'Merika', 'Brown', 
      'Aqua', 'Black', 'Tiger', 'Garden', 'Delight', 'Marigold', 
      'Monet', 'Zahara', 'Picasso', 'Paradise', 'Safari'
    ];
    
    if (words.length >= 3) {
      // Check if first word is a collection
      if (knownCollections.includes(words[0])) {
        collection = words[0];
        // Last word is likely color
        color = words[words.length - 1];
        // Everything in between is style
        style = words.slice(1, words.length - 1).join(' ');
      } else if (knownCollections.includes(words[0] + ' ' + words[1])) {
        collection = words[0] + ' ' + words[1];
        color = words[words.length - 1];
        style = words.slice(2, words.length - 1).join(' ');
      } else {
        // No clear collection, last word is color, rest is style
        color = words[words.length - 1];
        style = words.slice(0, words.length - 1).join(' ');
      }
    } else if (words.length === 2) {
      // Two words: treat first as style, second as color
      style = words[0];
      color = words[1];
    } else {
      // Single word: treat as style
      style = productName;
    }
  }
  
  return {
    collection: collection.trim(),
    style: style.trim(),
    color: color.trim()
  };
}

// Main migration function
async function migrateProductData() {
  try {
    console.log('🔄 Starting product data migration...');
    
    // Fetch all products
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`📦 Found ${products.length} products to process`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        const { collection, style, color } = parseProductName(product.name);
        
        // Update the product with extracted data
        const { error: updateError } = await supabase
          .from('products')
          .update({
            collection: collection || null,
            style: style || null,
            color: color || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`❌ Error updating product ${product.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Updated product ${product.id}: ${product.name}`);
          console.log(`   Collection: "${collection}" | Style: "${style}" | Color: "${color}"`);
          updatedCount++;
        }
      } catch (err) {
        console.error(`❌ Error processing product ${product.id}:`, err);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Migration complete!`);
    console.log(`✅ Successfully updated: ${updatedCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateProductData();
