import { pagesApi } from "@/api/pages";

// Quick test utility to create a sample page
export async function createTestPage() {
  try {
    const page = await pagesApi.create('landing', 'Landing Page');
    console.log('Created test page:', page);
    
    // Navigate to studio if we're in a browser environment
    if (typeof window !== 'undefined') {
      window.location.href = `/studio/${page.id}`;
    }
    
    return page;
  } catch (error) {
    console.error('Failed to create test page:', error);
    throw error;
  }
}

// Make it available on window for console testing
if (typeof window !== 'undefined') {
  (window as any).createTestPage = createTestPage;
}