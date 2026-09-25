import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./store/StoreProvider";

export const metadata = {
  title: "My Store",
  description: "E-commerce and Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </StoreProvider>
      </body>
    </html>
  );
}
