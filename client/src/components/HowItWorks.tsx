import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Collect Data",
    description:
      "SEOtron pulls SEO data from search engines, analytics tools, and competitor sites.",
  },
  {
    icon: <MapIcon />,
    title: "Analyze & Audit",
    description:
      "AI scans your website for keyword rankings, backlinks, site health, and performance gaps.",
  },
  {
    icon: <PlaneIcon />,
    title: "Optimize with AI",
    description:
      "NLP-driven insights suggest better keywords, content improvements, and fixes for technical issues.",
  },
  {
    icon: <GiftIcon />,
    title: "Track & Grow",
    description:
      "Get real-time alerts, automated reports, and dashboards to monitor progress and stay ahead.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <br />
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
