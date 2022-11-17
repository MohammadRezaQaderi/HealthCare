import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fromPQSFields } from "../../../constants/item";
import { hasValidationError } from "../../../helpers/validation-checker";
import { isRelatedFieldOk, relatedFields } from "../../../helpers/related-tem";
import { isRelatedFieldOkReq } from "../../../helpers/related-tem-req";
import { seperator } from "../../../helpers/seperator";
import {
  checkConnected,
  readData,
  removeItemValue,
  saveData,
} from "../../../components/DataStorage";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const facilityField = {
  id: "facility",
  type: "text",
  active: false,
  disabled: true,
  state: "facility",
  name: "",
};

function Item({ defaultValueItem }) {
  const [fieldsValue, setFieldValue] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedItemClass, setSelectedItemClass] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [isFromPQS, setIsFromPQS] = useState(false);

  // const { id } = useParams();
  // const history = useHistory();
  // const params = new URLSearchParams(history.location.search);
  // const parent = params.get("parent");

  const { isLoading: isItemDefaultLoading } = useQuery(
    ["item-default-value", id],
    async () => {
      const defaultData = {
        code: "Unique code generated by IGA",
        same_item: "1",
      };
      
      if (Object.keys(defaultValueItem).length === 0) return defaultData;

      let item = defaultValueItem;
      if (item["PQSPISCode"]) {
        setIsFromPQS(true);
      }
      // for (const key in item) {
      //   if (typeof item[key] === "number") {
      //     if (item[key] % 1 !== 0) {
      //       item[key] = item[key]
      //         .toFixed(2)
      //         .toString()
      //         .replace(".", seperator());
      //     }
      //   }
      // }

      return { ...item };
    },
    {
      refetchOnMount: true,
      onSuccess(data) {
        setFieldValue((preValues) => ({
          ...data,
          ...preValues,
        }));
      },
    }
  );

  const { data: itemClassesAndTypes, isLoading: isItemClassesAndTypesLoading } =
    useQuery(
      ["item-classes-and-types"],
      async () => {
        // const res = await ItemService.getItemClassesAndTypes(parent);

        // setFieldValue((preValues) => ({
        //   ...preValues,
        //   facility: res.data.facility,
        // }));
        readData("itemClass").then((res) => {
        const itemClass = JSON.parse(res);

        // const datas = res.data.data.filter((item) => item.item_type.length > 0);
        // if (datas.length === 0) {
        //   toast.error(<Trans>No available item found</Trans>);
        //   history.push("/settings/item-t-level");
        // }
        return itemClass.filter((item) => item.item_type.length > 0);
      });
      },
      {
        refetchOnMount: true,
        onSuccess(data) {
          console.log(data);
          if (Object.keys(defaultValueItem).length === 0) {
            setSelectedItemClass(data[0]);
            setSelectedItemType(data[0]?.item_type?.[0]);
          } else {
            console.log(fieldsValue);
            if (Object.keys(fieldsValue).length === 0) {
              window.location.reload();
              setSelectedItemClass(data[0]);
              setSelectedItemType(data[0]?.item_type?.[0]);
            } else {
              const item_class = data.find(
                (item) => item?.item_class?.id === fieldsValue.item_class
              );
              const item_type = item_class?.item_type?.find(
                (item) => item.id === fieldsValue.item_type
              );
              console.log(fieldsValue);
              console.log(item_class);
              console.log(item_type);
              setSelectedItemClass(item_class);

              setSelectedItemType(item_type);
            }
          }
        },
      }
    );

  const { data: pqsData, isLoading: isPqsLoading } = useQuery(
    ["pqs", selectedItemType?.id],
    async () => {
      let id_param = 0;
      if (id == "new") {
        id_param = selectedItemType?.id;
      } else {
        id_param = 1;
        if (fieldsValue !== {}) {
          console.log("hi");
          id_param = fieldsValue["item_type"];
        } else {
          window.location.reload();
        }
      }
      const res = await ItemService.getPQS(id_param);
      if (res.data.length === 0) {
        return [];
      }
      return res?.data?.map((item) => ({
        label: item.pqsnumber
          ? item.pqsnumber +
            " , " +
            item.type +
            " , " +
            item.vaccinenetstoragecapacity +
            " , " +
            item.manufacturer
          : item.pqscode +
            " , " +
            item.description +
            " , " +
            item.freezercapacity +
            " , " +
            item.make,
        value: item,
      }));
    },
    {
      refetchOnMount: true,
    }
  );

  const {
    data: itemFields,
    isLoading: isItemsFieldsLoading,
    isIdle: isItemsFieldsIdle,
    refetch: refetchItemFields,
  } = useQuery(
    [
      "item-fields",
      selectedItemClass?.item_class.id,
      selectedItemType?.id,
      parent,
    ],
    async () => {
      const res = await ItemService.getItemFields(
        selectedItemClass.item_class.id,
        selectedItemType.id,
        parent
      );
      console.log(res);
      const result = {};
      if (res.data.fields) {
        for (const field of res.data.fields) {
          if (id !== "new" && field.field.state === "same_item") {
            continue;
          }
          const fieldTopicInResult = result[field.field.topic] ?? [];

          fieldTopicInResult.push(field.field);
          result[field.field.topic] = fieldTopicInResult;
        }
        const firstTopic = Object.keys(result)[0] ?? "Type";
        if (result[firstTopic] === undefined) {
          result[firstTopic] = [];
        }
        //static fields
        result[firstTopic].unshift({
          id: "code",
          name: "Item code",
          topic: firstTopic,
          type: "text",
          active: false,
          disabled: true,
          required: false,
          state: "code",
          params: [],
        });
      }
      return result;
    },
    {
      enabled: !!selectedItemType,
    }
  );

  useEffect(() => {
    console.log(selectedItemType);
    if (selectedItemType) {
      refetchItemFields();
    }
  }, [selectedItemType]);

  const hasRequiredErrors = () => {
    const _fieldErrors = { ...fieldErrors };
    const currentStepFields = Object.values(itemFields)[activeStep];
    currentStepFields.forEach((field) => {
      console.log(fieldsValue[field.state]);
      if (
        field.required &&
        !fieldsValue[field.state] &&
        !isRelatedFieldOkReq(field.state, fieldsValue) &&
        fieldsValue[field.state] !== 0
      ) {
        if (field.type === "bool") {
          if (
            fieldsValue[field.state] === undefined ||
            fieldsValue[field.state] === null
          ) {
            _fieldErrors[field.state] = "this field is required!";
          }
        } else {
          _fieldErrors[field.state] = "this field is required!";
        }
      }
    });
    for (const key in relatedFields) {
      const fields = relatedFields[key];
      if (fieldsValue[key] === true) {
        fields.forEach((field) => {
          delete _fieldErrors[field];
        });
      }
    }
    setFieldErrors(_fieldErrors);
    return Object.keys(_fieldErrors).length > 0;
  };

  const handleNext = () => {
    if (!hasRequiredErrors()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setFieldErrors({});
  };

  const onChangeHandler = async (value, field) => {
    const validationErr = hasValidationError(value, field.validation?.[0]);
    const cloneFieldsValue = { ...fieldsValue };
    cloneFieldsValue[field.state] = value;
    setFieldValue(cloneFieldsValue);
    //check validation and required
    const _fieldErrors = { ...fieldErrors };
    if (validationErr) {
      _fieldErrors[field.state] = validationErr;
    } else {
      delete _fieldErrors[field.state];
    }
    for (const key in relatedFields) {
      const fields = relatedFields[key];
      console.log(fieldsValue[key]);
      fields.forEach((field) => {
        delete _fieldErrors[field];
      });
    }
    console.log(_fieldErrors);
    setFieldErrors(_fieldErrors);
  };

  const onSaveHandler = async (e) => {
    e.preventDefault();
    if (hasRequiredErrors()) {
      return;
    }
    const _fieldsValue = { ...fieldsValue };
    for (const key in relatedFields) {
      const fields = relatedFields[key];
      if (fieldsValue[key] === true) {
        fields.forEach((field) => {
          delete _fieldsValue[field];
        });
      }
    }
    if (!isFromPQS) {
      for (const key in fieldsValue) {
        if (fromPQSFields.find((pqsField) => pqsField.state === key)) {
          delete _fieldsValue[key];
        }
      }
    }
    _fieldsValue["item_class"] = selectedItemClass.item_class.id;
    _fieldsValue["item_type"] = selectedItemType.id;
    _fieldsValue["facility"] = _fieldsValue["facility"].id;
    // remove empty items
    for (const key in _fieldsValue) {
      const field = Object.values(itemFields)
        .flat()
        .find((field) => field.state === key);
      if (field === undefined) {
        if (typeof _fieldsValue[key] === "string") {
          if (_fieldsValue[key].includes(seperator())) {
            _fieldsValue[key] = parseFloat(_fieldsValue[key].replace(",", "."));
          }
        }

        continue;
      }
      if (_fieldsValue[key] === "" || _fieldsValue[key] === null) {
        delete _fieldsValue[key];
        continue;
      }

      if (typeof _fieldsValue[key] === "string") {
        // find this field
        console.log(Object.values(itemFields).flat());
        console.log(key);
        // const field = Object.values(itemFields).flat().find((field) => field.state === key);

        if (field.type === "number") {
          _fieldsValue[key] = parseFloat(_fieldsValue[key].replace(",", "."));
        }
      }
    }
    const page = window.event.submitter.name === "saveNew" ? "new" : "edit";

    const res = await (id === "new"
      ? ItemService.postItem(_fieldsValue)
      : ItemService.putItem(_fieldsValue));
    if (page === "new") {
      window.location.reload();
    } else {
      history.push(`/items/list`);
      setFieldValue(_fieldsValue);
    }
  };

  const selectItemClassHandler = async (e) => {
    console.log(e.target.value);
    console.log(itemClassesAndTypes);
    setSelectedItemClass(itemClassesAndTypes[e.target.value]);
    setSelectedItemType(itemClassesAndTypes[e.target.value].item_type[0]);
  };

  const selectItemTypeHandler = (e) => {
    setSelectedItemType(selectedItemClass.item_type[e.target.value]);
  };

  const onIsFromPQSChange = () => {
    setIsFromPQS((preChecked) => !preChecked);
  };

  const selectPQSHandler = () => {
    // console.log(fieldsValue["PQSPISCode"]);
    const value = pqsData.find(
      (pqs) => pqs.label.split(" , ")[0] === fieldsValue["PQSPISCode"]
    )?.value;
    if (value === undefined) {
      //TODO: show a correct massage to user
      return;
    }

    const cloneFieldsValue = { ...fieldsValue };

    const selectedPqs = pqsData.find(
      (pqs) => pqs?.value?.id === value?.id
    ).value;
    if (selectedPqs.ptype == 3) {
      cloneFieldsValue["PQSPISManufacturer"] = selectedPqs.make;
      cloneFieldsValue["PQSPISRefrigerantGas"] = selectedPqs.refrigerant;
      cloneFieldsValue["PQSPISType"] = selectedPqs.model;
      cloneFieldsValue["PQSPISTemperatureWorkingZone"] =
        selectedPqs.refrigerant;
      cloneFieldsValue["NetVaccineStorageCapacity"] =
        selectedPqs.refrigeratorcapacity
          .toFixed(2)
          .toString()
          .replace(".", seperator());
      cloneFieldsValue["FreezerNetCapacity"] = selectedPqs.freezercapacity
        .toFixed(2)
        .toString()
        .replace(".", seperator());
      cloneFieldsValue["Height"] = selectedPqs.h
        .toFixed(2)
        .toString()
        .replace(".", seperator());
      cloneFieldsValue["Width"] = selectedPqs.w
        .toFixed(2)
        .toString()
        .replace(".", seperator());
      cloneFieldsValue["Length"] = selectedPqs.l
        .toFixed(2)
        .toString()
        .replace(".", seperator());
    } else {
      cloneFieldsValue["PQSPISType"] = selectedPqs.type;
      cloneFieldsValue["PQSPISManufacturer"] = selectedPqs.manufacturer;
      cloneFieldsValue["PQSPISRefrigerantGas"] = "--";
      cloneFieldsValue["PQSPISTemperatureWorkingZone"] = "--";
      cloneFieldsValue["NetVaccineStorageCapacity"] =
        selectedPqs.vaccinenetstoragecapacity
          .toFixed(2)
          .toString()
          .replace(".", seperator());
      cloneFieldsValue["CoolantPackNominalCapacity"] =
        selectedPqs.coolantpacknominalcapacity
          .toFixed(2)
          .toString()
          .replace(".", seperator());
      cloneFieldsValue["NumberOfCoolantPacksRequired"] =
        selectedPqs.numbercoolantpacks;
      cloneFieldsValue["ExternalSize"] = selectedPqs.externalvolume
        .toFixed(2)
        .toString()
        .replace(".", seperator());
    }

    setFieldValue(cloneFieldsValue);
  };

  if (
    isItemDefaultLoading ||
    isItemClassesAndTypesLoading ||
    isItemsFieldsLoading ||
    isItemsFieldsIdle ||
    isPqsLoading
  ) {
    return (
      <ScrollView>
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ScrollView>
    );
  }

  return (
    <form onSubmit={onSaveHandler}>
      <h3 className="page-title mb-3">
        <Trans>Item information</Trans>
      </h3>
      <div className="mt-3">
        <div className="card">
          <div className="card-body pb-3">
            <div className="row pb-4" style={{ overflow: "auto" }}>
           
            </div>
          
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="card">
          <div className="card-body pb-3">
            <div className="row">
              <Form.Group className="row mb-0">
                <label
                  className={`col-sm-4 text-right`}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    lineHeight: "1.4",
                    textAlign: "right",
                  }}
                >
                  <Trans>Facility Name</Trans>:
                </label>
                <div className={"col-sm-8"}>
                  <DynamicInput
                    field={facilityField}
                    defaultValue={fieldsValue["facility"]?.name}
                  />
                </div>
              </Form.Group>
            </div>
            <div className="row mt-3">
              <Form.Group className="row mb-0">
                <label
                  className={`col-sm-4 text-left control-label`}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    lineHeight: "1.4",
                    textAlign: "right",
                  }}
                >
                  <Trans>Item class</Trans>
                </label>
                <div className="col-sm-8">
                  <Form.Control
                    onChange={selectItemClassHandler}
                    className="form-select"
                    as="select"
                    value={itemClassesAndTypes?.findIndex(
                      (i) =>
                        i?.item_class.id === selectedItemClass?.item_class.id
                    )}
                    disabled={activeStep !== 0 || id !== "new"}
                  >
                    {itemClassesAndTypes.map((itemClass, index) => (
                      <option value={index}>
                        {itemClass.item_class.title}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Form.Group>
            </div>
            <div className="row mt-3">
              <Form.Group className="row mb-0">
                <label
                  className={`col-sm-4 text-right control-label`}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    lineHeight: "1.4",
                    textAlign: "right",
                  }}
                >
                  <Trans>Items category</Trans>
                </label>
                <div className="col-sm-8">
                  <Form.Control
                    onChange={selectItemTypeHandler}
                    className="form-select"
                    as="select"
                    value={selectedItemClass?.item_type.findIndex(
                      (i) => i?.id === selectedItemType?.id
                    )}
                    disabled={activeStep !== 0 || id !== "new"}
                  >
                    {selectedItemClass?.item_type.map((itemType, index) => (
                      <option value={index}>{itemType.title}</option>
                    ))}
                  </Form.Control>
                </div>
              </Form.Group>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="card">
          <div className="card-body">
            {activeStep === 0 && (
              <>
                {selectedItemType.havepqs && (
                  <>
                    <div className="row">
                      <Form.Group className="row mb-0">
                        <label
                          className={`col-sm-4 text-right`}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            lineHeight: "1.4",
                            textAlign: "right",
                          }}
                        >
                          <Trans>Is this item from PQS/PIS list?</Trans>
                        </label>
                        <div className="col-sm-6">
                          <input
                            name="is-from-pqs"
                            type="checkbox"
                            onChange={onIsFromPQSChange}
                            checked={isFromPQS}
                          />
                        </div>
                        <hr className="my-3" />
                      </Form.Group>
                    </div>
                    {isFromPQS &&
                      fromPQSFields.map((pqsField) => (
                        <div className="row" key={pqsField.name}>
                          <Form.Group className="row mb-0">
                            <label
                              className={`col-sm-4 text-right ${
                                pqsField.required ? "control-label" : ""
                              }`}
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                lineHeight: "1.4",
                                textAlign: "right",
                              }}
                            >
                              {pqsField.name}
                            </label>

                            <div
                              className={`${
                                pqsField.state === "PQSPISCode"
                                  ? "col-sm-7"
                                  : "col-sm-8"
                              }`}
                            >
                              {pqsData && pqsField.state === "PQSPISCode" ? (
                                <Select
                                  options={pqsData}
                                  onChange={(e) => {
                                    console.log("on change ");
                                    onChangeHandler(
                                      e.label.split(" , ")[0],
                                      pqsField
                                    );
                                  }}
                                  value={{
                                    label: fieldsValue["PQSPISCode"],
                                    value: pqsData.find(
                                      (pqs) =>
                                        pqs.label.split(" , ")[0] ===
                                        fieldsValue["PQSPISCode"]
                                    )?.value,
                                  }}
                                  // onBlur={(e) => {
                                  //   const value = e.target.value;
                                  //   console.log(e.target.value)
                                  //   if (value.length > 0) {
                                  //     console.log("onBlur");
                                  //     onChangeHandler(value, pqsField);
                                  //   }
                                  // }}
                                />
                              ) : (
                                <DynamicInput
                                  field={pqsField}
                                  onChangeHandler={onChangeHandler}
                                  defaultValue={fieldsValue[pqsField.state]}
                                />
                              )}
                            </div>
                            {pqsField.state === "PQSPISCode" && (
                              <div className="col-sm-1">
                                <button
                                  className="btn btn-primary w-100 h-100 mt-1"
                                  onClick={selectPQSHandler}
                                  type="button"
                                >
                                  <Trans>Load</Trans>
                                </button>
                              </div>
                            )}
                            <hr className="my-3" />
                          </Form.Group>
                        </div>
                      ))}
                  </>
                )}
              </>
            )}
            {Object.values(itemFields)[activeStep]?.map((field) => {
              if (!isRelatedFieldOk(field.state, fieldsValue)) {
                return null;
              }
              const hasRequiredError = !!fieldErrors[field.state];
              return (
                <div className="row" key={field.name}>
                  <Form.Group className="row mb-0">
                    <label
                      className={`col-sm-4 text-right ${
                        field.required ? "control-label" : ""
                      }`}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        lineHeight: "1.4",
                        textAlign: "right",
                      }}
                    >
                      <Trans>{field.name}</Trans>
                    </label>
                    <div className="col-sm-8">
                      <DynamicInput
                        field={field}
                        onChangeHandler={onChangeHandler}
                        defaultValue={fieldsValue[field.state]}
                      />
                    </div>
                    {hasRequiredError && (
                      <div className="row">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                          <p className="my-1 ml-2 text-danger">
                            <Trans>{fieldErrors[field.state]}</Trans>
                          </p>
                        </div>
                      </div>
                    )}
                    <hr className="my-3" />
                  </Form.Group>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
    </form>
  );
}

export default Item;
