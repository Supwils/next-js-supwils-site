import "@/styles/globals.css";
import HeaderNav from "@/components/HomeComponents/HeaderNav";
import Footer from "@/components/HomeComponents/Footer";
import BackgroundPlayer from '@/components/MusicPlayer/BackgroundPlayer';
// import 'react-quill/dist/quill.snow.css';

export default function App({ Component, pageProps })
{
  return (
    <>
      <div className="App">
        <HeaderNav /> {/* Add the header navigation */}
        <Component {...pageProps} />
        <BackgroundPlayer />
        <Footer />

      </div>
    </>
  );
}
