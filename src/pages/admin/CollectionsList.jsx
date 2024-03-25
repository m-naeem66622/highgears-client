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
import { collectionColumns as columns } from "../../staticData";
import { CustomButton } from "../../components/CustomButton";
import { Link } from "react-router-dom";
import axios from "axios";
import { COLLECTIONS_URL } from "../../constants";
import { notify } from "../../utils/notify";
import ConfirmationModal from "../../components/ConfirmationModal";
import Text from "../../components/Text";

const showOnHomepageColorMap = { true: "success", false: "danger" };

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "productsCount",
  "showOnHomepage",
  "actions",
];

const CollectionsList = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [collections, setCollections] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [totalCollections, setTotalCollections] = React.useState(0);
  const [collectionToDelete, setCollectionToDelete] = React.useState(null);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredCollections = [...collections];

    if (hasSearchFilter) {
      filteredCollections = filteredCollections.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCollections;
  }, [collections, filterValue]);

  const [pages, setPages] = React.useState(
    Math.ceil(filteredItems.length / limit)
  );

  const sortedItems = React.useMemo(() => {
    return [...collections].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, collections]);

  const handleDeleteCollection = async (slug) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${COLLECTIONS_URL}/${slug}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then(() => {
          notify("success", "Collection deleted successfully");

          if (page < pages) {
            // fetchCollections();
            // TODO: Fetch new collections
          } else {
            setCollections((prev) =>
              prev.filter((collection) => collection.slug !== slug)
            );
            const newTotalCollections = collections.length - 1;
            setPages(Math.ceil(newTotalCollections / limit));
          }

          resolve(); // Resolve the promise if the deletion was successful
        })
        .catch((error) => {
          let message;

          if (!error.response) message = error.message;
          else message = toTitleCase(error.response?.data.error.message);

          console.log("Error:", error.response?.data);
          notify("error", message);
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

  const fetchCollections = async () => {
    try {
      const query = {
        limit: limit,
        page: page || 1,
        queryType: "table",
      };
      const response = await axios.get(
        `${COLLECTIONS_URL}?${formattedQuery(query)}`
      );

      setPages(response.data.pagination.totalPages);
      setLimit(response.data.pagination.limit);
      setTotalCollections(response.data.pagination.totalCollections);
      setCollections(response.data.data);
    } catch (error) {
      console.log("Error while fetching collection:", error.response);
      let message;
      if (!error.response) {
        message = error.message;
      } else {
        message = error.response.data;
      }

      notify("error", message);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [page, visibleColumns, limit]);

  const renderCell = React.useCallback((collection, columnKey) => {
    const cellValue = collection[columnKey];
    switch (columnKey) {
      case "showOnHomepage":
        return (
          <Chip
            className="capitalize"
            color={showOnHomepageColorMap[collection.showOnHomepage]}
            size="md"
            variant="flat"
            radius="sm"
          >
            {collection.showOnHomepage ? "Yes" : "No"}
          </Chip>
        );
      case "createdAt":
        return new Date(cellValue).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "updatedAt":
        return new Date(cellValue).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
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
              <DropdownMenu aria-label="Actions for collection">
                <DropdownItem to={`/collections/${collection.slug}`} as={Link}>
                  View
                </DropdownItem>
                <DropdownItem
                  to={`/admin/collections/edit/${collection.slug}`}
                  as={Link}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setCollectionToDelete(collection.slug);
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
  }, []);

  const onLimitChange = React.useCallback((e) => {
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
              to="/admin/collections/create?redirect=/collections"
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
            Total {totalCollections} collections
          </span>
          <label className="flex items-center text-default-600 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-600 text-small"
              onChange={onLimitChange}
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
  }, [
    filterValue,
    visibleColumns,
    onLimitChange,
    collections.length,
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
          {totalCollections} entries
        </div>
      </div>
    );
  }, [selectedKeys, collections.length, page, pages, hasSearchFilter]);

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => handleDeleteCollection(collectionToDelete)}
        title="Delete Confirmation"
      >
        <Text as="p" className="py-4 lg:text-lg">
          Are you sure you want to delete this collection?
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
        <TableBody emptyContent={"No collections found"} items={sortedItems}>
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

export default CollectionsList;
