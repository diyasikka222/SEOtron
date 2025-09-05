import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer" className="bg-muted/30">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        {/* Logo & Tagline */}
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex items-center gap-2"
          >
            <LogoIcon className="w-7 h-7 text-primary" />
            <span>SEOtron</span>
          </a>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Powering your business growth with AI-driven SEO insights and
            optimization strategies.
          </p>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow Us</h3>
          <a href="#" className="opacity-60 hover:opacity-100">Github</a>
          <a href="#" className="opacity-60 hover:opacity-100">Twitter</a>
          <a href="#" className="opacity-60 hover:opacity-100">LinkedIn</a>
        </div>

        {/* Platforms */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Platforms</h3>
          <a href="#" className="opacity-60 hover:opacity-100">Web</a>
          <a href="#" className="opacity-60 hover:opacity-100">Mobile</a>
          <a href="#" className="opacity-60 hover:opacity-100">Desktop</a>
        </div>

        {/* About */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">About</h3>
          <a href="#features" className="opacity-60 hover:opacity-100">Features</a>
          <a href="#pricing" className="opacity-60 hover:opacity-100">Pricing</a>
          <a href="#faq" className="opacity-60 hover:opacity-100">FAQ</a>
        </div>

        {/* Community */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Community</h3>
          <a href="#" className="opacity-60 hover:opacity-100">YouTube</a>
          <a href="#" className="opacity-60 hover:opacity-100">Discord</a>
          <a href="#" className="opacity-60 hover:opacity-100">Blog</a>
        </div>
      </section>

      <section className="container pb-14 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-semibold">SEOtron</span>. 
          All rights reserved.
        </p>
        <p className="mt-2">
          Built with ❤️ for your business.
        </p>
      </section>
    </footer>
  );
};
