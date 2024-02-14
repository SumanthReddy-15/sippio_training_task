import React, { useEffect, useState } from "react";
import AppBreadcrumbs from "../common/bread-crumbs";
import {
  useGetPrivilegesQuery,
  usePostPrivilegesMutation,
} from "../../store/usersApi";
import { Button, Checkbox } from "@fluentui/react-components";

const PrivilegesData = () => {
  const initialPrivileges = [
    { partCode: "SBR-ADD", description: "", isChecked: false },
    { partCode: "SBR-VIW", description: "", isChecked: false },
    { partCode: "SBR-EDT", description: "", isChecked: false },
    { partCode: "SBR-DEL", description: "", isChecked: false },
  ];

  const [privileges, setPrivileges] = useState(initialPrivileges);
  const { data: privilegesData, isSuccess } = useGetPrivilegesQuery();
  const [postPrivileges, { isSuccess: isPostSuccess, isError: isPostError }] =
    usePostPrivilegesMutation();

  useEffect(() => {
    if (isSuccess && privilegesData?.records) {
      const updatedPrivileges = privileges.map((privilege) => ({
        ...privilege,
        isChecked: privilegesData.records.includes(privilege.partCode),
      }));

      setPrivileges(updatedPrivileges);
    }
  }, [privilegesData, isSuccess]);

  const handleCheckboxChange = (partCode) => {
    const updatedPrivileges = privileges.map((privilege) => {
      if (privilege.partCode === partCode) {
        return { ...privilege, isChecked: !privilege.isChecked };
      }
      return privilege;
    });

    setPrivileges(updatedPrivileges);
  };

  const getCheckedPrivileges = () => {
    return privileges
      .filter((privilege) => privilege.isChecked)
      .map((privilege) => privilege.partCode);
  };

  const handleSubmit = async () => {
    const checkedPrivileges = getCheckedPrivileges();
    console.log("checkedPrivileges", checkedPrivileges);
    try {
      await postPrivileges({ privileges: checkedPrivileges });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderCheckboxes = () => {
    return privileges.map((privilege, index) => (
      <Checkbox
        key={index}
        label={privilege.partCode}
        checked={privilege.isChecked}
        onChange={() => handleCheckboxChange(privilege.partCode)}
      />
    ));
  };

  return (
    <div className="border">
      <div className="p-bc-m">
        <AppBreadcrumbs />
      </div>
      <hr className="hr" />
      <div className="header-view">
        {renderCheckboxes()}
        <Button onClick={handleSubmit}>Submit Changes</Button>
      </div>
    </div>
  );
};

export default PrivilegesData;
