import { Button } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { Link } from "react-router-dom";
import { GridScan } from "./GridScan";

export const Hero = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const getStartedLink = isLoggedIn ? "/onboarding" : "/signup";

  return (
    // ✨ 1. MODIFIED SECTION:
    // - Changed `w-50` to `w-full`
    // - Changed `h-full` to `min-h-screen`
    <section
      className="relative w-full min-h-screen py-20 md:py-32"
      style={{
        maskImage:
          "radial-gradient(ellipse at center, black 60%, transparent 90%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 60%, transparent 90%)", // For Safari/WebKit
      }}
    >
      {/* 2. BACKGROUND: This is correct, it now fills the full-width section */}
      <GridScan
        className="absolute inset-1 -z-10 py-20"
        sensitivity={0.1}
        lineThickness={0.1}
        linesColor="#392e4e"
        gridScale={0.03}
        scanColor="#00000"
        scanOpacity={0.03}
        enablePost
        bloomIntensity={0.1}
        chromaticAberration={0.002}
        noiseIntensity={0.01}
      />

      {/* 3. NEW INNER DIV:
      // - This div now holds the 'container' and 'grid' layout,
      //   centering your content ON TOP of the full-width background.
      */}
      <div className="container grid lg:grid-cols-2 place-items-center gap-8 px-1">
        {/* 4. CONTENT (Unchanged, just nested) */}
        <div className="text-center lg:text-start space-y-6">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
              <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
                SEO OptimAIzation
              </span>{" "}
              & Visualisation Tool
            </h1>{" "}
            for{" "}
            <h2 className="inline">
              <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                Your
              </span>{" "}
              Business
            </h2>
          </main>

          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            Take off your Business to New Heights !
          </p>

          <div className="space-y-4 flex flex-col items-center">
            <Link to="/analyze" className="w-full max-w-md">
              <Button
                className="w-full h-12 border border-purple-500 text-purple-500 hover:bg-white hover:text-black"
                variant="outline"
              >
                Check your Website's score for free 🗲
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full max-w-2xl">
              <Link to={getStartedLink} className="flex-1">
                <Button className="w-full" variant="default">
                  Start Onboarding
                </Button>
              </Link>

              <Link to="/book-demo" className="flex-1">
                <Button
                  className="w-full border border-green-500 text-green-500 hover:bg-purple-300 hover:text-black"
                  variant="outline"
                >
                  Book a Free Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 5. CONTENT (Unchanged, just nested) */}
        <div className="z-10">
          <HeroCards />
        </div>

        {/* Shadow effect (I've left this inside the grid as it was before) */}
        <div className="shadow"></div>
      </div>
    </section>
  );
};
