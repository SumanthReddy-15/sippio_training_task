import React, { useEffect, useState } from "react";
import {
  Button,
  MessageBar,
  MessageBarBody,
  Spinner,
  Table,
  TableBody,
  TableCell,
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
  useGetSpecialBidsQuery,
} from "../../store/usersApi";

const SpecialBids = () => {
  const {
    data: specialBidsData,
    isLoading,
    refetch,
  } = useGetSpecialBidsQuery();
  console.log(specialBidsData);
  const { deleteSpecialBid } = useDeleteSpecialBidsMutation();

  const [showLoading, setShowLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     setDeleteSuccess(true);
  //     refetch();
  //   }
  // }, [isSuccess, refetch]);

  const handleDelete = async (id) => {
    try {
      await deleteSpecialBid(id).unwrap();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  const RefreshData = () => {
    refetch();
  };

  return (
    <div className="border">
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
              Refresh
            </Button>
          </div>
          <div>
            <Link to={`/specialBids/add`}>
              <Button
                icon={<Add24Filled />}
                className="btn"
                appearance="primary"
              >
                Add
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <hr className="hr" />
      <div className="t-c">
        <Table>
          {specialBidsData?.records?.length > 0 && (
            <TableHeader>
              <TableRow>
                <TableHeaderCell>
                  <Text weight="bold">Partner Name</Text>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Text weight="bold">Customer Name</Text>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Text weight="bold">Email</Text>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Text weight="bold">Actions</Text>
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
          )}

          <TableBody>
            {showLoading ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Spinner
                    label="Loading..."
                    size="small"
                    style={{ marginTop: "300px" }}
                  />
                </TableCell>
              </TableRow>
            ) : specialBidsData?.records?.length ? (
              specialBidsData.records.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell truncate>{bid.id}</TableCell>
                  <TableCell>{bid.accountName}</TableCell>
                  <TableCell>{bid.mail}</TableCell>
                  <TableCell>
                    <div className="b-g">
                      <Tooltip content="View" relationship="label">
                        <Button icon={<EyeRegular />} aria-label="View" />
                      </Tooltip>
                      <Tooltip content="Edit" relationship="label">
                        <Button icon={<EditRegular />} aria-label="Edit" />
                      </Tooltip>
                      <Tooltip content="Delete" relationship="label">
                        <Button
                          icon={<DeleteRegular />}
                          aria-label="Delete"
                          onClick={() => handleDelete(bid.id)}
                        />
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
