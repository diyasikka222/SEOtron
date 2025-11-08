import { Button } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { Link } from "react-router-dom";

export const Hero = () => {
  // ✅ Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const getStartedLink = isLoggedIn ? "/onboarding" : "/signup";

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
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

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link to={getStartedLink}>
            <Button className="w-full md:w-1/3" variant="default">
              Start Onboarding
            </Button>
          </Link>
          <Link to="/book-demo">
            <Button
              className="w-full md:w-1/3 border border-green-500 text-green-500 hover:bg-purple-300 hover:text-black"
              variant="outline"
            >
              Book a Free Demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
