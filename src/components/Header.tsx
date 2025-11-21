import idealLogo from "@/assets/ideal-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-4">
        <img 
          src={idealLogo} 
          alt="Ideal Motorhome Logo" 
          className="h-12 md:h-16 w-auto animate-fade-in"
        />
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary drop-shadow-lg">
            Família Ideal Motorhome
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Unidos pela estrada e pela liberdade
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
