import Text from "../components/Text";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Text as="h1" className="mb-4">
        Coming Soon
      </Text>
      <Text as="p" className="text-lg">
        Stay tuned for exciting updates!
      </Text>
    </div>
  );
};

export default ComingSoon;
