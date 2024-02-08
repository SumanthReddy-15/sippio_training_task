import React from "react";
import AppBreadcrumbs from "../common/bread-crumbs";
import {
  useGetPrivilegesQuery,
  usePostPrivilegesMutation,
} from "../../store/usersApi";
import { Checkbox } from "@fluentui/react-components";

const PrivilegesData = () => {
  const { data: privileges } = useGetPrivilegesQuery();
  const postPrivilegesMutation = usePostPrivilegesMutation();

  const handleCheckboxChange = async (partCode, isChecked) => {
    const updatedPrivileges = privileges.records.map((privilege) => ({
      partCode: privilege.partCode,
      privilegeStatus:
        privilege.partCode === partCode
          ? isChecked
            ? 1
            : 0
          : privilege.privilegeStatus,
    }));

    try {
      await postPrivilegesMutation.mutate(updatedPrivileges);
    } catch (error) {
      console.error("Error updating privileges:", error);
    }
  };

  const renderCheckboxes = () => {
    if (!privileges || !privileges.records) {
      return null;
    }

    return privileges.records.map((privilege) => (
      <Checkbox
        key={privilege.partCode}
        label={privilege.partCode}
        defaultChecked={privilege.privilegeStatus === 1}
        onChange={(e, isChecked) =>
          handleCheckboxChange(privilege.partCode, isChecked)
        }
      />
    ));
  };

  return (
    <div className="border">
      <div className="p-bc-m">
        <AppBreadcrumbs />
      </div>
      <hr className="hr" />
      <div className="header-view">{renderCheckboxes()}</div>
    </div>
  );
};

export default PrivilegesData;
