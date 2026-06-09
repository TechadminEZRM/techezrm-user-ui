import type React from "react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-2 px-2 cursor-pointer transition-all hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-heading mb-3 text-[1.1rem] leading-snug">{title}</h3>
      <p className="text-soft text-sm leading-relaxed text-center max-w-[250px]">{description}</p>
    </div>
  );
};

const TransparentPricingIcon = () => (
  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
    <div className="w-[45px] h-[35px] bg-info-light rounded-[8px]" />
    <div className="absolute w-5 h-5 bg-brand rounded-[4px] right-2 bottom-2" />
  </div>
);

const DigitalDocumentationIcon = () => (
  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
    <div className="w-10 h-[50px] bg-brand rounded-[6px] flex flex-col items-center justify-center gap-[3px]">
      <div className="w-6 h-[2.5px] bg-white rounded" />
      <div className="w-6 h-[2.5px] bg-white rounded" />
      <div className="w-6 h-[2.5px] bg-white rounded" />
      <div className="w-[18px] h-[2.5px] bg-white rounded" />
    </div>
    <div className="absolute w-6 h-[30px] bg-info-light rounded-[4px] right-1 top-1" />
  </div>
);

const LogisticsIcon = () => (
  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
    <div className="w-[45px] h-[25px] border-4 border-info-light rounded-[25px] border-b-0" />
    <div className="absolute w-[14px] h-[14px] bg-brand rounded-full right-[10px] bottom-[18px]" />
    <div className="absolute w-2 h-2 bg-warn rounded-full left-[18px] bottom-[22px]" />
    <div className="absolute w-2 h-2 bg-success rounded-full left-[30px] bottom-[24px]" />
  </div>
);

const RealTimeTrackingIcon = () => (
  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
    <div className="w-10 h-[35px] bg-info-light rounded-[8px]" />
    <div className="absolute w-[22px] h-[22px] bg-brand rounded-[4px] right-1.5 bottom-1.5" />
    <div className="absolute w-[5px] h-[5px] bg-warn rounded-full top-[10px] right-[15px]" />
  </div>
);

const QualityIcon = () => (
  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
    <div className="w-10 h-[35px] bg-warn rounded-[8px]" />
    <div className="absolute w-5 h-5 bg-brand rounded-[4px] right-2 bottom-2" />
  </div>
);

const ZeroWaitingIcon = () => (
  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
    <div className="w-[45px] h-[45px] border-4 border-info-light rounded-full" />
    <div className="absolute w-[3px] h-[14px] bg-brand rounded-full" style={{ transformOrigin: "bottom", transform: "rotate(90deg)" }} />
    <div className="absolute w-[3px] h-[10px] bg-brand rounded-full" style={{ transformOrigin: "bottom", transform: "rotate(0deg)" }} />
  </div>
);

const NoIntermediaryIcon = () => (
  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
    <div className="w-10 h-[35px] bg-info-light rounded-[8px]" />
    <div className="absolute w-[22px] h-[22px] bg-brand rounded-[4px] right-1.5 bottom-1.5 flex items-center justify-center">
      <div className="w-[14px] h-[3px] bg-white rounded-full" style={{ transform: "rotate(45deg)" }} />
    </div>
  </div>
);

const ServicesSection: React.FC = () => {
  const services = [
    { icon: <TransparentPricingIcon />, title: "Transparent Pricing", description: "Opportunity to compare price points for the products you buy" },
    { icon: <DigitalDocumentationIcon />, title: "Digital Documentation", description: "Easy access to your purchase history, quantities and other information" },
    { icon: <LogisticsIcon />, title: "End to End Logistics", description: "Streamlined supply chain operations for continued business" },
    { icon: <RealTimeTrackingIcon />, title: "Real time tracking & analysis", description: "Keep an eye on your orders every step of the way" },
    { icon: <QualityIcon />, title: "High Quality Raw Material", description: "We know you value quality - we do too" },
    { icon: <ZeroWaitingIcon />, title: "Zero Waiting time", description: "A range of products, readily available for you" },
    { icon: <NoIntermediaryIcon />, title: "No intermediary", description: "Access a direct trade exchange for greater convenience" },
  ];

  return (
    <div className="bg-surface py-12 md:py-16 relative">
      {/* Decorative Plus Signs */}
      <span className="absolute top-[20%] right-[8%] text-brand text-2xl font-light">+</span>
      <span className="absolute top-[30%] right-[12%] text-brand text-xl font-light">+</span>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-[1.8rem] md:text-[2.2rem] font-semibold text-heading relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-[50px] after:h-[2px] after:bg-brand after:rounded">
            We Offer Best Services
          </h2>
        </div>

        {/* First Row (4 items) */}
        <div className="flex flex-wrap justify-center gap-8 mb-4 mt-8">
          {services.slice(0, 4).map((service, index) => (
            <div key={index} className="flex-1 min-w-[250px] max-w-[300px]">
              <ServiceCard icon={service.icon} title={service.title} description={service.description} />
            </div>
          ))}
        </div>

        {/* Second Row (3 items) */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          {services.slice(4, 7).map((service, index) => (
            <div key={index + 4} className="flex-1 min-w-[250px] max-w-[300px]">
              <ServiceCard icon={service.icon} title={service.title} description={service.description} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
