import PropertyNav from '../property/PropertyNav';

type LayoutProps = {
  children: React.ReactNode;
};

const PropertyLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <PropertyNav />
      {children}
    </>
  );
};

export default PropertyLayout;
