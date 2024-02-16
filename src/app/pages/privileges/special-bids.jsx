/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  MessageBar,
  MessageBarBody,
  ProgressBar,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Tooltip,
} from "@fluentui/react-components";
import {
  Add24Filled,
  ArrowClockwise20Filled,
  DeleteRegular,
  EditRegular,
  EyeRegular,
} from "@fluentui/react-icons";
import AppBreadcrumbs from "../common/bread-crumbs";
import { Link } from "react-router-dom";
import {
  useDeleteSpecialBidsMutation,
  useGetPrivilegesQuery,
  useGetSpecialBidsQuery,
} from "../../store/usersApi";
import headingsData from "../common/json-data";
import { callMsGraph } from "../../core/settings/graph";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../core/settings/authconfig";
import moment from "moment";
import { ToastContainer } from "react-toastify";

const SpecialBids = () => {
  const { accounts, instance } = useMsal();
  const [userData, setUserData] = useState({});
  const {
    data: specialBidsData,
    isLoading,
    refetch: refetchBidsData,
  } = useGetSpecialBidsQuery();
  // console.log(specialBidsData);
  const [
    deleteSpecialBids,
    { isLoading: isDeleteLoading, error: deleteError },
  ] = useDeleteSpecialBidsMutation();
  const {
    data: privilegesData,
    isSuccess,
    refetch: refetchPrivileges,
  } = useGetPrivilegesQuery();
  console.log("privilegesData", privilegesData);

  const [customLoading, setCustomLoading] = useState(false);
  const { headings } = headingsData.en;

  const [progressBarActive, setProgressBarActive] = useState(false);
  const showLoading = progressBarActive || isLoading || isDeleteLoading;

  const handleDelete = async (id) => {
    // console.log("Deleting ID:", id);
    try {
      await deleteSpecialBids(id).unwrap();
      // console.log("Delete response:", response);
      await refetchBidsData();
    } catch (error) {
      console.error("Failed to delete special bid", error);
    }
  };
  const RefreshData = () => {
    refetchBidsData();
    setProgressBarActive(true);
    setTimeout(() => {
      setProgressBarActive(false);
    }, 3000);
  };
  useEffect(() => {
    refetchBidsData();
    refetchPrivileges();
  }, []);

  useEffect(() => {
    if (isLoading) {
      setCustomLoading(true);
    } else {
      setCustomLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        const data = await callMsGraph(response.accessToken);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [accounts, instance]);

  const userName = userData.displayName;

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const options = {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   };
  //   return date.toLocaleDateString("en-US", options);
  // };

  const toCapitalizedWords = (str) => {
    return (
      str
        // Insert a space before all caps
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // Capitalize the first character of each word
        .replace(/\b[a-z]/g, (char) => char.toUpperCase())
    );
  };

  const renderProgressBar = () => {
    return progressBarActive ? <ProgressBar /> : <hr className="hr" />;
  };

  return (
    <div className="view-border">
      <ToastContainer />
      <div className="table-header">
        <AppBreadcrumbs />
        <div className="h-b">
          <div className="header-button">
            <Button
              icon={<ArrowClockwise20Filled />}
              appearance="default"
              className="btn"
              onClick={RefreshData}
              disabled={isLoading}
            >
              {headings.refresh}
            </Button>
          </div>
          <div>
            <Link to={`/specialBids/add`}>
              <Button
                icon={<Add24Filled />}
                className="btn"
                appearance="primary"
                disabled={
                  privilegesData && privilegesData?.records?.includes("SBR-ADD")
                    ? false
                    : true
                }
              >
                {headings.add}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {renderProgressBar()}
      <div className="table-sb">
        <Table>
          {specialBidsData?.records?.length > 0 && (
            <TableHeader>
              <TableRow>
                <TableHeaderCell className="partner-account-name">
                  <Text weight="bold" className="m-tb-20">
                    {headings.partnerAccountName}
                  </Text>
                </TableHeaderCell>
                <TableHeaderCell className="subscriber-account-name">
                  <Text weight="bold">{headings.SubscriberAccountName}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="subscriber-account-number">
                  <Text weight="bold">{headings.SubscriberAccountNumber}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="special-bid-number">
                  <Text weight="bold">{headings.SpecialBidNumber}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="name">
                  <Text weight="bold">{headings.name}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="type">
                  <Text weight="bold">{headings.type}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="created-date">
                  <Text weight="bold">{headings.createdDate}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="status">
                  <Text weight="bold">{headings.status}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="user">
                  <Text weight="bold">{headings.user}</Text>
                </TableHeaderCell>
                <TableHeaderCell className="actions">
                  <Text weight="bold">{headings.actions}</Text>
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
          )}

          <TableBody>
            {showLoading ? (
              <div>
                <Spinner
                  label="Loading..."
                  size="small"
                  style={{ margin: "200px 500px" }}
                />
              </div>
            ) : specialBidsData?.records?.length ? (
              specialBidsData?.records?.map((bid) => {
                return (
                  <TableRow key={bid.id}>
                    <TableCell>
                      <Tooltip content={bid.partnerName} relationship="label">
                        <TableCellLayout truncate>
                          {bid.partnerName ? bid.partnerName : "-"}
                        </TableCellLayout>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {" "}
                      {bid.subscriberName ? bid.subscriberName : "-"}{" "}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {bid.subscriberId ? bid.subscriberId : "-"}{" "}
                    </TableCell>
                    <TableCell>
                      {bid.createTimestamp
                        ? bid.createTimestamp
                        : bid.modifyTimestamp
                        ? bid.modifyTimestamp
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {bid.specialBidName ? bid.specialBidName : "-"}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {bid.specialBidType
                        ? toCapitalizedWords(bid.specialBidType)
                        : "-"}{" "}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {bid.createTimestamp
                        ? moment(bid.createTimestamp).format(
                            "MMM DD, YYYY HH:mm:ss"
                          )
                        : bid.modifyTimestamp
                        ? moment(bid.modifyTimestamp).format(
                            "MMM DD, YYYY HH:mm:ss"
                          )
                        : "-"}{" "}
                    </TableCell>
                    <TableCell>
                      <Text>{bid.processStatus ? bid.processStatus : "-"}</Text>
                    </TableCell>
                    <TableCell>
                      <Tooltip content={userName} relationship="label">
                        <TableCellLayout truncate>
                          {userName ? userName : "-"}
                        </TableCellLayout>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="b-g">
                        {privilegesData &&
                        privilegesData?.records?.includes("SBR-VIW") ? (
                          <Tooltip content="View" relationship="label">
                            <Link
                              to={{
                                pathname: `/specialBids/${bid.id}/view`,
                              }}
                            >
                              <Button
                                icon={<EyeRegular className="i-color" />}
                                aria-label="View"
                                appearance="transparent"
                              />
                            </Link>
                          </Tooltip>
                        ) : null}
                        {privilegesData &&
                        privilegesData?.records?.includes("SBR-EDT") ? (
                          <Tooltip content="Edit" relationship="label">
                            <Link
                              to={{
                                pathname: `/specialBids/${bid.id}/edit`,
                              }}
                            >
                              <Button
                                icon={<EditRegular className="i-color" />}
                                aria-label="Edit"
                                appearance="transparent"
                              />
                            </Link>
                          </Tooltip>
                        ) : null}
                        {privilegesData &&
                        privilegesData?.records?.includes("SBR-DEL") ? (
                          <Tooltip content="Delete" relationship="label">
                            <Button
                              icon={<DeleteRegular className="i-color" />}
                              aria-label="Delete"
                              appearance="transparent"
                              onClick={() => handleDelete(bid.id)}
                            />
                          </Tooltip>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <MessageBar>
                <MessageBarBody>No Special Bids available</MessageBarBody>
              </MessageBar>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SpecialBids;
