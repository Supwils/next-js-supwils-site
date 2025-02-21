import "@/styles/globals.css";
import HeaderNav from "@/components/HomeComponents/HeaderNav";
import Footer from "@/components/HomeComponents/Footer";
export default function App({ Component, pageProps }) {
  return (
    <>
      <div className="App">
        <HeaderNav /> {/* Add the header navigation */}
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}
