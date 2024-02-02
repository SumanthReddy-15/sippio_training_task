// eslint-disable-next-line no-unused-vars
import React from "react";
import PrivilegesData from "../pages/privileges/privileges-data";
import SpecialBids from "../pages/privileges/special-bids";
import Profile from "../core/components/profile";
import AddSpecialBids from "../pages/privileges/add-special-bids";
import ViewSpecialBids from "../pages/privileges/view-special-bids";

const RoutesData = () => {
  const routeElements = [
    {
      path: "/privileges",
      component: PrivilegesData,
      props: {},
    },
    {
      path: "/specialBids",
      component: SpecialBids,
      props: {},
    },
    {
      path: "/specialBids/add",
      component: AddSpecialBids,
      props: {},
    },
    {
      path: "/specialBids/:id/view",
      component: ViewSpecialBids,
      props: {},
    },
    {
      path: "/profile",
      component: Profile,
      props: {},
    },
  ];

  const routes = routeElements.map((route) => ({
    path: route.path,
    element: <route.component {...route.props} />,
    // element: React.Component(route.component, { ...route.props }),
  }));

  return routes;
};

export default RoutesData;
