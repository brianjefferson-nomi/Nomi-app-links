/**
 * Test script to find a real restaurant ID from Supabase
 * Run: node test-real-id.js
 */

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('');
  console.error('💡 Set them in Vercel or run:');
  console.error('   export NEXT_PUBLIC_SUPABASE_URL="your-url"');
  console.error('   export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findRestaurantId() {
  try {
    console.log('🔍 Fetching first restaurant from database...\n');
    
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching restaurant:', error);
      return;
    }
    
    if (!restaurants || restaurants.length === 0) {
      console.log('⚠️  No restaurants found in database');
      console.log('   Add a restaurant first, then test');
      return;
    }
    
    const restaurant = restaurants[0];
    console.log('✅ Found restaurant:');
    console.log(`   Name: ${restaurant.name}`);
    console.log(`   ID: ${restaurant.id}`);
    console.log('');
    console.log('🧪 Test URL:');
    console.log(`   https://nomi-app-links.vercel.app/restaurant/${restaurant.id}`);
    console.log('');
    console.log('📋 To test, run:');
    console.log(`   curl https://nomi-app-links.vercel.app/restaurant/${restaurant.id}`);
    console.log('');
    console.log('🌐 Or visit in browser:');
    console.log(`   https://nomi-app-links.vercel.app/restaurant/${restaurant.id}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

findRestaurantId();

