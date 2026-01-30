import { Link } from "react-router-dom";

const partnerLogos = [
  { name: "AWS", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/aws-Our-Partners.jpg" },
  { name: "Dell", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/Dell-Our-Partners.jpg" },
  { name: "Freshworks", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/Freshworks-Our-Partners.jpg" },
  { name: "Apple", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/apple-Our-Partners.jpg" },
  { name: "Clear", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/clear-Our-Partners.jpg" },
  { name: "Workplace", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/workplace-Our-Partners.jpg" },
  { name: "Chrome", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/Chrome-Our-Partners.jpg" },
  { name: "Happay", logo: "https://bizmillennium.com/wp-content/uploads/2023/08/Happay-Our-Partners.jpg" },
];

export function PartnersSection() {
  return (
    <section className="py-12 bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Partners</h2>
          <div className="h-px flex-1 bg-border" />
          <Link 
            to="/partners" 
            className="text-accent font-medium hover:underline whitespace-nowrap"
          >
            view all
          </Link>
        </div>

        {/* Partner Logos Marquee */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee">
            {[...partnerLogos, ...partnerLogos].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 mx-8 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
