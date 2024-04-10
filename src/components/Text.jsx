const Text = ({ as = "", className = "", children }) => {
  const Component = as || "p";

  const textClasses = {
    h1: "text-xl xs:text-3xl sm:text-5xl md:text-6xl font-bold font-trap-bold text-foreground-600",
    h2: "text-xl xs:text-2xl sm:text-4xl md:text-5xl font-bold font-trap-bold text-foreground-600",
    h3: "text-2xl sm:text-3xl md:text-4xl font-bold font-trap-bold text-foreground-600",
    h4: "text-lg sm:text-2xl font-bold font-trap-bold text-foreground-600",
    p: "text-base font-normal font-trap-regular leading-relaxed",
  };

  return (
    <Component className={`${textClasses[Component]} ${className}`}>
      {children}
    </Component>
  );
};

export default Text;
