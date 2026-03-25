// Run this script in the browser console or as a one-time admin function
// This will update all products with collection, style, and color extracted from their names

async function updateProductFields() {
  console.log('🔄 Starting product field updates...');
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📦 Processing ${products.length} products...`);
  
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const product of products) {
    try {
      let collection = '';
      let style = '';
      let color = '';
      
      // Parse product name
      const name = product.name;
      
      // Pattern 1: "Collection Style - Color" (e.g., "Athena Long Shirt Dress - Blue")
      if (name.includes(' - ')) {
        const parts = name.split(' - ');
        const mainPart = parts[0];
        color = parts[1];
        
        // Extract collection from main part
        const words = mainPart.split(' ');
        if (words.length >= 2) {
          const knownCollections = [
            'Athena', 'Sorento', 'Tropical', 'Pardus', 'Merika', 'Brown', 
            'Aqua', 'Black', 'Tiger', 'Garden', 'Delight', 'Marigold', 
            'Monet', 'Zahara', 'Picasso', 'Paradise', 'Safari'
          ];
          
          if (knownCollections.includes(words[0])) {
            collection = words[0];
            style = words.slice(1).join(' ');
          } else if (words.length >= 3 && knownCollections.includes(words[0] + ' ' + words[1])) {
            collection = words[0] + ' ' + words[1];
            style = words.slice(2).join(' ');
          } else {
            style = mainPart;
          }
        }
      } 
      // Pattern 2: "Collection Style Color" (e.g., "Picasso Long Coat Multi")
      else {
        const words = name.split(' ');
        const knownCollections = [
          'Athena', 'Sorento', 'Tropical', 'Pardus', 'Merika', 'Brown', 
          'Aqua', 'Black', 'Tiger', 'Garden', 'Delight', 'Marigold', 
          'Monet', 'Zahara', 'Picasso', 'Paradise', 'Safari'
        ];
        
        if (words.length >= 3) {
          if (knownCollections.includes(words[0])) {
            collection = words[0];
            color = words[words.length - 1];
            style = words.slice(1, words.length - 1).join(' ');
          } else if (words.length >= 4 && knownCollections.includes(words[0] + ' ' + words[1])) {
            collection = words[0] + ' ' + words[1];
            color = words[words.length - 1];
            style = words.slice(2, words.length - 1).join(' ');
          } else {
            color = words[words.length - 1];
            style = words.slice(0, words.length - 1).join(' ');
          }
        } else if (words.length === 2) {
          style = words[0];
          color = words[1];
        } else {
          style = name;
        }
      }
      
      // Update the product
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
        console.error(`❌ Error updating ${product.id}:`, updateError);
        errorCount++;
      } else {
        console.log(`✅ Updated: ${product.name}`);
        console.log(`   Collection: "${collection}" | Style: "${style}" | Color: "${color}"`);
        updatedCount++;
      }
      
      // Add small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.error(`❌ Error processing ${product.id}:`, err);
      errorCount++;
    }
  }
  
  console.log(`\n🎉 Update complete!`);
  console.log(`✅ Successfully updated: ${updatedCount} products`);
  console.log(`❌ Errors: ${errorCount} products`);
}

// Run the function
updateProductFields();
