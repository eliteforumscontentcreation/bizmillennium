// Test script to check gallery data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gpdxbqghobdmmdbslrip.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGalleryQuery() {
  console.log('Testing gallery query...\n');
  
  // Test 1: Fetch all gallery items
  const { data: allGallery, error: error1 } = await supabase
    .from('gallery')
    .select('*');
  
  console.log('All gallery items:', allGallery?.length || 0);
  if (allGallery && allGallery.length > 0) {
    console.log('Sample item:', JSON.stringify(allGallery[0], null, 2));
  }
  if (error1) console.error('Error fetching all:', error1);
  
  // Test 2: Fetch only active items (what Gallery page uses)
  const { data: activeGallery, error: error2 } = await supabase
    .from('gallery')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  
  console.log('\nActive gallery items:', activeGallery?.length || 0);
  if (activeGallery && activeGallery.length > 0) {
    console.log('Active items by event:');
    const byEvent = {};
    activeGallery.forEach(item => {
      const eventId = item.event_id || 'no-event';
      byEvent[eventId] = (byEvent[eventId] || 0) + 1;
    });
    console.log(JSON.stringify(byEvent, null, 2));
  }
  if (error2) console.error('Error fetching active:', error2);
  
  // Test 3: Fetch events
  const { data: events, error: error3 } = await supabase
    .from('events')
    .select('id, title, slug')
    .order('event_date', { ascending: false });
  
  console.log('\nEvents:', events?.length || 0);
  if (events && events.length > 0) {
    console.log('Sample event:', JSON.stringify(events[0], null, 2));
  }
  if (error3) console.error('Error fetching events:', error3);
}

testGalleryQuery();