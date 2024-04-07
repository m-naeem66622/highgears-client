import React, { useEffect, useState } from "react";
import Text from "../../components/Text";
import { useSelector } from "react-redux";
import { Tabs, Tab } from "@nextui-org/react";
import { useSearchParams } from "react-router-dom";
import { toTitleCase } from "../../utils/strings";
import Profile from "../../components/private/Profile";
import ComingSoon from "../ComingSoon";

const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams({ hello: "world" });
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [selectedKeys, setSelectedKeys] = useState();

  useEffect(() => {
    if (!searchParams.get("tab")) setSearchParams({ tab: "profile" });
  }, []);

  useEffect(() => {
    if (selectedKeys) setSearchParams({ tab: selectedKeys });
  }, [searchParams.get("tab"), selectedKeys]);

  return (
    <div className="">
      <Text as="h3" className="mb-4 text-center">
        Hi! {toTitleCase(userInfo.firstName)} {toTitleCase(userInfo.lastName)}
      </Text>
      <div className="flex gap-x-2">
        {/* Left Pane */}
        <Tabs
          aria-label="Account Options"
          variant="light"
          radius="none"
          classNames={{
            tabList: "flex flex-col w-[250px]",
            cursor: "bg-black",
            tabContent:
              "group-data-[selected=true]:text-white hover:text-neutral-500",
            tab: "data-[hover-unselected=true]:opacity-75",
            panel: "w-full",
          }}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <Tab key="profile" title="Profile">
            <Profile />
          </Tab>
          <Tab key="orders" title="My Orders">
            <ComingSoon />
          </Tab>
          <Tab key="reviews" title="My Reviews">
            <ComingSoon />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
