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
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [productData, setProductData] = useState();
  const [progressBarActive, setProgressBarActive] = useState(false);
  const [plainTypeData, setPlainTypeData] = useState();
  const [selectedRadio, setSelectedRadio] = useState();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const DEFAULT_ADDITIONAL_DATA = {
    platform: "",
    quantity: "",
    locations: "",
    comments: "",
    requestedPrice: "",
    productName: "",
    productCode: "",
    productDescription: "",
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
    console.log(selectProduct, "selectProduct");
    const result = selectProduct?.substring(
      0,
      selectProduct?.indexOf(" (") !== -1
        ? selectProduct?.indexOf(" (")
        : selectProduct?.length
    );

    let data = products?.records?.filter((obj) => {
      return obj.productName === result;
    });
    console.log(result, selectProduct, data);

    setProductData(data[0]);
    setAdditionalFields(data[0]);
  };

  const onPlanChange = (event) => {
    let selectedPlan = event.target.value;
    setSelectedRadio(selectedPlan);
    let data = productData?.planTypes?.filter((obj) => {
      return obj.planName?.toLowerCase() === selectedPlan;
    });
    setPlainTypeData(data);
  };

  const handleFieldChange = (field, value) => {
    setAdditionalFields((prev) => ({ ...prev, [field]: value }));
  };

  const [submissionDataArray, setSubmissionDataArray] = useState([]);

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
    };

    // setSubmissionDataArray((prevArray) => [...prevArray, submissionData]);
    // console.log("Submitting data:", submissionData);
    // onSubmitData(submissionData);
    // Check if partnerId is null, then create a new entry
    if (partnerId === null) {
      setSubmissionDataArray((prevArray) => [...prevArray, submissionData]);
    } else {
      // Update the existing entry based on partnerId
      setSubmissionDataArray((prevArray) =>
        prevArray.map((entry) =>
          entry.id === partnerId ? { ...entry, ...submissionData } : entry
        )
      );
    }

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

  useEffect(() => {
    const isAdditionalFieldsEqualDefault =
      additionalFields.platform === DEFAULT_ADDITIONAL_DATA.platform &&
      additionalFields.quantity === DEFAULT_ADDITIONAL_DATA.quantity &&
      additionalFields.locations === DEFAULT_ADDITIONAL_DATA.locations &&
      additionalFields.comments === DEFAULT_ADDITIONAL_DATA.comments &&
      additionalFields.requestedPrice ===
        DEFAULT_ADDITIONAL_DATA.requestedPrice &&
      additionalFields.productName === DEFAULT_ADDITIONAL_DATA.productName &&
      additionalFields.productCode === DEFAULT_ADDITIONAL_DATA.productCode &&
      additionalFields.productDescription ===
        DEFAULT_ADDITIONAL_DATA.productDescription;
    console.log(
      "modalData && isAdditionalFieldsEqualDefault",
      modalData && isAdditionalFieldsEqualDefault
    );
    if (modalData && isAdditionalFieldsEqualDefault) {
      const productData = {
        productName: modalData.productName,
        productCode: modalData.productCode,
      };
      const uniquePlainTypes = [
        ...new Set(modalData.plan_activation?.split(", ")),
      ].join(", ");
      const uniquePlatform = [...new Set(modalData.platform?.split(", "))].join(
        ", "
      );

      const plainTypes = [{ pricing: modalData.chargeName }];
      console.log("plainTypes...", plainTypes);
      setSelectedCountry(modalData.country);
      setProductData(productData?.productName);
      setSelectedProduct(productData?.productName);
      setSelectedRadio(uniquePlainTypes);
      setPlainTypeData(plainTypes);
      setAdditionalFields({
        platform: uniquePlatform,
        quantity: modalData.quantity,
        locations: modalData.location,
        comments: modalData.comments,
        requestedPrice: modalData.requestedPrice,
        productName: modalData.productName,
        productCode: modalData.productCode,
        productDescription: modalData.productDescription,
      });
      // setIsEditMode(!!modalData.id);
    } else {
      // setIsEditMode(false);
    }
  }, [modalData]);

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
                    defaultValue={additionalFields.platform}
                    disabled={modelStatus === "edit" ? true : false}
                  >
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
                    defaultValue={additionalFields.quantity}
                    onChange={(e) =>
                      handleFieldChange("quantity", e.target.value)
                    }
                  ></Input>
                </Field>
              </div>
              <div>
                <Field label="Locations" required>
                  <Input
                    defaultValue={additionalFields.locations}
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
                          <TableCell>
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
                defaultValue={additionalFields.comments}
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
                                defaultValue={selectedRadio}
                                onChange={(event) => onPlanChange(event)}
                                disabled={modelStatus === "edit" ? true : false}
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
