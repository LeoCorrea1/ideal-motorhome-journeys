import { useState } from "react";
import { Search, X, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer, customers } from "@/data/customers";
import { cn } from "@/lib/utils";

interface CustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerClick: (customer: Customer) => void;
  isMobile: boolean;
}

const CustomerSidebar = ({ isOpen, onClose, onCustomerClick, isMobile }: CustomerSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static top-0 left-0 h-full bg-card border-r border-border z-50 transition-transform duration-300 ease-in-out flex flex-col",
          isMobile ? "w-full" : "w-80",
          isMobile && !isOpen && "-translate-x-full",
          isOpen && "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary">
              Nossa Família
            </h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCustomers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum cliente encontrado
            </p>
          ) : (
            filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => {
                  onCustomerClick(customer);
                  if (isMobile) onClose();
                }}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-primary transition-all group"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-1 group-hover:animate-pulse-glow" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {customer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {customer.city}, {customer.state}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-center text-sm text-muted-foreground">
            <span className="text-primary font-bold">{filteredCustomers.length}</span>{" "}
            {filteredCustomers.length === 1 ? "cliente" : "clientes"}
          </p>
        </div>
      </aside>
    </>
  );
};

export default CustomerSidebar;
