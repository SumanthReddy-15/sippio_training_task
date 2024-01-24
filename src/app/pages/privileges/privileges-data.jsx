// eslint-disable-next-line no-unused-vars
import { Checkbox, Table } from "@fluentui/react-components";
import React from "react";
import AppBreadcrumbs from "../common/bread-crumbs";
import { useGetPrivilegesQuery } from "../../store/usersApi";

const PrivilegesData = () => {
  const { data: privileges } = useGetPrivilegesQuery();
  console.log(privileges);

  return (
    <div className="border">
    <div className="p-bc-m">

      <AppBreadcrumbs />
    </div>
      <hr className="hr" />
      <div className="header-view">
        {/* <Table> */}
        <Checkbox label="Special Bid View" />
        <Checkbox label="Special Bid Add" />
        <Checkbox label="Special Bid Edit" />
        <Checkbox label="Special Bid Delete" />
        {/* </Table> */}
      </div>
    </div>
  );
};

export default PrivilegesData;
