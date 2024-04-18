import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "../../assets/PlusIcon";
import { VerticalDotsIcon } from "../../assets/VerticalDotsIcon";
import { SearchIcon } from "../../assets/SearchIcon";
import { ChevronDownIcon } from "../../assets/ChevronDownIcon";
import { capitalize, toTitleCase } from "../../utils/strings";
import { productColumns as columns } from "../../staticData";
import { CustomButton } from "../../components/CustomButton";
import { Link } from "react-router-dom";
import axios from "axios";
import { PRODUCTS_URL } from "../../constants";
import { notify } from "../../utils/notify";
import ConfirmationModal from "../../components/ConfirmationModal";
import Text from "../../components/Text";

const in_stockColorMap = { true: "success", false: "danger" };

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "selling_price",
  "in_stock",
  "actions",
];

const ProductList = () => {
  document.title = "Admin | Manage Products | Grand Online Store";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rolling, setRolling] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [productToDelete, setProductToDelete] = React.useState(null);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredProducts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filterValue]);

  const [pages, setPages] = React.useState(
    Math.ceil(filteredItems.length / limit)
  );

  const sortedItems = React.useMemo(() => {
    return [...products].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, products]);

  const handleDeleteProduct = async (_id) => {
    return new Promise((resolve, reject) => {
      setRolling(true);
      axios
        .delete(`${PRODUCTS_URL}/${_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then(() => {
          notify("success", "Product deleted successfully");

          if (page < pages) {
            fetchProducts();
          } else {
            setProducts((prev) =>
              prev.filter((product) => product._id !== _id)
            );
            const newTotalProducts = products.length - 1;
            setPages(Math.ceil(newTotalProducts / limit));
          }

          setRolling(false);
          resolve(); // Resolve the promise if the deletion was successful
        })
        .catch((error) => {
          console.log("Error while deleting product:", error.response?.data);
          let message;

          if (!error.response) message = error.message;
          else message = toTitleCase(error.response?.data?.error?.message);

          notify("error", message);
          setRolling(false);
          reject(error); // Reject the promise if the deletion failed
        });
    });
  };

  const formattedQuery = (params) => {
    return Object.keys(params)
      .map((k) => {
        return Array.isArray(params[k])
          ? params[k].map((v) => `${k}[]=${v}`).join("&")
          : `${k}=${params[k]}`;
      })
      .join("&");
  };

  const fetchProducts = async () => {
    try {
      const query = {
        limit: limit,
        page: page || 1,
        include: Array.from(visibleColumns).filter(
          (elem) => elem !== "actions"
        ),
        queryType: "table",
      };
      const response = await axios.get(
        `${PRODUCTS_URL}?${formattedQuery(query)}`
      );

      setPages(response.data.pagination.totalPages);
      setLimit(response.data.pagination.limit);
      setTotalProducts(response.data.pagination.totalProducts);
      setProducts(response.data.data);
    } catch (error) {
      console.log("Error while fetching product:", error.response?.data);
      let message;
      if (!error.response) {
        message = error.message;
      } else {
        message = error.response.data;
      }

      notify("error", message);
    }
    // setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, visibleColumns, limit]);

  const renderCell = React.useCallback((product, columnKey) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "images":
        return (
          <Image src={cellValue[0]} alt={product.name} width={40} height={40} />
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {product.team}
            </p>
          </div>
        );
      case "in_stock":
        return (
          <Chip
            className="capitalize"
            color={in_stockColorMap[product.in_stock]}
            size="sm"
            variant="flat"
          >
            {product.in_stock ? "In Stock" : "Out Of Stock"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <CustomButton
                  isIconOnly
                  size="sm"
                  color="default"
                  variant="light"
                >
                  <VerticalDotsIcon className="text-default-500" />
                </CustomButton>
              </DropdownTrigger>
              <DropdownMenu aria-label="Actions for product">
                <DropdownItem to={`/products/${product._id}`} as={Link}>
                  View
                </DropdownItem>
                <DropdownItem
                  to={`/admin/products/edit/${product._id}`}
                  as={Link}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setProductToDelete(product._id);
                    onOpen();
                  }}
                  color="danger"
                  className="text-danger"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onRowsPerPageChange = React.useCallback((e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            radius="none"
          />
          <div className="flex gap-3">
            <Dropdown radius="none">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="solid"
                  radius="none"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <CustomButton
              as={Link}
              to="/admin/products/create?redirect=/products"
              color="dark"
              radius="none"
              endContent={<PlusIcon />}
            >
              Add New
            </CustomButton>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-600 text-small">
            Total {totalProducts} products
          </span>
          <label className="flex items-center text-default-600 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-600 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    products.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-600">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={setPage}
          radius="none"
          className=""
          classNames={{ cursor: "bg-black text-white shadow-gray-500" }}
        />
        <div className="hidden sm:flex w-[30%] text-sm justify-end gap-2">
          Showing {(page - 1) * limit + 1} -{" "}
          {Math.min((page - 1) * limit + filteredItems.length)} of{" "}
          {totalProducts} entries
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, products.length, page, pages, hasSearchFilter]);

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => handleDeleteProduct(productToDelete)}
        title="Delete Confirmation"
        rolling={rolling}
      >
        <Text as="p" className="py-4 sm:text-lg">
          Are you sure you want to delete this product?
        </Text>
      </ConfirmationModal>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[325px]",
          tr: "first:rounded-none last:rounded-none",
          th: "first:rounded-none last:rounded-none bg-black text-white",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        radius="none"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No products found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductList;
