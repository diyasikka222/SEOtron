import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "../assets/growth.png";
import image3 from "../assets/reflecting.png";
import image4 from "../assets/looking-ahead.png";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "Responsive Design",
    description:
      "SEOtron is built to adapt seamlessly across all devices — desktop, tablet, or mobile. No matter where you access it, you get a smooth, consistent, and optimized experience.",
    image: image4,
  },
  {
    title: "Intuitive user interface",
    description:
      "Designed with simplicity in mind, Seotron offers a clean and easy-to-navigate dashboard. Even non-technical users can track SEO performance, run audits, and generate reports without hassle.",
    image: image3,
  },
  {
    title: "AI-Powered insights",
    description:
      "Go beyond numbers with actionable recommendations. Our AI analyzes patterns, detects anomalies, and suggests improvements that align with both search engine algorithms and user intent.",
    image: image,
  },
];

const featureList: string[] = [
  "Automated Keyword Tracking",
  "AI-Powered Content Suggestions ",
  "Smart Site Audits",
  "Backlink Monitoring",
  "Competitor Benchmarking",
  "Real-Time Alerts",
  "Custom Dashboards & Reports",
  "Seamless Integrations",
  "Scalability",
  "User-Friendly Interface",
  "Predictive Insights (AI)",
  "Cloud-Based Platform",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
      {" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
