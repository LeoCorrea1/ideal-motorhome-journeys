import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CustomerSidebar from "@/components/CustomerSidebar";
import MapView from "@/components/MapView";
import AudioPlayer from "@/components/AudioPlayer";
import { customers, Customer } from "@/data/customers";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const isMobile = useIsMobile();

  const handleCustomerClick = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex w-full h-full pt-20 md:pt-24">
        {/* Desktop Sidebar - Always visible */}
        {!isMobile && (
          <CustomerSidebar
            isOpen={true}
            onClose={() => {}}
            onCustomerClick={handleCustomerClick}
            isMobile={false}
          />
        )}

        {/* Mobile Sidebar - Slide in/out */}
        {isMobile && (
          <CustomerSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onCustomerClick={handleCustomerClick}
            isMobile={true}
          />
        )}

        {/* Map */}
        <main className="flex-1 relative">
          <MapView customers={customers} selectedCustomer={selectedCustomer} />

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              size="lg"
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-24 left-4 z-40 bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Menu className="h-5 w-5 mr-2" />
              BUSCA
            </Button>
          )}
        </main>
      </div>

      {/* Audio Player - Uncomment when audio file is provided */}
      {/* <AudioPlayer audioUrl="/path-to-your-audio-file.mp3" /> */}
    </div>
  );
};

export default Index;
