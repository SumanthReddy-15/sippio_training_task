/* eslint-disable no-unused-vars */
import React from "react";
import AppBreadcrumbs from "../common/bread-crumbs";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from "@fluentui/react-components";
import { ArrowLeft24Regular } from "@fluentui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import headingsData from "../common/json-data";
import { useGetSpecialBidsByIdQuery } from "../../store/usersApi";
import moment from "moment";
import { GridShim } from "@fluentui/react-migration-v0-v9";

const ViewSpecialBids = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { headings } = headingsData.en;
  const handleLastPage = () => {
    navigate(`/specialBids`);
  };
  const { data: specialBidsData, isLoading } = useGetSpecialBidsByIdQuery(id);
  console.log(specialBidsData);

  const toCapitalizedWords = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b[a-z]/g, (char) => char.toUpperCase());
  };

  return (
    <div className="border">
      <div className="table-header">
        <AppBreadcrumbs />
        <Button
          icon={<ArrowLeft24Regular />}
          appearance="transparent"
          style={{ marginLeft: "10px" }}
          onClick={handleLastPage}
        ></Button>
      </div>
      <hr className="hr" />
      {isLoading ? (
        <Spinner
          label="Loading..."
          size="small"
          style={{ margin: "100px 450px" }}
        />
      ) : (
        specialBidsData?.result?.map((data, i) => {
          return (
            <div key={i} className="table-view">
              <div className="v-table-p">
                <GridShim columns={3}>
                  <div>
                    <p>
                      {" "}
                      {headings.type}:{" "}
                      {toCapitalizedWords(
                        data?.specialBidType ? data?.specialBidType : "-"
                      )}{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      {headings.status}:{" "}
                      {data?.processStatus ? data?.processStatus : "-"}{" "}
                    </p>
                  </div>
                  {data?.collaborators?.map((bid, i) => (
                    <div key={i}>
                      <p>
                        {" "}
                        {headings.modifiedBy} {bid?.email}{" "}
                      </p>
                      <p>
                        {" "}
                        {headings.modifiedOn}{" "}
                        {data?.createTimestamp
                          ? moment(bid.createTimestamp).format(
                              "MMM DD, YYYY HH:mm:ss"
                            )
                          : data?.modifyTimestamp
                          ? moment(bid.modifyTimestamp).format(
                              "MMM DD, YYYY HH:mm:ss"
                            )
                          : "-"}
                      </p>
                    </div>
                  ))}
                </GridShim>
                <div>
                  <div className="m-t-20">
                    <Text weight="semibold" size={400}>
                      {" "}
                      {headings.partnerDetails}{" "}
                    </Text>
                    <GridShim columns={3}>
                      <div className="m-t-10 d-flex ">
                        <Text> {headings.accountNumber} </Text>
                        <Text weight="semibold" className="m-t-10">
                          {" "}
                          {data?.subscriberId}
                        </Text>
                      </div>
                      <div className="m-t-10 d-flex ">
                        <Text> {headings.accountName} </Text>
                        <Text weight="semibold" className="m-t-10">
                          {" "}
                          {data?.partnerName}
                        </Text>
                      </div>
                    </GridShim>
                  </div>
                  <div className="m-t-20">
                    <Text weight="semibold" size={400}>
                      {" "}
                      {headings.customerDetails}{" "}
                    </Text>
                    <GridShim>
                      <div className="m-t-10 d-flex ">
                        <Text> {headings.accountNumber} </Text>
                        <Text weight="semibold" className="m-t-10">
                          {" "}
                          {data?.subscriberId}
                        </Text>
                      </div>
                      <div className="m-t-10 d-flex ">
                        <Text> {headings.accountName} </Text>
                        <Text weight="semibold" className="m-t-10">
                          {" "}
                          {data?.specialBidName ? data?.specialBidName : "-"}
                        </Text>
                      </div>
                    </GridShim>
                  </div>
                  <div className="m-t-20">
                    <Text weight="semibold" size={400}>
                      {" "}
                      {headings.contactDetails}{" "}
                    </Text>
                    {data?.collaborators?.map((bid, i) => (
                      <GridShim key={i} columns={3}>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.requestPreparedBy} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {bid?.email}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.partnerPointOfContactName} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.requestedName}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.partnerPointOfContactEmail} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.requestedEmail}
                          </Text>
                        </div>
                      </GridShim>
                    ))}
                  </div>
                  <div className="card-product m-t-20">
                    <div className="product">
                      <h3>{headings.productsServices}</h3>
                    </div>
                    <div className="m-l-10 v-tb">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHeaderCell style={{ width: "200px" }}>
                              <Text weight="semibold">{headings.items}</Text>
                            </TableHeaderCell>
                            <TableHeaderCell>
                              <Text weight="semibold">
                                {headings.locations}
                              </Text>
                            </TableHeaderCell>
                            <TableHeaderCell>
                              <Text weight="semibold">{headings.quantity}</Text>
                            </TableHeaderCell>
                            <TableHeaderCell style={{ width: "200px" }}>
                              <Text weight="semibold">
                                {headings.chargeName}
                              </Text>
                            </TableHeaderCell>
                            <TableHeaderCell>
                              <Text weight="semibold">
                                {headings.partnerBuyingPrice}
                              </Text>
                            </TableHeaderCell>
                            <TableHeaderCell>
                              <Text weight="semibold">
                                {headings.requestPrice}
                              </Text>
                            </TableHeaderCell>
                          </TableRow>
                        </TableHeader>
                        {data?.products?.map((bid, i) => (
                          <TableBody key={i}>
                            {bid?.pricing?.map((price, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  <div>
                                    <Text
                                      weight="semibold"
                                      className="text-color"
                                    >
                                      {bid?.productName} ({bid?.productCode})
                                    </Text>
                                  </div>
                                  <div className="m-t-10">
                                    <Text>{bid?.productDescription}</Text>
                                  </div>
                                  <div className="m-t-10">
                                    {headings.country}:{" "}
                                    <Text weight="semibold">
                                      {bid?.availabilityName}{" "}
                                    </Text>
                                  </div>
                                  <div>
                                    {headings.planConnection}:{" "}
                                    <Text weight="semibold">
                                      {price?.plan_activation
                                        .charAt(0)
                                        .toUpperCase() +
                                        price?.plan_activation.slice(1)}
                                    </Text>
                                  </div>
                                  <div>
                                    {headings.platform}:{" "}
                                    <Text weight="semibold">
                                      {price?.platform}
                                    </Text>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Text> {bid?.serviceLocations} </Text>
                                </TableCell>
                                <TableCell>
                                  <Text> {bid?.quantity} </Text>
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <Text>{price?.chargeName}</Text>
                                </TableCell>
                                <TableCell>
                                  <Text>
                                    {price?.buyingPrice
                                      ? `$${parseFloat(
                                          price?.buyingPrice
                                        ).toFixed(2)}`
                                      : "-"}
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <Text>
                                    {price?.requestPrice
                                      ? `$${parseFloat(
                                          price?.requestPrice
                                        ).toFixed(2)}`
                                      : ""}
                                  </Text>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        ))}
                      </Table>
                    </div>
                  </div>
                  <div className="m-t-20">
                    <Text weight="semibold" size={400}>
                      {" "}
                      {headings.contractDetails}{" "}
                    </Text>
                    {data?.collaborators?.map((bid, i) => (
                      <GridShim key={i} columns={3}>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.contractTerm} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.contractTerm}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.totalCommittedQuantity} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.committedQuantity}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.volumeCommitmentQuantity} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.volumeCommitmentQuantity
                              ? data?.volumeCommitmentQuantity
                              : "-"}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.anticipatedRolloutStart} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.estimatedStartDate
                              ? moment(data.estimatedStartDate).format(
                                  "MMM DD, YYYY"
                                )
                              : "-"}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.proposedCompletion} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.estimatedEndDate
                              ? moment(data.estimatedEndDate).format(
                                  "MMM DD, YYYY "
                                )
                              : "-"}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.concession} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.concession ? data?.concession : "-"}
                          </Text>
                        </div>
                        <div className="m-t-10 d-flex ">
                          <Text> {headings.commentsRequirements} </Text>
                          <Text weight="semibold" className="m-t-10">
                            {" "}
                            {data?.commentsRequirements
                              ? data?.commentsRequirements
                              : "-"}
                          </Text>
                        </div>
                      </GridShim>
                    ))}
                  </div>
                  <div className="card-product m-t-20">
                    <div className="product">
                      <h3>{headings.attachments}</h3>
                    </div>
                    <div className="m-l-20 p-tb-20">
                      <p>{headings.none}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-top"></div>

              <div className="m-20">
                <Button onClick={handleLastPage}>{headings.back}</Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ViewSpecialBids;
