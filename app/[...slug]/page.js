// This file should be at app/[...slug]/page.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (it reads the Vercel environment variables)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// This function runs ON THE SERVER to generate metadata
export async function generateMetadata({ params }) {
  const slug = params.slug; // e.g., ['restaurant', '123']
  const fullUrl = `https://nomi-app-links.vercel.app/${slug.join('/')}`;

  // Default tags in case the link is invalid
  let ogData = {
    title: "Nomi - Find Your Next Meal",
    description: "Discover and share amazing restaurants.",
    images: [], // No default image - will be empty array if not found
  };

  // Check if this is a restaurant link and fetch its data
  if (slug[0] === 'restaurant' && slug[1]) {
    const restaurantId = slug[1];

    try {
      const { data: restaurant, error } = await supabase
        .from('restaurants')
        .select('id, name, description, cuisine, neighborhood, primary_image_url, images, google_photos, image_url')
        .eq('id', restaurantId)
        .single();

      if (!error && restaurant) {
        // Build restaurant info for title: "Name • Cuisine • Neighborhood"
        const parts = [restaurant.name];
        if (restaurant.cuisine) {
          const cuisine = Array.isArray(restaurant.cuisine) ? restaurant.cuisine[0] : restaurant.cuisine;
          if (cuisine) parts.push(cuisine);
        }
        if (restaurant.neighborhood) {
          parts.push(restaurant.neighborhood);
        }
        const title = parts.join(' • ');
        
        // Get primary image
        const imageUrl = restaurant.primary_image_url || 
                        (restaurant.images && restaurant.images[0]) ||
                        (restaurant.google_photos && restaurant.google_photos[0]) ||
                        restaurant.image_url;

        // If we find a restaurant, overwrite the default tags
        ogData = {
          title: title,
          description: `Found our next spot. 100%. ${restaurant.description || title}`,
          images: imageUrl ? [imageUrl] : [],
        };
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  }

  // Handle collection links
  if (slug[0] === 'collection' && slug[1]) {
    const collectionId = slug[1];

    try {
      const { data: collection, error } = await supabase
        .from('collections')
        .select('id, name, cover_image, coverImage, coverPhoto, description')
        .eq('id', collectionId)
        .single();

      if (!error && collection) {
        const title = collection.name;
        const description = `Stop scrolling. I found all the best spots. ${collection.name}`;
        const imageUrl = collection.cover_image || collection.coverImage || collection.coverPhoto;

        ogData = {
          title: title,
          description: description,
          images: imageUrl ? [imageUrl] : [],
        };
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
    }
  }

  // Return the final metadata for the <head> tag
  return {
    title: ogData.title,
    description: ogData.description,
    openGraph: {
      title: ogData.title,
      description: ogData.description,
      images: ogData.images,
      url: fullUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogData.title,
      description: ogData.description,
      images: ogData.images,
    },
  };
}

// This is the simple page component that renders.
// The user will only see this on a desktop browser.
export default function Page({ params }) {
  const appStoreUrl = "https://apps.apple.com/us/app/nomi";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=app.rork.nomi";

  return (
    <div style={{ 
      padding: 40, 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      <h1>You've found a link from Nomi!</h1>
      <p>This content is best viewed in the app.</p>
      <div style={{ marginTop: '20px' }}>
        <a 
          href={appStoreUrl}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#007AFF',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            marginRight: '10px'
          }}
        >
          Download on the App Store
        </a>
        <br style={{ marginTop: '10px' }} />
        <a 
          href={playStoreUrl}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#34A853',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            marginTop: '10px'
          }}
        >
          Get it on Google Play
        </a>
      </div>
    </div>
  );
}

