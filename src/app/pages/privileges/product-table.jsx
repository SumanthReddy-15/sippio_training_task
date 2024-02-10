/* eslint-disable no-unused-vars */
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Tooltip,
} from "@fluentui/react-components";
import { DeleteRegular, EditRegular } from "@fluentui/react-icons";
import React, { useEffect, useMemo, useState } from "react";
import headingsData from "../common/json-data";
import { useGetSpecialBidsByIdQuery } from "../../store/usersApi";
import { useParams } from "react-router-dom";
import ProductModel from "./product-model";

const ProductTable = ({
  productData,
  onTotalQuantityChange,
  onSubmitData,
  partnerId,
  parentDetails,
}) => {
  const { id } = useParams();
  // console.log("productData..........", productData);
  const { data: specialBidsData } = useGetSpecialBidsByIdQuery(id);
  const { headings } = headingsData.en;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  useEffect(() => {
    let totalQuantity = 0;
    productData?.forEach((obj) => {
      totalQuantity += parseInt(obj.quantity, 10);
    });
    onTotalQuantityChange(totalQuantity);
  }, [productData, onTotalQuantityChange]);

  const handleEditClick = (product) => {
    // console.log("handleEditClick", product);
    setSelectedProductForEdit(product);
    handleOpenDialog();
    // console.log("product.....", product);
  };

  return (
    <div>
      {productData?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>
                <Text weight="semibold">{headings.actions}</Text>
              </TableHeaderCell>
              <TableHeaderCell style={{ width: "200px" }}>
                <Text weight="semibold">{headings.items}</Text>
              </TableHeaderCell>
              <TableHeaderCell>
                <Text weight="semibold">{headings.locations}</Text>
              </TableHeaderCell>
              <TableHeaderCell>
                <Text weight="semibold">{headings.quantity}</Text>
              </TableHeaderCell>
              <TableHeaderCell style={{ width: "200px" }}>
                <Text weight="semibold">{headings.chargeName}</Text>
              </TableHeaderCell>
              <TableHeaderCell>
                <Text weight="semibold">{headings.partnerBuyingPrice}</Text>
              </TableHeaderCell>
              <TableHeaderCell>
                <Text weight="semibold">{headings.requestPrice}</Text>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productData &&
              productData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="b-g">
                        <Tooltip content="Edit" relationship="label">
                          <Button
                            icon={<EditRegular className="i-color" />}
                            aria-label="Edit"
                            appearance="transparent"
                            onClick={() => handleEditClick(obj)}
                          />
                        </Tooltip>
                        <Tooltip content="Delete" relationship="label">
                          <Button
                            icon={<DeleteRegular className="i-color" />}
                            aria-label="Delete"
                            appearance="transparent"
                          />
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Text weight="semibold" className="text-color">
                          {obj.productName} ({obj.productCode})
                        </Text>
                      </div>
                      <div>
                        {headings.country}:{" "}
                        <span className="font-w">{obj.country}</span>
                      </div>
                      <div>
                        {headings.planConnection}:{" "}
                        <span className="font-w">
                          {obj &&
                            obj?.plan_activation &&
                            obj?.plan_activation
                              .split(", ")
                              .map(
                                (activation) =>
                                  activation.charAt(0).toUpperCase() +
                                  activation.slice(1)
                              )[0]}
                        </span>
                      </div>
                      <div>
                        {headings.platform}:{" "}
                        <span className="font-w">
                          {obj &&
                            obj?.platform &&
                            obj?.platform
                              .split(", ")
                              .map(
                                (platform) =>
                                  platform.charAt(0).toUpperCase() +
                                  platform.slice(1)
                              )[0]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Text>{obj.location}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{obj.quantity}</Text>
                    </TableCell>
                    <TableCell>
                      {obj?.chargeName
                        ?.filter(
                          (charge) => charge.chargeName !== "Activation Fee"
                        )
                        .map((filteredCharge, j) => (
                          <div key={j}>{filteredCharge?.chargeName}</div>
                        ))}
                    </TableCell>
                    <TableCell>
                      {obj?.chargeName?.some(
                        (charge) => charge.chargeName === "Platform Charges"
                      ) &&
                        obj.chargeName
                          .filter(
                            (charge) => charge.chargeName === "Platform Charges"
                          )
                          .map((platformCharge, j) => (
                            <div key={j}>${platformCharge?.buyingPrice}</div>
                          ))}
                    </TableCell>
                    <TableCell>
                      <div>
                        {obj?.requestedPrice
                          ? `$${parseFloat(obj?.requestedPrice).toFixed(2)}`
                          : obj?.chargeName?.map((charge, j) => {
                              return <div key={j}>${charge?.requestPrice}</div>;
                            })}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      ) : (
        <p>{headings.none}</p>
      )}
      {
        <ProductModel
          key={
            selectedProductForEdit?.id || selectedProductForEdit?.productName
          }
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitData={onSubmitData}
          partnerId={selectedProductForEdit && selectedProductForEdit?.id}
          parentDetails={parentDetails}
          // selectedProductForEdit={selectedProductForEdit}
          modalData={selectedProductForEdit}
          modelStatus={"edit"}
        />
      }
    </div>
  );
};
export default ProductTable;
