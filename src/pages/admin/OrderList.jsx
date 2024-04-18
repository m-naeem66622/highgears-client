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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ORDERS_URL } from "../../constants";
import { SearchIcon } from "../../assets/SearchIcon";
import { VerticalDotsIcon } from "../../assets/VerticalDotsIcon";
import { ChevronDownIcon } from "../../assets/ChevronDownIcon";
import {
  capitalize,
  formatPhoneNumber,
  toTitleCase,
} from "../../utils/strings";
import { orderColumns as columns, orderStatus } from "../../staticData";
import { CustomButton } from "../../components/CustomButton";
import { Link } from "react-router-dom";
import { notify } from "../../utils/notify";
import axios from "axios";
import propTypes from "prop-types";
import { toast } from "react-toastify";

const statusColorMap = {
  CANCELLED: "danger",
  PENDING: "warning",
  PAID: "success",
  PROCESSING: "warning",
  SHIPPED: "primary",
  COMPLETED: "success",
};

const INITIAL_VISIBLE_COLUMNS = [
  "_id",
  "user.name",
  "totalPrice",
  "orderStatus",
  "actions",
];

const OrderList = ({ status }) => {
  document.title = "Admin | Manage Orders | Grand Online Store";
  const [filterValue, setFilterValue] = React.useState();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "placedAt",
    direction: "descending",
  });
  const [orders, setOrders] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [totalOrders, setTotalOrders] = React.useState(0);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.orderStatus.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredOrders;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, filterValue]);

  const [pages, setPages] = React.useState(
    Math.ceil(filteredItems.length / limit)
  );

  const sortedItems = React.useMemo(() => {
    return [...orders].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, orders]);

  const formattedQuery = (params) => {
    return Object.keys(params)
      .map((k) => {
        return Array.isArray(params[k])
          ? params[k].map((v) => `${k}[]=${v}`).join("&")
          : `${k}=${params[k]}`;
      })
      .join("&");
  };

  const fetchOrders = async (fromStart = false) => {
    try {
      const query = { limit, page: page || fromStart || 1 };
      if (status) query.orderStatus = status;
      const response = await axios.get(
        `${ORDERS_URL}?${formattedQuery(query)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setPages(response.data.pagination.totalPages);
      setLimit(response.data.pagination.limit);
      setTotalOrders(response.data.pagination.totalOrders);
      setOrders(response.data.data);
    } catch (error) {
      console.log("Error while fetching orders:", error.response?.data);
      let message;
      if (!error.response) {
        message = error.message;
      } else {
        message = error.response.data.error?.message;
        if (error.response.status === 404) {
          // reset the orders state
          setOrders([]);
          setTotalOrders(0);
        }
      }

      notify("error", message);
    }
  };

  const updateStatus = async (orderId, status) => {
    const resolveWithSomeData = new Promise((resolve, reject) => {
      axios
        .put(
          `${ORDERS_URL}/${orderId}`,
          { orderStatus: status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        )
        .then((response) => {
          setOrders((prev) =>
            prev.map((order) =>
              order._id === orderId ? { ...order, orderStatus: status } : order
            )
          );
          resolve(response.data);
        })
        .catch((error) => {
          console.log("Error while updating status:", error);
          reject(error.response ? error.response.data : { error });
        });
    });

    toast.promise(resolveWithSomeData, {
      pending: {
        render() {
          return "Updating status...";
        },
        // icon: false,
      },
      success: {
        render({ data }) {
          return data.message;
        },
      },
      error: {
        render({ data }) {
          // When the promise reject, data will contains the error
          return data.error.message;
        },
      },
    });
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, visibleColumns, limit]);

  useEffect(() => {
    setPage(1);
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const renderCell = React.useCallback((order, columnKey) => {
    const cellValue = order[columnKey];
    switch (columnKey) {
      case "orderStatus":
        return (
          <Select
            items={orderStatus}
            name="orderStatus"
            radius="none"
            aria-label="Order Status"
            placeholder={cellValue}
            selectedKeys={[cellValue]}
            onChange={(e) => updateStatus(order._id, e.target.value)}
            renderValue={(items) => {
              return items.map((item) => (
                <Chip
                  key={item.key}
                  className="capitalize"
                  color={statusColorMap[item.key]}
                  size="md"
                  variant="solid"
                >
                  {item.key}
                </Chip>
              ));
            }}
          >
            {(item) => (
              <SelectItem key={item.key} textValue={item.label}>
                <Chip
                  className="capitalize"
                  color={statusColorMap[item.key]}
                  size="md"
                  variant="solid"
                >
                  {item.label}
                </Chip>
              </SelectItem>
            )}
          </Select>
        );
      case "placedAt":
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
      case "user.name":
        return toTitleCase(order.user.firstName + " " + order.user.lastName);
      case "user.email":
        return order.user.email;
      case "user.phoneNumber":
        return formatPhoneNumber(order.user.phoneNumber);
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
              <DropdownMenu aria-label="Actions for order">
                <DropdownItem to={`/admin/orders/${order._id}`} as={Link}>
                  View
                </DropdownItem>
                <DropdownItem to={`/admin/orders/edit/${order._id}`} as={Link}>
                  Edit
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
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-600 text-small">
            Total {totalOrders} orders
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterValue,
    visibleColumns,
    onLimitChange,
    orders.length,
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
          {Math.min((page - 1) * limit + filteredItems.length)} of {totalOrders}{" "}
          entries
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, orders.length, page, pages, hasSearchFilter]);

  return (
    <>
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
        <TableBody emptyContent={"No orders found"} items={sortedItems}>
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

OrderList.propTypes = {
  status: propTypes.string,
};

export default OrderList;
