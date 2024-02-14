/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useRef, useState } from "react";
import AppBreadcrumbs from "../common/bread-crumbs";
import "../../../assets/special-bids.scss";
import {
  Button,
  Dropdown,
  Field,
  //   TextField, // Replaced Input with TextField
  Radio,
  RadioGroup,
  Subtitle1,
  Textarea,
  Option,
  Input,
  Text,
} from "@fluentui/react-components";
import { TextField } from "@fluentui/react/lib/TextField";
import { ArrowLeft24Regular } from "@fluentui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import { GridShim } from "@fluentui/react-migration-v0-v9";
import ProductModel from "./product-model";
import {
  useGetProductsQuery,
  useAddSpecialBidsMutation,
  useGetCustomerStructureQuery,
  useGetSpecialBidsByIdQuery,
  useUpdateSpecialBidsMutation,
} from "../../store/usersApi";
import headingsData from "../common/json-data";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../core/settings/authconfig";
import { callMsGraph } from "../../core/settings/graph";
import ProductTable from "./product-table";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import moment from "moment";
import { cloneDeep } from "lodash";
import { object } from "yup";

const options = [
  "12 months",
  "24 months",
  "36 months",
  "48 months",
  "60 months",
];

function EditSpecialBids() {
  const { id } = useParams();
  const { accounts, instance } = useMsal();
  const [userData, setUserData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { data: specialBidsData, isLoading } = useGetSpecialBidsByIdQuery(id);
  const [editSpecialBid] = useUpdateSpecialBidsMutation(id);
  console.log(specialBidsData);
  const navigate = useNavigate();
  const { data: customers } = useGetCustomerStructureQuery();
  const { data: products } = useGetProductsQuery();
  const { headings } = headingsData.en;
  const [product, setProduct] = useState([]);
  console.log(specialBidsData?.result[0]?.committedQuantity);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [selectedSpecialBid, setSelectedSpecialBid] = useState();
  const [specialBidName, setSpecialBidName] = useState("");
  const [requestedName, setRequestedName] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [isFormModified, setIsFormModified] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const inputRefs = {
    requestedName: useRef(null),
    requestedEmail: useRef(null),
    committedQuantity: useRef(null),
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.requestedName.trim()) {
      errors.requestedName = "Partner Point of Contact Name is required";
      inputRefs.requestedName.current.focus();
    }
    if (!formData.requestedEmail.trim()) {
      errors.requestedEmail = "Partner Point of Contact Email is required";
      if (!errors.requestedName) {
        inputRefs.requestedEmail.current.focus();
      }
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        formData.requestedEmail
      )
    ) {
      errors.requestedEmail = "Invalid email format";
      if (!errors.requestedName) {
        inputRefs.requestedEmail.current.focus();
      }
    }
    if (!formData.committedQuantity.trim()) {
      errors.committedQuantity = "Committed quantity required";
      if (!errors.committedQuantity) {
        inputRefs.committedQuantity.current.focus();
      }
    }
    return errors;
  };

  const handleTotalQuantityChange = (newTotal) => {
    setTotalQuantity(newTotal);
  };

  const handleAddProduct = (newProduct) => {
    setProduct([...product, newProduct]);
    toggleDialog();
  };
  const handleLastPage = () => {
    navigate(`/specialBids`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        const data = await callMsGraph(response.accessToken);
        setUserData(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [accounts, instance]);

  const [userName, setUserName] = useState("Guest");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (userData.displayName) {
      setUserName(userData.displayName);
    }
    if (userData.mail) {
      setUserEmail(userData.mail);
    }
  }, [userData]);
  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };
  const handleInputChange = (field, e) => {
    // console.log("value....", e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: e.target.value,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
    // console.log("After update:", formData);
    setIsFormModified(true);
  };

  const handleBlur = (field) => {
    const errors = validateField(field, formData[field]);
    if (errors) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ...errors,
      }));
    }
  };
  // const handleDropdownChange = (field, e) => {
  //   console.log("contractTerm......", e);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [field]: e,
  //   }));
  //   console.log("formData......", formData);
  //   setIsFormModified(true);
  // };

  const getParentDetails = (customers) => {
    const parentDetails = new Map();

    customers?.forEach((customer) => {
      if (customer.customerType === "Partner") {
        // const parentKey = `${customer.accountName} (${customer.accountNumber})`;
        parentDetails.set(customer?.customerId, customer);
      }
    });

    return Array.from(parentDetails.values());
  };

  let uniqueParentDetails;

  if (customers && customers.records?.length > 0) {
    uniqueParentDetails = getParentDetails(customers.records);
    // console.log(uniqueParentDetails);
  }

  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event, option) => {
    let val = option?.optionText;
    setFormData((prevFormData) => ({
      ...prevFormData,
      contractTerm: val || "",
    }));
    setIsFormModified(true);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setIsFormModified(true);
    if (endDate && date >= endDate) {
      setEndDate(null);
    }
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setIsFormModified(true);
  };
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 86400000)
    : null;
  const onFormatDate = (date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return !date
      ? ""
      : `${
          monthNames[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const startDatePicker = useMemo(() => {
    return (
      specialBidsData &&
      specialBidsData?.result.map((data, i) => (
        <DatePicker
          key={i}
          onSelectDate={handleStartDateChange}
          formatDate={onFormatDate}
          value={
            data?.estimatedStartDate
              ? moment(data?.estimatedStartDate).toDate()
              : null
          }
          minDate={new Date()}
          onSelect={(e) => handleInputChange("estimatedStartDate", e)}
        />
      ))
    );
  }, [specialBidsData]);
  const endDatePicker = useMemo(() => {
    return (
      specialBidsData &&
      specialBidsData?.result.map((data, i) => (
        <DatePicker
          key={i}
          formatDate={onFormatDate}
          onSelectDate={handleEndDateChange}
          value={
            data?.estimatedEndDate
              ? moment(data.estimatedEndDate).toDate()
              : null
          }
          minDate={minEndDate}
          onSelect={(e) => handleInputChange("estimatedEndDate", e)}
        />
      ))
    );
  }, [specialBidsData]);

  const DEFAULT_FORM_VALUES = {
    partnerId: "",
    subscriberId: "",
    subscriberName: "",
    partnerName: "",
    accountNumber: "",
    processStatus: "",
    products: cloneDeep({
      productId: "",
      availabilityType: "",
      availabilityName: "",
      communicationPlatform: "",
      productDescription: "",
      serviceLocations: "",
      quantity: "",
      planId: "",
      productName: "",
      productCode: "",
      pricing: [
        {
          pricingId: "",
          requestPrice: "",
          plan_activation: "",
          platform: "",
          chargeName: "",
          buyingPrice: "",
        },
      ],
      comments: "",
    }),
    collaborators: {
      key: "PartnerContactPerson",
      name: "",
      email: "",
    },
    contractTerm: "",
    concessionInfo: "",
    committedQuantity: "",
    commitmentTerms: "",
    estimatedStartDate: "",
    estimatedEndDate: "",
    specialRequirements: "",
    attributes: {
      key: "opportunityType",
      name: "Opportunity Type",
      value: "",
    },
    attachments: [],
    notifications: [],
    specialBidNotes: "",
    specialBidType: "",
    specialBidName: "",
    requestedName: "",
    requestedEmail: "",
  };

  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES);
  // console.log(formData);

  useEffect(() => {
    if (specialBidsData) {
      assignProductsData();
      // console.log("test binding the data");
    }
  }, [specialBidsData]);

  const assignProductsData = async () => {
    const transformedData =
      (await specialBidsData) &&
      specialBidsData?.result?.map((item, index) => ({
        partnerId: item.partnerId || "",
        subscriberId: item.subscriberId || "",
        subscriberName: item.subscriberName || "",
        partnerName: item.partnerName || "",
        accountNumber: "",
        processStatus: item.processStatus || "",
        products: item.products.map((product, innerIndex) => ({
          productId: product.productId || "",
          availabilityType: product.availabilityType || "",
          availabilityName: product.availabilityName || "",
          communicationPlatform: product.communicationPlatform || "",
          productDescription: product.productDescription || "",
          serviceLocations: product.serviceLocations || "",
          quantity: product.quantity || "",
          planId: "",
          productName: product.productName || "",
          productCode: product.productCode || "",
          pricing: product.pricing.map((price) => ({
            pricingId: price.pricingId || "",
            requestPrice: price.requestPrice || "",
            plan_activation: price.plan_activation || "",
            platform: price.platform || "",
            chargeName: price.chargeName || "",
            buyingPrice: price.buyingPrice || "",
          })),
          comments: product.comments || "",
          renderId: index * item.products.length + innerIndex,
        })),
        collaborators: item.collaborators.map((collaborator) => ({
          key: collaborator.key || "",
          name: collaborator.name || "",
          email: collaborator.email || "",
        })),
        contractTerm: item.contractTerm || "",
        concessionInfo: item.concessionInfo || "",
        committedQuantity: item.committedQuantity || "",
        commitmentTerms: item.commitmentTerms || "",
        estimatedStartDate: item.estimatedStartDate || "",
        estimatedEndDate: item.estimatedEndDate || "",
        specialRequirements: item.specialRequirements || "",
        attributes: item.attributes.map((attribute) => ({
          key: attribute.key || "",
          name: attribute.name || "",
          value: attribute.value || "",
        })),
        attachments: item.attachments || [],
        notifications: item.notifications || [],
        specialBidNotes: item.specialBidNotes || "",
        specialBidType: item.specialBidType || "",
        specialBidName: item.specialBidName || "",
        requestedName: item.requestedName || "",
        requestedEmail: item.requestedEmail || "",
      }));

    // console.log("transformedData.......", transformedData[0]);
    const clonedData = JSON.parse(JSON.stringify(transformedData));
    await setFormData(clonedData[0]);
    const modelData =
      (await specialBidsData) &&
      specialBidsData?.result?.map((item, index) => {
        return item.products.map((product, innerIndex) => {
          const platform = product.pricing
            .filter((price) => price?.buyingPrice !== 0)
            .map((price) => price.platform)
            .join(", ");

          const requestedPrice = product.pricing
            .filter((price) => price?.buyingPrice !== 0)
            .map((price) => price.requestPrice)
            .join(", ");

          const plan_activation = product.pricing
            .filter((price) => price?.buyingPrice !== 0)
            .map((price) =>
              price.plan_activation
                ? price.plan_activation
                : price.plan_activation === ""
                ? "porting"
                : ""
            )
            .join(", ");

          const buyingPrice = product.pricing
            .filter((price) => price?.buyingPrice !== 0)
            .map((price) => price.buyingPrice)
            .join(", ");
          return {
            id: product.productId || "",
            country: product.availabilityName || "",
            plan_activation: plan_activation,
            buyingPrice: buyingPrice,
            comments: product.comments || "",
            location: product.serviceLocations || "",
            platform: platform,
            quantity: product.quantity || "",
            requestedPrice: requestedPrice,
            chargeName: product.pricing,
            productName: product.productName || "",
            productCode: product.productCode || "",
            productDescription: product.productDescription || "",
            renderId: index * item.products.length + innerIndex,
          };
        });
      });
    const newData = await [...modalData, modelData[0]];
    const finalData = await newData[0];
    const committedQuantity =
      specialBidsData && specialBidsData?.result
        ? specialBidsData?.result[0]?.committedQuantity
        : specialBidsData?.result;
    console.log("committedQuantity", committedQuantity);
    await setTotalQuantity(committedQuantity);
    await setModalData(finalData);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    const isDataEdited = Object.values(formData).some((value) => value !== "");

    if (!isDataEdited) {
      return;
    }

    try {
      let progressStatus = "";

      if (status === "Draft") {
        progressStatus = "Draft";
      } else if (status === "Request Created") {
        progressStatus = "Pending Approval";
      }

      const editedData = { id, ...formData, progressStatus };
      await editSpecialBid(editedData).unwrap();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  useEffect(() => {
    console.log("Updated modalData:", modalData);
  }, [modalData]);
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const onSubmitData = async (data) => {
    const index = await modalData.filter(
      (item) => item.renderId === data.renderId
    );
    console.log(index);
    if (index.length === 1) {
      const updatedData = await modalData.map((item, i) =>
        i === data.renderId ? data : item
      );
      await setModalData([]);
      await setModalData(updatedData);

      const updatedFormData = {
        ...formData,
        products: formData.products.map((product) => {
          if (product.renderId === data.renderId) {
            return {
              ...product,
              availabilityType: "Country",
              availabilityName: data.country,
              communicationPlatform: [{ name: data.platform }],
              productDescription: data.productDescription,
              serviceLocations: data.location,
              quantity: data.quantity,
              planId: "",
              productName: data.productName,
              productCode: data.productCode,
              pricing: data.chargeName.map((price) => ({
                pricingId: price.pricingId,
                requestPrice: price.requestPrice,
                plan_activation: price.plan_activation,
                platform: price.platform,
                chargeName: price.chargeName,
                buyingPrice: price.buyingPrice,
              })),
              comments: data.comments,
            };
          }
          return product;
        }),
      };
      setFormData(updatedFormData);
    } else {
      await setModalData([]);
      const newData = await [...modalData, data];
      await setModalData(newData);

      const updatedFormData = {
        ...formData,
        products: [
          ...formData.products,
          {
            availabilityType: "Country",
            availabilityName: data.country,
            communicationPlatform: [{ name: data.platform }],
            productDescription: data.productDescription,
            serviceLocations: data.location,
            quantity: data.quantity,
            planId: "",
            productName: data.productName,
            productCode: data.productCode,
            pricing: data.chargeName.map((price) => ({
              pricingId: price.pricingId,
              requestPrice: price.requestPrice,
              plan_activation: price.plan_activation,
              platform: price.platform,
              chargeName: price.chargeName,
              buyingPrice: price.buyingPrice,
            })),
            comments: data.comments,
          },
        ],
      };
      console.log(modalData);
      console.log(formData);
      setFormData(updatedFormData);
    }

    await setIsDialogOpen(false);
  };

  const handleDeleteClick = async (productData) => {
    const filteredModalData = modalData.filter(
      (item) => item.renderId !== productData?.renderId
    );
    console.log("filteredModalData", filteredModalData);
    await setModalData(filteredModalData);

    const updatedProducts = formData.products.filter(
      (product) => product.renderId !== productData?.renderId
    );
    const updatedFormData = {
      ...formData,
      products: updatedProducts,
    };
    console.log("updatedFormData", updatedFormData);
    await setFormData(updatedFormData);
  };

  const handleRadioChange = (event, name) => {
    let selectedPlan = event.target.value;
    if (name === "rateCard") {
      setSelectedRateCard(selectedPlan);
    } else {
      setSelectedSpecialBid(selectedPlan);
    }
  };
  const productData = specialBidsData?.result?.[0]?.products || [];

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
      {specialBidsData &&
        specialBidsData?.result.map((data, i) => (
          <div key={i} className="table">
            <div className="a-sb-p">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Subtitle1 weight="bold" size={400}>
                    {headings?.partnerDetails}
                  </Subtitle1>
                </div>
                <div>
                  <Subtitle1 weight="bold" size={400}>
                    {headings.customerDetails}
                  </Subtitle1>
                </div>
              </GridShim>
            </div>

            <div className="m-t-10 a-sb-p">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Field label="Account Name & Account Number">
                    <Text weight="semibold">{data?.partnerName}</Text>

                    {/* {errors.accountName && (
                      <div className="error-message">{errors.accountName}</div>
                    )} */}
                  </Field>
                </div>
                <div>
                  <Field label="Account Name & Account Number">
                    <Text weight="semibold">{data?.subscriber}</Text>
                  </Field>
                </div>
              </GridShim>
            </div>

            <div className="m-t-20 a-sb-p">
              <Subtitle1 weight="bold" size={400}>
                {headings.specialBidsDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10 a-sb-p">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Field label="Special Bid Type">
                    <RadioGroup
                      layout="horizontal"
                      onChange={(e) => handleInputChange("specialBidType", e)}
                      defaultValue={data?.specialBidType}
                    >
                      <Radio value="specialBid" label="Special Bid"></Radio>
                      <Radio value="dealLetter" label="Deal Letter"></Radio>
                    </RadioGroup>
                  </Field>
                </div>
                <div>
                  <Field label="Special Bid Name">
                    <Input
                      type="text"
                      defaultValue={data?.specialBidName}
                      onChange={(e) => handleInputChange("specialBidName", e)}
                    />
                  </Field>
                </div>
              </GridShim>
            </div>
            <div className="m-t-20 a-sb-p">
              <Subtitle1 weight="bold" size={400}>
                {headings.contactDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10 a-sb-p">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Field label="Request Prepared by">
                    <Input
                      value={userEmail}
                      onChange={handleEmailChange}
                      disabled
                    />
                  </Field>
                </div>
                <div>
                  <Field label="Partner Point of Contact Name" required>
                    <Input
                      onChange={(e) => handleInputChange("requestedName", e)}
                      defaultValue={data?.requestedName}
                      ref={inputRefs.requestedName}
                    />
                    {validationErrors.requestedName && (
                      <div className="error-message">
                        {validationErrors.requestedName}
                      </div>
                    )}
                  </Field>
                </div>
                <div>
                  <Field label="Partner Point of Contact Email" required>
                    <Input
                      type="email"
                      onChange={(e) => handleInputChange("requestedEmail", e)}
                      defaultValue={data?.requestedEmail}
                      onBlur={() => handleBlur("requestedEmail")}
                      ref={inputRefs.requestedEmail}
                    />
                    {validationErrors.requestedEmail && (
                      <div className="error-message">
                        {" "}
                        {validationErrors.requestedEmail}{" "}
                      </div>
                    )}
                  </Field>
                </div>
              </GridShim>
            </div>
            <div className="card-product m-t-20 a-sb-m">
              <div className="product">
                <h3>{headings.productsServices}</h3>
                <div className="m-t-10" onClick={handleOpenDialog}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 50 50"
                    cursor="pointer"
                  >
                    <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"></path>
                  </svg>
                </div>
                {isDialogOpen && (
                  <ProductModel
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSubmitData={onSubmitData}
                    partnerId={data?.partnerId}
                    parentDetails={uniqueParentDetails}
                    modalData={modalData}
                    modelStatus={"add"}
                  />
                )}
              </div>
              <div className="m-l-10 p-tb">
                {data?.products && data?.products?.length > 0 ? (
                  <ProductTable
                    productData={modalData}
                    onClose={handleCloseDialog}
                    onTotalQuantityChange={handleTotalQuantityChange}
                    onSubmitData={onSubmitData}
                    partnerId={selectedParent}
                    parentDetails={uniqueParentDetails}
                    handleDeleteClick={handleDeleteClick}
                  />
                ) : (
                  <p>{headings.none}</p>
                )}
              </div>
            </div>
            <div className="m-t-20 a-sb-p">
              <Subtitle1 weight="bold" size={400}>
                {headings.contractDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10 a-sb-p">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Field label="Contract Term" required>
                    <Dropdown
                      onOptionSelect={handleOptionChange}
                      defaultValue={data?.contractTerm}
                      // onChange={(e, option) =>
                      //   handleDropdownChange("contractTerm", option)
                      // }
                    >
                      {options.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Dropdown>
                  </Field>
                </div>
                <div>
                  <Field label="Total Committed Quantity" required>
                    <Input
                      // defaultValue={data?.committedQuantity}
                      defaultValue={data?.committedQuantity}
                      onChange={(e) => handleInputChange("quantity", e)}
                    />

                    {validationErrors.committedQuantity && (
                      <div className="error-message">
                        {validationErrors.committedQuantity}
                      </div>
                    )}
                  </Field>
                </div>
              </GridShim>
              <GridShim columns={3} className="grid-shim m-t-10">
                <div>
                  <Field label="Anticipated Rollout Start Date">
                    {startDatePicker}
                  </Field>
                </div>
                <div>
                  <Field label="Proposed Completion Date">
                    {endDatePicker}
                  </Field>
                </div>
              </GridShim>
            </div>
            <div className="m-t-20 a-sb-p">
              <Field label="Comments/Requirements">
                <Textarea resize="vertical"></Textarea>
              </Field>
            </div>
            <div className="card-product m-t-20 a-sb-m">
              <div className="product">
                <h3>{headings.attachments}</h3>
                {/* <Button icon={<Add24Filled />} shape="circular"></Button> */}
                <div className="m-t-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 50 50"
                    cursor="pointer"
                  >
                    <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"></path>
                  </svg>
                </div>
              </div>
              <div className="m-l-10">
                <p>{headings.none}</p>
              </div>
            </div>
            <div className="m-t-20 a-sb-p">
              <Subtitle1 weight="bold" size={400}>
                {headings.additionalDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10 m-b-20 a-sb-p">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Field label="Opportunity Type">
                    <Dropdown></Dropdown>
                  </Field>
                </div>
                <div>
                  <Field label="Rate Card">
                    <RadioGroup
                      layout="horizontal"
                      onChange={(event) => handleRadioChange(event, "rateCard")}
                    >
                      <Radio value="yes" label="yes"></Radio>
                      <Radio value="no" label="no"></Radio>
                    </RadioGroup>
                  </Field>
                </div>
              </GridShim>
            </div>
            <hr className="hr" />
            <div className="m-t-20 m-b-20 b-g a-sb-p">
              <Button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                appearance="primary"
              >
                {headings.saveDraft}
              </Button>
              <Button onClick={(e) => handleSubmit(e)} appearance="primary">
                {headings.submitRequest}
              </Button>
              <Button onClick={handleLastPage}>{headings.cancel}</Button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default EditSpecialBids;
