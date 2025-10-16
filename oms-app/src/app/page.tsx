import Image from "next/image";
import Page from "./shopping_cart"

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[0.01fr_0.5fr_0.6fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-2">
      <header className="font-sans grid grid-rows-[1fr] items-center justify-items-center">        
        <hr className="header_bar"/>
        <h2>myElectronics</h2>
        <hr className="header_bar"/>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
         <Page></Page>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center">
        <hr className="footer_bar"/>
        <div className="row-start-4 flex gap-[24px] flex-wrap items-center justify-center">
          <span>Kontakt</span>
          <span>Unternehmen</span>
          <span>Zahlarten</span>
          <span>Social media</span>
        </div>
        <hr className="footer_bar"/>
      </footer>
    </div>
  );
}
