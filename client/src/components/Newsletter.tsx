import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const Newsletter = () => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    console.log("Subscribed!");
  };

  return (
    <section id="newsletter">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-24 sm:py-32 text-center">
        <h3 className="text-4xl md:text-5xl font-bold">
          Join Our Daily{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Newsletter
          </span>
        </h3>
        <p className="text-xl text-muted-foreground mt-4 mb-8">
          Get fresh insights, SEO tips, and updates straight to your inbox.
        </p>

        {!subscribed ? (
          <form
            className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2"
            onSubmit={handleSubmit}
          >
            <Input
              type="email"
              placeholder="your@email.com"
              className="bg-muted/50 dark:bg-muted/80"
              aria-label="email"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        ) : (
          <p className="text-green-600 font-medium text-lg mt-6">
            🎉 Thanks for subscribing! You’re on the list.
          </p>
        )}
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
