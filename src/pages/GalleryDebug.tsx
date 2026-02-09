import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  category: string | null;
  event_id: string | null;
  is_active: boolean;
  sort_order: number | null;
}

interface EventItem {
  id: string;
  title: string;
  slug: string;
  is_upcoming: boolean;
}

interface QueryResult<T> {
  count: number;
  error?: string;
  data: T[] | null;
}

interface GalleryByEvent {
  [key: string]: Array<{
    id: string;
    caption: string | null;
    is_active: boolean;
  }>;
}

interface DebugInfo {
  timestamp: string;
  queries: {
    allGallery: QueryResult<GalleryItem>;
    activeGallery: QueryResult<GalleryItem>;
    allEvents: QueryResult<EventItem>;
    eventsWithGallery?: {
      count: number;
      eventIds: string[];
      data: EventItem[];
    };
    galleryByEvent?: GalleryByEvent;
  };
}

export default function GalleryDebug() {
  const [debug, setDebug] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebugData() {
      const debugInfo: DebugInfo = {
        timestamp: new Date().toISOString(),
        queries: {
          allGallery: { count: 0, data: null },
          activeGallery: { count: 0, data: null },
          allEvents: { count: 0, data: null },
        }
      };

      // Query 1: All gallery items (no filters)
      const { data: allGallery, error: e1 } = await supabase
        .from("gallery")
        .select("*");
      debugInfo.queries.allGallery = {
        count: allGallery?.length || 0,
        error: e1?.message,
        data: allGallery
      };

      // Query 2: Only active gallery items (what Gallery.tsx uses)
      const { data: activeGallery, error: e2 } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      debugInfo.queries.activeGallery = {
        count: activeGallery?.length || 0,
        error: e2?.message,
        data: activeGallery
      };

      // Query 3: All events
      const { data: allEvents, error: e3 } = await supabase
        .from("events")
        .select("id, title, slug, is_upcoming")
        .order("event_date", { ascending: false });
      debugInfo.queries.allEvents = {
        count: allEvents?.length || 0,
        error: e3?.message,
        data: allEvents
      };

      // Query 4: Events with gallery images (what Gallery.tsx uses)
      if (activeGallery && allEvents) {
        const eventIds = new Set(activeGallery.map(g => g.event_id).filter(Boolean));
        const eventsWithGallery = allEvents.filter(e => eventIds.has(e.id));
        debugInfo.queries.eventsWithGallery = {
          count: eventsWithGallery.length,
          eventIds: Array.from(eventIds) as string[],
          data: eventsWithGallery
        };
      }

      // Query 5: Gallery items grouped by event
      if (activeGallery) {
        const byEvent: GalleryByEvent = {};
        activeGallery.forEach(item => {
          const eventId = item.event_id || 'no-event';
          if (!byEvent[eventId]) {
            byEvent[eventId] = [];
          }
          byEvent[eventId].push({
            id: item.id,
            caption: item.caption,
            is_active: item.is_active
          });
        });
        debugInfo.queries.galleryByEvent = byEvent;
      }

      setDebug(debugInfo);
      setLoading(false);
    }

    fetchDebugData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-8">Gallery Debug Information</h1>
        
        <div className="grid gap-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Total Gallery Items:</strong> {debug?.queries?.allGallery?.count || 0}</p>
                <p><strong>Active Gallery Items:</strong> {debug?.queries?.activeGallery?.count || 0}</p>
                <p><strong>Total Events:</strong> {debug?.queries?.allEvents?.count || 0}</p>
                <p><strong>Events with Gallery:</strong> {debug?.queries?.eventsWithGallery?.count || 0}</p>
              </div>
            </CardContent>
          </Card>

          {/* All Gallery Items */}
          <Card>
            <CardHeader>
              <CardTitle>All Gallery Items (including inactive)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(debug?.queries?.allGallery?.data, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Active Gallery Items */}
          <Card>
            <CardHeader>
              <CardTitle>Active Gallery Items (what Gallery page shows)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(debug?.queries?.activeGallery?.data, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Events */}
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(debug?.queries?.allEvents?.data, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Gallery by Event */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery Items Grouped by Event</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(debug?.queries?.galleryByEvent, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Events with Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Events That Should Show in Gallery Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(debug?.queries?.eventsWithGallery, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}