/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
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
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [selectedSpecialBid, setSelectedSpecialBid] = useState();
  const [specialBidName, setSpecialBidName] = useState("");
  const [requestedName, setRequestedName] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [isFormModified, setIsFormModified] = useState(false);

  // const [errors, setErrors] = useState({
  //   accountName: "",
  //   quantity: "",
  //   specialBidsName: "",
  // });

  // const validate = () => {
  //   let tempErrors = { ...errors };

  //   tempErrors.quantity = totalQuantity ? "" : "Total quantity is required";
  //   tempErrors.requestedEmail = validateEmail(requestedEmail)
  //     ? ""
  //     : "Invalid email address";
  //   setErrors(tempErrors);
  //   return Object.values(tempErrors).every((x) => x === "");
  // };

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

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
    console.log("After update:", formData);
    setIsFormModified(true);
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
  console.log(formData);

  useEffect(() => {
    if (specialBidsData) {
      assignProductsData();
    }
  }, [specialBidsData]);

  const assignProductsData = async () => {
    const transformedData =
      (await specialBidsData) &&
      specialBidsData?.result?.map((item) => ({
        partnerId: item.partnerId || "",
        subscriberId: item.subscriberId || "",
        subscriberName: item.subscriberName || "",
        partnerName: item.partnerName || "",
        accountNumber: "",
        processStatus: item.processStatus || "",
        products: item.products.map((product) => ({
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

    console.log("transformedData.......", transformedData[0]);
    const clonedData = JSON.parse(JSON.stringify(transformedData));
    await setFormData(clonedData[0]);
    const modelData =
      (await specialBidsData) &&
      specialBidsData?.result?.map((item) => {
        return item.products.map((product) => {
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
            .map((price) => price.plan_activation)
            .join(", ");

          const buyingPrice = product.pricing
            .filter((price) => price?.buyingPrice !== 0)
            .map((price) => price.buyingPrice)
            .join(", ");
          return {
            id: product.productId || "",
            country: product.availabilityName || "",
            plan_activation: plan_activation,
            // buyingPrice: buyingPrice,
            comments: product.comments || "",
            location: product.serviceLocations || "",
            platform: platform,
            quantity: product.quantity || "",
            requestedPrice: requestedPrice,
            chargeName: product.pricing,
            productName: product.productName || "",
            productCode: product.productCode || "",
            productDescription: product.productDescription || "",
          };
        });
      });
    const newData = await [...modalData, modelData[0]];
    console.log("modelData........", modelData);
    console.log("newData........", newData[0]);
    const finalData = await newData[0];
    // console.log("add-special-bid.js----newData", data);
    await setModalData(finalData);
  };

  const handleSubmit = async () => {
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
      console.log("editedData__editedData", editedData);

      await editSpecialBid(editedData).unwrap();
      // navigate(`/specialBids`);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const onSubmitData = (data) => {
    // Find the index of the item in modalData with the same id
    const index = modalData.findIndex((item) => item.id === data.id);

    // If the id is found, update the existing object
    if (index !== -1) {
      const updatedData = [...modalData];
      updatedData[index] = { ...updatedData[index], ...data };
      setModalData(updatedData);
    } else {
      // If the id is not found, add a new object to the array
      const newData = [...modalData, data];
      setModalData(newData);
    }

    handleCloseDialog();
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
            <div>
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

            <div className="m-t-10">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Field label="Account Name & Account Number" required>
                    <Input disabled value={data?.partnerName} />
                    {/* {errors.accountName && (
                      <div className="error-message">{errors.accountName}</div>
                    )} */}
                  </Field>
                </div>
                <div>
                  <Field label="Account Name & Account Number" required>
                    <Input disabled value={data?.subscriberName} />
                  </Field>
                </div>
              </GridShim>
            </div>

            <div className="m-t-20">
              <Subtitle1 weight="bold" size={400}>
                {headings.specialBidsDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10">
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
            <div className="m-t-20">
              <Subtitle1 weight="bold" size={400}>
                {headings.contactDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10">
              <GridShim columns={3} className="grid-shim">
                <div>
                  <Field label="Request Prepared by" required>
                    <Input value={userEmail} onChange={handleEmailChange} />
                  </Field>
                </div>
                <div>
                  <Field label="Partner Point of Contact Name" required>
                    <Input
                      onChange={(e) => handleInputChange("requestedName", e)}
                      defaultValue={data?.requestedName}
                    />
                  </Field>
                </div>
                <div>
                  <Field label="Partner Point of Contact Email" required>
                    <Input
                      type="email"
                      onChange={(e) => handleInputChange("requestedEmail", e)}
                      defaultValue={data?.requestedEmail}
                    />
                    {/* {errors.requestedEmail && (
                      <div className="error-message">
                        {errors.requestedEmail}
                      </div>
                    )} */}
                  </Field>
                </div>
              </GridShim>
            </div>
            <div className="card-product m-t-20">
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
                    partnerId={selectedParent}
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
                    onTotalQuantityChange={handleTotalQuantityChange}
                    onSubmitData={onSubmitData}
                    partnerId={selectedParent}
                    parentDetails={uniqueParentDetails}
                  />
                ) : (
                  <p>{headings.none}</p>
                )}
              </div>
            </div>
            <div className="m-t-20">
              <Subtitle1 weight="bold" size={400}>
                {headings.contractDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10">
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
                      disabled
                      defaultValue={data?.committedQuantity}
                      value={totalQuantity > 0 ? totalQuantity : ""}
                    />

                    {/* {errors.quantity && (
                      <div className="error-message">{errors.quantity}</div>
                    )} */}
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
            <div className="m-t-20">
              <Field label="Comments/Requirements">
                <Textarea resize="vertical"></Textarea>
              </Field>
            </div>
            <div className="card-product m-t-20">
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
            <div className="m-t-20">
              <Subtitle1 weight="bold" size={400}>
                {headings.additionalDetails}
              </Subtitle1>
            </div>
            <div className="m-t-10 m-b-20">
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
            <div className="m-t-20 m-b-20 b-g">
              <Button
                onClick={() => handleSubmit("Draft")}
                type="submit"
                appearance="primary"
              >
                {headings.saveDraft}
              </Button>
              <Button
                onClick={() => handleSubmit("Request Created")}
                appearance="primary"
              >
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
