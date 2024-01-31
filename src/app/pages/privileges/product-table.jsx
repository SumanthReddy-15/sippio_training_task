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
import React, { useEffect } from "react";
import headingsData from "../common/json-data";

const ProductTable = ({ productData, onTotalQuantityChange }) => {
  // console.log(productData);
  const { headings } = headingsData.en;
  useEffect(() => {
    let totalQuantity = 0;
    productData.forEach((obj) => {
      totalQuantity += parseInt(obj.quantity, 10);
    });
    onTotalQuantityChange(totalQuantity);
  }, [productData, onTotalQuantityChange]);

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
                        {obj.productName}
                        <span>{obj.productCode}</span>
                      </div>
                      <div>
                        {headings.country}:{" "}
                        <span className="font-w">{obj.country}</span>
                      </div>
                      <div>
                        {headings.planConnection}:{" "}
                        <span className="font-w">
                          {obj.plan_activation?.charAt(0).toUpperCase() +
                            obj.plan_activation.slice(1)}
                        </span>
                      </div>
                      <div>
                        {headings.platform}:{" "}
                        <span className="font-w">{obj.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Text>{obj.location}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{obj.quantity}</Text>
                    </TableCell>
                    <TableCell>
                      {obj?.chargeName?.map((charge, j) => {
                        return <div key={j}>{charge?.chargeName}</div>;
                      })}
                    </TableCell>
                    <TableCell>
                      {obj?.chargeName?.map((charge, j) => {
                        return (
                          <div key={j}>${charge?.buyingPrice.toFixed(2)}</div>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      <div>{""}</div>
                      <div>
                        {obj?.requestedPrice
                          ? `$${parseFloat(obj?.requestedPrice).toFixed(2)}`
                          : ""}
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
    </div>
  );
};
export default ProductTable;
