import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Archive</h3>
            <p className="text-sm text-muted-foreground">
              Documenting lives lost to preserve memory and seek accountability.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link to="/browse" className="block text-muted-foreground hover:text-foreground">
                Browse Cases
              </Link>
              <Link to="/map" className="block text-muted-foreground hover:text-foreground">
                Map View
              </Link>
              <Link to="/upload" className="block text-muted-foreground hover:text-foreground">
                Submit Documentation
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Information</h4>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link to="/legal" className="block text-muted-foreground hover:text-foreground">
                Legal Information
              </Link>
              <a href="#" className="block text-muted-foreground hover:text-foreground">
                Support Resources
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link to="/legal" className="block text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/legal" className="block text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/legal" className="block text-muted-foreground hover:text-foreground">
                Content Guidelines
              </Link>
              <a href="#" className="block text-muted-foreground hover:text-foreground">
                Contact Legal Team
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 Archive. All rights reserved.</p>
          <p>Dedicated to the memory of victims worldwide.</p>
        </div>
      </div>
    </footer>
  );
};