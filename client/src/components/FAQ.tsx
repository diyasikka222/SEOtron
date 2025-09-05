import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is SEOtron free to use?",
    answer:
      "SEOtron offers both free and premium plans. You can start with the free plan to explore core features and upgrade anytime for advanced tools.",
    value: "item-1",
  },
  {
    question: "Do I need technical knowledge to use SEOtron?",
    answer:
      "Not at all. SEOtron is designed with a simple, intuitive interface. Beginners can get started in minutes, while advanced users still get powerful insights.",
    value: "item-2",
  },
  {
    question: "How does SEOtron improve my website’s SEO?",
    answer:
      "We use advanced AI and NLP to analyze your site like a human, identify gaps, and recommend actionable steps that boost your rankings and visibility.",
    value: "item-3",
  },
  {
    question: "Can I integrate SEOtron with my existing tools?",
    answer:
      "Yes. SEOtron integrates seamlessly with platforms like Google Analytics, WordPress, and other CMS tools for smooth workflows.",
    value: "item-4",
  },
  {
    question: "Is my data safe with SEOtron?",
    answer:
      "Absolutely. We use top-level encryption and follow industry security standards to keep your data safe and private.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full max-w-3xl mx-auto"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left text-lg font-medium">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium text-center mt-8">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
