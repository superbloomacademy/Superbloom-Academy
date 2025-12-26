import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { Toaster } from "./components/ui/sonner";

// Block Emergent popup/widget
if (typeof window !== 'undefined') {
  // Remove any existing Emergent elements
  const removeEmergentElements = () => {
    const selectors = [
      '[class*="emergent"]',
      '[id*="emergent"]',
      '[data-emergent]',
      'iframe[src*="emergent"]',
      'div[class*="emergent-popup"]',
      'div[class*="emergent-widget"]',
      'div[id*="emergent-popup"]',
      'div[id*="emergent-widget"]'
    ];
    
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el && el.parentNode) {
            el.remove();
          }
        });
      } catch (e) {
        // Ignore errors
      }
    });
  };

  // Run immediately
  removeEmergentElements();

  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeEmergentElements);
  }

  // Run periodically to catch dynamically added elements
  setInterval(removeEmergentElements, 1000);

  // Block Emergent scripts from loading
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName, options) {
    const element = originalCreateElement.call(this, tagName, options);
    
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && typeof value === 'string' && value.toLowerCase().includes('emergent')) {
          console.log('Blocked Emergent script:', value);
          return; // Don't set the src attribute
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" />
  </React.StrictMode>,
);
