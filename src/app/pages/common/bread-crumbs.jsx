import React from "react";
import { Breadcrumb } from "@fluentui/react";
import { useNavigate, useLocation } from "react-router-dom";

function AppBreadcrumbs() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateBack = () => {
    navigate(`/specialBids`);
  };

  const getCurrentBreadcrumbItems = () => {
    const path = location.pathname;

    if (path === "/specialBids") {
      return [
        {
          text: "Special Bids",
          key: "specialBids",
          isCurrentItem: true,
          onClick: navigateBack,
        },
      ];
    } else if (path.includes("specialBids/") && path.includes("/edit")) {
      return [
        { text: "Special Bids", key: "home", onClick: navigateBack },
        {
          text: "Edit",
          key: "editUser",
          isCurrentItem: true,
          onClick: () => {},
        },
      ];
    } else if (path.includes("specialBids/") && path.includes("/view")) {
      const id = path.split("/")[2];
      return [
        { text: "Special Bids", key: "specialBids", onClick: navigateBack },
        { text: `${id}`},
        { text: "View", key: "view", isCurrentItem: true },
      ];
    } else if (path === "/specialBids/add") {
      return [
        { text: "Special Bids", key: "specialBids", onClick: navigateBack },
        {
          text: "Add ",
          key: "add",
          isCurrentItem: true,
        },
      ];
    } else if (path === "/profile") {
      return [
        {
          text: "Profile",
          key: "profile",
          isCurrentItem: true,
        },
      ];
    } else if (path === "/privileges") {
      return [
        {
          text: "Privileges",
          key: "privileges",
          isCurrentItem: true,
        },
      ];
    }

    return [];
  };

  const breadcrumbItems = getCurrentBreadcrumbItems();

  return <Breadcrumb items={breadcrumbItems} />;
}

export default AppBreadcrumbs;
