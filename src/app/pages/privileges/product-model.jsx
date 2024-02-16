/* eslint-disable react/prop-types */
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
  Spinner,
  MessageBar,
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
  modalData,
  modelStatus,
  productData,
}) => {
  console.log("productData...", productData);
  // console.log("modalData...", modalData);
  // console.log(partnerId);
  const [showLoading, setShowLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [productsData, setProductData] = useState();
  const [progressBarActive, setProgressBarActive] = useState(false);
  const [plainTypeData, setPlainTypeData] = useState();
  const [selectedRadio, setSelectedRadio] = useState();
  const [filteredProducts, setFilteredProducts] = useState([]);
  console.log("filteredProducts", filteredProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [platformOptions, setPlatformOptions] = useState([]);
  const DEFAULT_ADDITIONAL_DATA = {
    platform: "",
    quantity: "",
    locations: "",
    comments: "",
    requestedPrice: "",
    productName: "",
    productCode: "",
    productDescription: "",
    chargeType: "",
  };
  const [additionalFields, setAdditionalFields] = useState({
    platform: "",
    quantity: "",
    locations: "",
    comments: "",
    requestedPrice: "",
    productName: "",
    productCode: "",
    productDescription: "",
    chargeType: "",
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
  console.log("products", products);

  const closeDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClose();
  };
  useEffect(() => {
    if (modalData && modelStatus === "edit" && filteredProducts?.length > 0) {
      setShowLoading(true);

      const productName = modalData?.productName;
      const productCode = modalData?.productCode;
      const selectedProduct = filteredProducts?.find(
        (product) =>
          product?.productName === productName &&
          product?.productCode === productCode
      );

      if (selectedProduct) {
        setSelectedCountry(modalData?.country);
        setSelectedProduct(`${productName} (${productCode})`);
        setSelectedRadio(modalData?.plan_activation);

        if (selectedProduct?.communicationPlatforms) {
          setPlatformOptions(
            selectedProduct?.communicationPlatforms?.map(
              (platform) => platform?.name
            )
          );
        }

        setAdditionalFields({
          platform: modalData.platform,
          quantity: modalData.quantity,
          locations: modalData.location,
          comments: modalData.comments,
          requestedPrice: modalData.requestedPrice,
          productName: productName,
          productCode: productCode,
          productDescription: modalData.productDescription,
          chargeType: modalData.chargeType,
        });
      }

      setShowLoading(false);
    }
  }, [modalData, modelStatus, filteredProducts]);

  const handleCountrySelect = (event, country) => {
    event.persist();
    const newSelectedCountry = country?.optionValue;
    setSelectedCountry(newSelectedCountry);
    setProgressBarActive(true);
    setTimeout(() => setProgressBarActive(false), 3000);
    setSelectedProduct(null);
    setFilteredProducts([]);
    setProductData(null);
    setPlainTypeData(null);
    setSelectedRadio(null);
  };

  const handleProductSelect = (event, product) => {
    const selectProduct = product?.optionValue;
    setSelectedProduct(selectProduct);
    // console.log(selectProduct, "selectProduct");
    const result = selectProduct?.substring(
      0,
      selectProduct?.indexOf(" (") !== -1
        ? selectProduct?.indexOf(" (")
        : selectProduct?.length
    );

    let data = products?.records?.filter((obj) => {
      return obj.productName === result;
    });
    // console.log(result, selectProduct, data);

    setProductData(data[0]);
    setAdditionalFields(data[0]);
  };

  const onPlanChange = (event) => {
    let selectedPlan = event.target.value;
    setSelectedRadio(selectedPlan);
    let data = productsData?.planTypes?.filter((obj) => {
      return obj.planName?.toLowerCase() === selectedPlan;
    });
    setPlainTypeData(data);
  };

  const handleFieldChange = (field, value) => {
    // console.log("value......", value);
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
      buyingPrice: "",
      chargeName: plainTypeData[0]?.pricing,
      productName: additionalFields.productName,
      productCode: additionalFields.productCode,
      productDescription: additionalFields.productDescription,
      chargeType: additionalFields.chargeType,
      renderId: modalData?.renderId,
    };

    const isDuplicate = checkForDuplicate(submissionData);

    if (isDuplicate) {
      const error =
        "Duplicate data found. Please change the data and submit again.";
      setErrorMessage(error);
      return;
    }
    setErrorMessage("");
    console.log("Submitting data:", submissionData);
    onSubmitData(submissionData);
  };

  const checkForDuplicate = (newData) => {
    if (!modalData || typeof modalData !== "object") {
      return false;
    }
    if (Array.isArray(modalData)) {
      return modalData.some((existingData) => {
        return (
          existingData.productName === newData.productName &&
          existingData.productCode === newData.productCode &&
          existingData.country === newData.country &&
          existingData.plan_activation === newData.plan_activation &&
          existingData.platform === newData.platform
        );
      });
    } else {
      return (
        modalData.productName === newData.productName &&
        modalData.productCode === newData.productCode &&
        modalData.country === newData.country &&
        modalData.plan_activation === newData.plan_activation &&
        modalData.platform === newData.platform
      );
    }
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

  useEffect(() => {
    const modelzone = typeof modalData === "object" && modalData !== null;

    // console.log(
    //   "modelzone......",
    //   modelzone,
    //   modelStatus === "edit",
    //   modalData && modelStatus === "edit"
    // );
    if (modelzone && modelStatus === "edit") {
      setShowLoading(true);
      const productsData = {
        productName: modalData.productName,
        productCode: modalData.productCode,
      };
      console.log("productsData", productsData);
      const uniquePlainTypes = [
        ...new Set(modalData.plan_activation?.split(", ")),
      ].join(", ");
      const uniquePlatform = [...new Set(modalData.platform?.split(", "))].join(
        ", "
      );
      const uniqueRequestedPrice = [
        ...new Set(modalData.requestedPrice?.split(", ")),
      ].join(", ");

      const plainTypes = [{ pricing: modalData.chargeName }];
      console.log("plainTypes", plainTypes);
      // console.log("plainTypes...", plainTypes);
      setSelectedCountry(modalData.country);
      setProductData(productsData?.productName);
      setSelectedProduct(productsData?.productName);
      setSelectedRadio(uniquePlainTypes);
      setPlainTypeData(plainTypes);
      setAdditionalFields({
        platform: uniquePlatform,
        quantity: modalData.quantity,
        locations: modalData.location,
        comments: modalData.comments,
        requestedPrice: uniqueRequestedPrice,
        productName: modalData.productName,
        productCode: modalData.productCode,
        productDescription: modalData.productDescription,
        chargeType: modalData.chargeType,
      });
      // setIsEditMode(!!modalData.id);
      setShowLoading(false);
    } else {
      // setIsEditMode(false);
    }
  }, [modalData, modelStatus]);
  console.log("modalData", modalData);

  const renderAdditionalFields = () => {
    if (selectedRadio === "activation" || selectedRadio === "porting") {
      return (
        <>
          <div className="m-t-10">
            <GridShim columns={3} className="grid-shim">
              <div>
                <Field label="Platform" required>
                  <Dropdown
                    onOptionSelect={handlePlatformChange}
                    value={additionalFields.platform}
                    // disabled={modelStatus === "edit" ? true : false}
                  >
                    {platformOptions.length > 0
                      ? platformOptions.map((platform, i) => (
                          <Option key={i} textContent={platform}>
                            {platform}
                          </Option>
                        ))
                      : productsData?.communicationPlatforms?.map((obj, i) => (
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
                    value={additionalFields.quantity}
                    onChange={(e) =>
                      handleFieldChange("quantity", e.target.value)
                    }
                  ></Input>
                </Field>
              </div>
              <div>
                <Field label="Locations" required>
                  <Input
                    value={additionalFields.locations}
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
                      obj?.buyingPrice !== 0 &&
                      obj?.buyingPrice !== "" && (
                        <TableRow key={i}>
                          <TableCell style={{ paddingTop: "20px" }}>
                            {obj?.chargeType ? obj?.chargeType : "-"}
                          </TableCell>
                          <TableCell>
                            {obj?.chargeName ? obj?.chargeName : "-"}
                          </TableCell>
                          <TableCell>
                            $
                            {obj?.buyingPrice
                              ? obj?.buyingPrice.toFixed(2)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Input
                              defaultValue={obj?.requestPrice}
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
                value={additionalFields.comments}
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
          {showLoading ? (
            <div>
              <Spinner
                label="Loading..."
                size="small"
                style={{ margin: "200px 500px" }}
              />
            </div>
          ) : (
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
                    {errorMessage && (
                      <div style={{ marginBottom: "10px" }}>
                        <MessageBar intent="error">{errorMessage}</MessageBar>
                      </div>
                    )}
                    <div className="m-t-10 ">
                      <div>
                        <GridShim columns={3} className="grid-shim">
                          <div>
                            <Field label="Countries" required>
                              <Dropdown
                                onOptionSelect={handleCountrySelect}
                                value={selectedCountry}
                                disabled={modelStatus === "edit" ? true : false}
                              >
                                {countries.map((country) => (
                                  <Option key={country} textContent={country}>
                                    {country}
                                  </Option>
                                ))}
                              </Dropdown>
                            </Field>
                          </div>
                          <div>
                            <Field label="Product / Service" required>
                              <Dropdown
                                disabled={
                                  !selectedCountry || modelStatus === "edit"
                                    ? true
                                    : false
                                }
                                onOptionSelect={handleProductSelect}
                                value={selectedProduct}
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
                                    // value={product}
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
                          {selectedProduct && (
                            <div>
                              <Field label="Plan / Connection" required>
                                <RadioGroup
                                  layout="horizontal"
                                  value={selectedRadio}
                                  onChange={(event) => onPlanChange(event)}
                                  disabled={
                                    modelStatus === "edit" ? true : false
                                  }
                                >
                                  <Radio
                                    value="activation"
                                    label="Activation"
                                  ></Radio>
                                  <Radio
                                    value="porting"
                                    label="Porting"
                                  ></Radio>
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
              <DialogActions position="start">
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
          )}
        </DialogSurface>
      </Dialog>
    </>
  );
};

export default ProductModel;
