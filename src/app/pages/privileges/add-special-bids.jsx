/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import AppBreadcrumbs from "../common/bread-crumbs";
import "../../../assets/special-bids.scss";
import {
  Button,
  Dropdown,
  Field,
  Input,
  Radio,
  RadioGroup,
  Subtitle1,
  Textarea,
  Option,
  MessageBar,
  MessageBarBody,
} from "@fluentui/react-components";
import { ArrowLeft24Regular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { GridShim } from "@fluentui/react-migration-v0-v9";
import ProductModel from "./product-model";
import {
  useGetProductsQuery,
  useAddSpecialBidsMutation,
  useGetCustomerStructureQuery,
} from "../../store/usersApi";
import headingsData from "../common/json-data";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../core/settings/authconfig";
import { callMsGraph } from "../../core/settings/graph";
import ProductTable from "./product-table";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = [
  "12 months",
  "24 months",
  "36 months",
  "48 months",
  "60 months",
];

function AddSpecialBids() {
  const { accounts, instance } = useMsal();
  const [userData, setUserData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [customerName, setCustomerName] = useState();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();
  const [addSpecialBids, isLoading] = useAddSpecialBidsMutation();
  const { data: customers } = useGetCustomerStructureQuery();
  // console.log(customers);
  const { data: products } = useGetProductsQuery();
  const [isFormModified, setIsFormModified] = useState(false);
  const { headings } = headingsData.en;
  const [product, setProduct] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isParentSelected, setIsParentSelected] = useState(false);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [selectedRateCard, setSelectedRateCard] = useState();
  const [selectedSpecialBid, setSelectedSpecialBid] = useState();
  const [specialBidName, setSpecialBidName] = useState("");
  const [requestedName, setRequestedName] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [errors, setErrors] = useState({
    partnerDetails: "",
    subscriberDetails: "",
    quantity: "",
    contactName: "",
    requestedEmail: "",
    contractTerm: "",
  });
  const inputRefs = {
    partnerDetails: useRef(null),
    subscriberDetails: useRef(null),
    quantity: useRef(null),
    requestedEmail: useRef(null),
    contactName: useRef(null),
    contractTerm: useRef(null),
  };

  const validate = () => {
    let tempErrors = { ...errors };
    tempErrors.partnerDetails = selectedSubscriber
      ? ""
      : "Partner Details is required ";
    tempErrors.subscriberDetails = selectedAccount
      ? ""
      : "Subscriber Details is required ";
    tempErrors.quantity = totalQuantity ? "" : "Total quantity is required";
    tempErrors.contactName = requestedName
      ? ""
      : "Partner Point of Contact Name is required";
    tempErrors.requestedEmail = validateEmail(requestedEmail)
      ? ""
      : "Invalid email address";
    tempErrors.contractTerm = selectedOption ? "" : "Contract term is required";
    setErrors(tempErrors);
    if (!selectedSubscriber) {
      inputRefs.partnerDetails.current.focus();
      // eslint-disable-next-line no-dupe-else-if
    } else if (!selectedAccount) {
      inputRefs.subscriberDetails.current.focus();
    } else if (!requestedName) {
      inputRefs.contactName.current.focus();
    } else if (!validateEmail(requestedEmail)) {
      inputRefs.requestedEmail.current.focus();
    } else if (!selectedOption) {
      inputRefs.contractTerm.current.focus();
    } else if (!totalQuantity) {
      inputRefs.quantity.current.focus();
    }

    return Object.values(tempErrors).every((x) => x === "");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
  const handleNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };
  const handleInputChange = () => {
    setIsFormModified(true);
  };

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
    setSelectedOption(val);
  };

  const handleParentIdChange = (event, option) => {
    // console.log(event, event.target.value, event.target.textContent, option);
    let selectedDetails = option?.optionValue;
    let selectedSubscriber = option?.optionText;
    setSelectedParent(selectedDetails);
    setSelectedSubscriber(selectedSubscriber);
    // let [selectedName, selectedAccount] = selectedDetails.split(" (");
    // selectedAccount = selectedAccount.slice(0, -1);

    let data = customers.records.filter((obj) => {
      return (
        obj.customerType === "Subscriber" && obj.parentId === selectedDetails
      );
    });
    // console.log(data);
    setCustomerName(data);
    setSelectedAccount(null);
    setIsParentSelected(!!event.target.textContent);
  };

  const handleAccountChange = (event) => {
    // console.log(event, event.target.textContent);
    setSelectedAccount(event.target.textContent);
    setIsCustomerSelected(!!event.target.textContent);
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

  const handleSubmit = async (processStatus) => {
    if (!validate()) return;
    let subscriberId = selectedAccount?.match(/\(([^)]+)\)/)[1];
    let subscriberName = selectedAccount
      ?.replace(/\s*\([^)]*\)\s*/g, "")
      ?.trim();
    const formData = {
      partnerId: selectedParent,
      subscriberId: subscriberId,
      subscriberName: subscriberName,
      partnerName: selectedSubscriber,
      subscriber: selectedAccount,
      accountNumber: customers?.records?.accountNumber,
      processStatus: processStatus,
      products: modalData?.map((product) => ({
        productId: product?.id,
        availabilityType: headings.country,
        availabilityName: product?.country,
        communicationPlatform: product?.productName,
        productDescription: product?.productDescription,
        serviceLocations: product?.location,
        quantity: product?.quantity,
        planId: product?.planId,
        productName: product?.productName,
        productCode: product?.productCode,
        pricing: product?.chargeName?.map((price) => ({
          pricingId: price?.pricingId,
          requestPrice: product?.requestedPrice,
          plan_activation: product?.plan_activation,
          platform: product?.platform,
          chargeName: price?.chargeName,
          buyingPrice: price?.buyingPrice,
        })),
        comments: product.comments,
      })),
      collaborators: [
        {
          key: "PartnerContactPerson",
          name: userName,
          email: userEmail,
        },
      ],
      contractTerm: selectedOption,
      concessionInfo: "",
      committedQuantity: totalQuantity.toString(),
      commitmentTerms: "",
      estimatedStartDate: startDate ? startDate.toISOString() : null,
      estimatedEndDate: endDate ? endDate.toISOString() : null,
      specialRequirements: "",
      attributes: [
        {
          key: "opportunityType",
          name: "Opportunity Type",
          value: "",
        },
      ],
      attachments: [],
      notifications: [],
      specialBidNotes: "",
      specialBidType: selectedSpecialBid,
      specialBidName: specialBidName,
      requestedName: requestedName,
      requestedEmail: requestedEmail,
    };

    console.log("modalData", modalData);

    // console.log("formData....", formData);
    setSubmitAttempted(true);
    if (!validate() || modalData.length === 0) return;
    addSpecialBids(formData)
      .unwrap()
      .then(() => {
        toast.success("Special Bid added successfully!");
        navigate(`/specialBids`);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast.error("Failed to add Special Bid.");
      });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalData, setModalData] = useState([]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const onSubmitData = (data) => {
    // console.log("add-special-bid.js", data);
    const newData = [...modalData, data];
    // console.log("add-special-bid.js----newData", data);
    setModalData(newData);
    // toggleDialog();
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

  const handleDeleteClick = async (product) => {
    const filteredModalData = modalData.filter(
      (item) => item.renderId !== product?.renderId
    );
    // console.log("filteredModalData", filteredModalData);
    await setModalData(filteredModalData);
  };

  return (
    <div className="border">
      <ToastContainer />
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
      <div className="table">
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
              <Field label="Account Name & Account Number" required>
                <Dropdown
                  onOptionSelect={handleParentIdChange}
                  placeholder="Select a Partner"
                  className="dropdown-data"
                  ref={inputRefs.partnerDetails}
                >
                  {uniqueParentDetails?.map((option, index) => (
                    <Option
                      key={index}
                      value={option?.customerId}
                    >{`${option?.accountName} (${option?.accountNumber})`}</Option>
                  ))}
                </Dropdown>
                {errors.partnerDetails && (
                  <div className="error-message">{errors.partnerDetails}</div>
                )}
              </Field>
            </div>
            <div>
              <Field label="Account Name & Account Number" required>
                <Dropdown
                  onOptionSelect={(event) => handleAccountChange(event)}
                  placeholder="Select a Customer"
                  value={selectedAccount}
                  className="dropdown-data"
                  ref={inputRefs.subscriberDetails}
                >
                  {customerName?.map((customer, index) => {
                    const uniqueKey = `${customer.accountName}-${customer.accountNumber}`;
                    return (
                      <Option key={uniqueKey}>
                        {`${customer.accountName} (${customer.accountNumber})`}
                      </Option>
                    );
                  })}
                </Dropdown>
                {errors.subscriberDetails && (
                  <div className="error-message">
                    {errors.subscriberDetails}
                  </div>
                )}
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
                  defaultValue="specialBid"
                  onChange={(event) => handleRadioChange(event, "specialBid")}
                >
                  <Radio value="specialBid" label="Special Bid"></Radio>
                  <Radio value="dealLetter" label="Deal Letter"></Radio>
                </RadioGroup>
              </Field>
            </div>
            <div>
              <Field label="Special Bid Name">
                <Input
                  onChange={(event) => {
                    setSpecialBidName(event.target.value);
                    handleInputChange();
                  }}
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
              <Field label="Request Prepared by" required>
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
                  onChange={(event) => {
                    setRequestedName(event.target.value);
                    handleInputChange();
                  }}
                  ref={inputRefs.contactName}
                />
                {errors.contactName && (
                  <div className="error-message">{errors.contactName}</div>
                )}
              </Field>
            </div>
            <div>
              <Field label="Partner Point of Contact Email" required>
                <Input
                  type="email"
                  onChange={(event) => {
                    setRequestedEmail(event.target.value);
                    handleInputChange();
                  }}
                  onBlur={() => {
                    const emailValue = inputRefs.requestedEmail.current.value;
                    if (!emailValue) {
                      setEmailError("Email is required");
                    } else {
                      const isValid = validateEmail(emailValue);
                      if (!isValid) {
                        setEmailError("Invalid email address");
                      } else {
                        setEmailError(""); // Clear the error if email is valid
                      }
                    }
                  }}
                  ref={inputRefs.requestedEmail}
                />
                {emailError && (
                  <div className="error-message">{emailError}</div>
                )}
              </Field>
            </div>
            {/* <div>
            <Field label="Partner Signing Authority Name" required>
              <Input />
            </Field>
          </div>
          <div>
            <Field label="Partner Signing Authority Email" required>
              <Input />
            </Field>
          </div> */}
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
                partnerId={selectedParent}
                parentDetails={uniqueParentDetails}
                modalData={null}
                modelStatus={"add"}
              />
            )}
          </div>
          <div className="m-l-10 p-tb">
            {modalData ? (
              <ProductTable
                productData={modalData}
                onClose={handleCloseDialog}
                onTotalQuantityChange={handleTotalQuantityChange}
                onSubmitData={onSubmitData}
                partnerId={selectedParent}
                parentDetails={uniqueParentDetails}
                handleDeleteClick={handleDeleteClick}
              />
            ) : submitAttempted ? (
              <MessageBar>
                <MessageBarBody>
                  Please add at least one product before submitting.
                </MessageBarBody>
              </MessageBar>
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
                  ref={inputRefs.contractTerm}
                >
                  {options.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Dropdown>
                {errors.contractTerm && (
                  <div className="error-message">{errors.contractTerm}</div>
                )}
              </Field>
            </div>
            <div>
              <Field label="Total Committed Quantity" required>
                <Input
                  value={totalQuantity > 0 ? totalQuantity : ""}
                  ref={inputRefs.quantity}
                />
                {errors.quantity && (
                  <div className="error-message">{errors.quantity}</div>
                )}
              </Field>
            </div>
          </GridShim>
          <GridShim columns={3} className="grid-shim m-t-10">
            <div>
              <Field label="Anticipated Rollout Start Date">
                <DatePicker
                  onSelectDate={handleStartDateChange}
                  value={startDate}
                  minDate={new Date()}
                />
              </Field>
            </div>
            <div>
              <Field label="Proposed Completion Date">
                <DatePicker
                  onSelectDate={handleEndDateChange}
                  value={endDate}
                  minDate={minEndDate}
                />
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
    </div>
  );
}

export default AddSpecialBids;
