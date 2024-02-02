/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Field,
  Input,
  Option,
  ProgressBar,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Textarea,
} from "@fluentui/react-components";
import { Dismiss24Filled } from "@fluentui/react-icons";
import { GridShim } from "@fluentui/react-migration-v0-v9";
import "../../../assets/special-bids.scss";
import headingsData from "../common/json-data";
import { useGetProductsQuery } from "../../store/usersApi";

const ProductModel = ({
  isOpen,
  onClose,
  onSubmitData,
  partnerId,
  parentDetails,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [productData, setProductData] = useState();
  const [progressBarActive, setProgressBarActive] = useState(false);
  const [plainTypeData, setPlainTypeData] = useState();
  const [selectedRadio, setSelectedRadio] = useState();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [additionalFields, setAdditionalFields] = useState({
    platform: "",
    quantity: "",
    locations: "",
    comments: "",
    requestedPrice: "",
    productName: "",
    productCode: "",
    productDescription: "",
  });
  const { headings } = headingsData.en;
  const {
    data: products,
    isLoading,
    refetch,
  } = useGetProductsQuery(selectedCountry, {
    skip: !selectedCountry,
  });
  const countries = ["United States", "Canada"];

  useEffect(() => {
    if (selectedCountry) {
      refetch();
    }
  }, [selectedCountry, refetch]);

  useEffect(() => {
    const filtered = products?.records?.filter(
      (product) => product?.availabilityName === selectedCountry
    );
    setFilteredProducts(filtered);
  }, [selectedCountry, products]);

  const closeDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClose();
  };

  const handleCountrySelect = (event, country) => {
    const newSelectedCountry = country?.optionValue;
    // console.log(
    //   country?.optionValue,
    //   newSelectedCountry,
    //   event.target.textContent
    // );

    setSelectedCountry(newSelectedCountry);
    setProgressBarActive(true);

    // Only refetch if newSelectedCountry is valid (non-null, non-empty)
    // if (newSelectedCountry) {
    //   refetch();
    // }

    setTimeout(() => setProgressBarActive(false), 3000);
    setSelectedProduct(null);
    setFilteredProducts([]);
    setProductData(null);
    setPlainTypeData(null);
    setSelectedRadio(null);
  };

  const handleProductSelect = (event, product) => {
    // console.log(event);
    const selectProduct = product?.optionValue;
    // console.log(selectProduct);
    setSelectedProduct(selectProduct);
    setProductData(selectProduct);
    setAdditionalFields(selectProduct);
  };

  const onPlanChange = (event) => {
    let selectedPlan = event.target.value;
    setSelectedRadio(selectedPlan);
    let data = productData?.planTypes?.filter((obj) => {
      return obj.planName?.toLowerCase() === selectedPlan;
    });
    // console.log(data);
    setPlainTypeData(data);
  };

  const handleFieldChange = (field, value) => {
    setAdditionalFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const submissionData = {
      id: partnerId,
      country: selectedCountry,
      plan_activation: selectedRadio,
      comments: additionalFields.comments,
      location: additionalFields.locations,
      platform: additionalFields.platform,
      quantity: additionalFields.quantity,
      requestedPrice: additionalFields.requestedPrice,
      chargeName: plainTypeData[0]?.pricing,
      productName: additionalFields.productName,
      productCode: additionalFields.productCode,
      productDescription: additionalFields.productDescription,
    };
    console.log("Submitting data:", submissionData);
    onSubmitData(submissionData);
  };

  const handlePlatformChange = (event, platform) => {
    handleFieldChange("platform", platform?.optionValue);
  };
  const renderProgressBar = () => {
    return progressBarActive ? <ProgressBar /> : <hr className="hr-m" />;
  };

  const isSaveEnabled = () => {
    return (
      additionalFields.quantity &&
      additionalFields.locations &&
      selectedRadio &&
      additionalFields.requestedPrice
    );
  };

  const renderAdditionalFields = () => {
    if (selectedRadio === "activation" || selectedRadio === "porting") {
      return (
        <>
          <div className="m-t-10">
            <GridShim columns={3} className="grid-shim">
              <div>
                <Field label="Platform" required>
                  <Dropdown onOptionSelect={handlePlatformChange}>
                    {productData &&
                      productData?.communicationPlatforms?.map((obj, i) => (
                        <Option key={i} textContent={obj.name}>
                          {obj.name}
                        </Option>
                      ))}
                  </Dropdown>
                </Field>
              </div>
              <div>
                <Field label="Quantity" required>
                  <Input
                    onChange={(e) =>
                      handleFieldChange("quantity", e.target.value)
                    }
                  ></Input>
                </Field>
              </div>
              <div>
                <Field label="Locations" required>
                  <Input
                    onChange={(e) =>
                      handleFieldChange("locations", e.target.value)
                    }
                  ></Input>
                </Field>
              </div>
            </GridShim>
          </div>
          <div className="m-t-20 dialog-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>
                    <Text>{headings.chargeType}</Text>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Text>{headings.chargeName}</Text>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Text>{headings.partnerBuyingPrice}</Text>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Text>{headings.requestPrice}</Text>
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plainTypeData && plainTypeData[0]?.pricing?.length > 0 ? (
                  plainTypeData[0].pricing.map((obj, i) => {
                    return (
                      obj?.buyingPrice !== 0 && (
                        <TableRow key={i}>
                          <TableCell>{obj?.chargeType}</TableCell>
                          <TableCell>{obj?.chargeName}</TableCell>
                          <TableCell>${obj?.buyingPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <Input
                              onChange={(e) =>
                                handleFieldChange(
                                  "requestedPrice",
                                  e.target.value
                                )
                              }
                              contentBefore={<Text>$</Text>}
                            ></Input>
                          </TableCell>
                        </TableRow>
                      )
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="4">
                      <Text>{headings.noData}</Text>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="m-t-20">
            <Field label="Comments">
              <Textarea
                onChange={(e) => handleFieldChange("comments", e.target.value)}
                resize="both"
                placeholder="Please provide your comments here"
              ></Textarea>
            </Field>
          </div>
        </>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Dialog open={isOpen}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              <div className="p-grid p-grid-bg">
                {headings.addProductService}
                <DialogTrigger disableButtonEnhancement>
                  <Button
                    icon={<Dismiss24Filled />}
                    appearance="transparent"
                    onClick={closeDialog}
                  />
                </DialogTrigger>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="db-w">
                {renderProgressBar()}
                <div className="dialog-data">
                  <div className="m-t-10 ">
                    <div>
                      <GridShim columns={3} className="grid-shim">
                        <div>
                          <Field label="Countries" required>
                            <Dropdown
                              onOptionSelect={handleCountrySelect}
                              value={selectedCountry}
                            >
                              {countries.map((country) => (
                                <Option key={country} textContent={country}>
                                  {country}
                                </Option>
                              ))}
                            </Dropdown>
                          </Field>
                        </div>
                        {/* </GridShim> */}
                        {/* <GridShim columns={3} className="grid-shim m-l-10"> */}
                        <div>
                          <Field label="Product / Service" required>
                            <Dropdown
                              disabled={!selectedCountry}
                              onOptionSelect={handleProductSelect}
                              value={
                                selectedProduct
                                  ? selectedProduct.productName
                                  : ""
                              }
                            >
                              {filteredProducts?.map((product) => (
                                <Option
                                  key={
                                    product?.productName +
                                    "( " +
                                    product?.productCode +
                                    ")"
                                  }
                                  textContent={
                                    product?.productName +
                                    " (" +
                                    product?.productCode +
                                    ")"
                                  }
                                  value={product}
                                >
                                  {product?.productName +
                                    " (" +
                                    product?.productCode +
                                    ")"}
                                </Option>
                              ))}
                            </Dropdown>
                          </Field>
                        </div>
                        {/* </GridShim> */}
                        {selectedProduct && (
                          <div>
                            <Field label="Plan / Connection" required>
                              <RadioGroup
                                layout="horizontal"
                                onChange={(event) => onPlanChange(event)}
                              >
                                <Radio
                                  value="activation"
                                  label="Activation"
                                ></Radio>
                                <Radio value="porting" label="Porting"></Radio>
                              </RadioGroup>
                            </Field>
                          </div>
                        )}
                      </GridShim>
                    </div>
                    {renderAdditionalFields()}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <div className="m-t-20 b-g">
                <Button
                  type="submit"
                  appearance="primary"
                  onClick={handleSubmit}
                  disabled={!isSaveEnabled()}
                >
                  {headings.save}
                </Button>

                <DialogTrigger disableButtonEnhancement>
                  <Button onClick={closeDialog}>{headings.cancel}</Button>
                </DialogTrigger>
              </div>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};

export default ProductModel;
