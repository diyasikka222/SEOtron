import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Free",
    popular: PopularPlanType.NO,
    price: 0,
    description: "Perfect for individuals just starting out.",
    buttonText: "Get Started",
    benefitList: [
      "1 Team member",
      "2 GB Storage",
      "Up to 4 pages",
      "Community support",
    ],
  },
  {
    title: "Premium",
    popular: PopularPlanType.YES,
    price: 9,
    description: "Best for small teams who need more power.",
    buttonText: "Start Free Trial",
    benefitList: [
      "5 Team members",
      "10 GB Storage",
      "Unlimited pages",
      "Priority support",
      "Advanced analytics",
    ],
  },
  {
    title: "Enterprise",
    popular: PopularPlanType.NO,
    price: 29,
    description: "For larger teams needing full-scale solutions.",
    buttonText: "Contact Us",
    benefitList: [
      "Unlimited Team members",
      "100 GB Storage",
      "Custom integrations",
      "Dedicated support",
      "Advanced security",
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Choose Your{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Plan
        </span>
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Simple, transparent pricing. No hidden fees.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-primary scale-105"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              {pricing.title === "Free" ? (
                <Link to="/signup" className="w-full">
                  <Button className="w-full">{pricing.buttonText}</Button>
                </Link>
              ) : pricing.title === "Premium" ? (
                <Link to="/signup" className="w-full">
                  <Button className="w-full">{pricing.buttonText}</Button>
                </Link>
              ) : pricing.title === "Enterprise" ? (
                <Link to="/book-demo" className="w-full">
                  <Button className="w-full">{pricing.buttonText}</Button>
                </Link>
              ) : (
                <Button className="w-full">{pricing.buttonText}</Button>
              )}
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className="flex items-center">
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

