import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants";

const ProductCard = ({ data }) => {
  return (
    <Link to={`/products/${data._id}`}>
      <Card className="py-4 w-72 h-full">
        <CardHeader className="overflow-visible py-0">
          <Image
            alt="Card background"
            className="object-cover rounded-xl min-h-64 min-w-64"
            src={
              data.images[0].startsWith("https:") ||
              data.images[0].startsWith("http:")
                ? data.images[0]
                : `${BASE_URL}/api/v1/${data.images[0]}`
            }
            fallbackSrc="https://via.placeholder.com/264"
            classNames={{ wrapper: "this-is-wrapper-class bg-no-repeat" }}
            width={264}
          />
        </CardHeader>
        <CardBody className="pb-0 pt-2 px-4 flex-col items-start justify-end">
          <h4 className="font-bold text-large truncate w-full">{data.name}</h4>
          <div className="flex justify-between items-center mt-4">
            <span className="text-black text-lg font-bold mr-1">$</span>
            <span className="text-black font-bold text-lg mr-2">
              {Number(data.selling_price).toFixed(2)}
            </span>
            <span className="text-red-500 line-through text-base mr-1">$</span>
            <span className="text-red-500 line-through text-base">
              {Number(data.original_price).toFixed(2)}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default ProductCard;
