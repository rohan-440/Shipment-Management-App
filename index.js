var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var DbName = "ShipmentDb";
var DbRel = "Shipment";
var connToken = "90932993|-31949325390442696|90949687";

$("#Shipment-No").focus();

function saveRecNO2LS(jsonObj) {
    var lvData = JSON.parse(json.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getShipAsJsonobj() {
    var shipId = $("#Shipment-No").val();
    var jsonStr = {
        ShipNo: shipId
    };
    return JSON.stringify(jsonStr);
}

function saveData() {
    var jsonObj = validateData();
    if (jsonObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, DbName, DbRel);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetData();
    $("#Shipment-No").focus();

}
function updateData() {
    $('#update').prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, DbName, DbRel, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetData();
    $("#Shipment-No").focus();

}
function resetData() {
    $("#Shipment-No").val("");
    $("#Description").val("");
    $('#Source').val("");
    $("#Destination").val("");
    $("#Shipping-date").val("");
    $("#Expected-Delivery-date").val("");

    $("#Shipment-No").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("reset").prop("disabled", true);
    $("Shipment-No").focus();

}
function fillData(jsonObj) {

    saveRecNO2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#Description").val(data.Description);
    $("#Source").val(data.Source);
    $("#Destination").val(data.Destination);
    $("#Shipping-date").val(data.Shipping - date);
    $("Expected-Delivery-date").val(data.Expected - Delivery - date);
}

function validateData() {
    var ShipNo, Description, Destination, Source, ShippingDate, Delivery;
    ShipNo = $("Shipment-No").val();
    Description = $("#Description").val();
    Source = $('#Source').val();
    Destination = $("#Destination").val();
    ShippingDate = $("#Shipping-date").val();
    Delivery = $("#Expected-Delivery-date").val();

    if (ShipNo === '') {
        alert("Shipment Number is Missing");
        $("#Shipment-No").focus();
        return "";
    }

    if (Description === '') {
        alert("Description Is Missing");
        $("#Description").focus();
        return "";
    }

    if (Source === '') {
        alert("Source is Missing");
        $("#Source").focus();
        return "";
    }

    if (Destination === '') {
        alert("Destination is Missing");
        $("#Destination").focus();
        return "";
    }

    if (ShippingDate === '') {
        alert("Shipping Date is Missing");
        $("#Shipping-date").focus();
        return "";
    }

    if (Delivery === '') {
        alert("Expected Delivery Date is Missing");
        $("#Expected-Delivery-date").focus();
        return "";
    }

    var jsonStrObj = {
        ShipNo: ShipNo,
        Description: Description,
        Source: Source,
        Destination: Destination,
        ShippingDate: ShippingDate,
        Delivery: Delivery
    };
    return JSON.stringify(jsonStrObj);

}

function getNo() {
    var shipJsonObj = getShipAsJsonobj();
    var getRequest = createGET_BY_KEYRequest(connToken, DbName, DbRel, shipJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#Description").focus();
    }
    else if (resJsonObj.status === 200) {
        $("Shipment-No").prop("disabled", true);
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("Description").focus();
    }
}
