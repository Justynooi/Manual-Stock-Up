function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts
            .pop()
            .split(";")
            .shift();
    }
}

var token = getCookie("webapitoken");
var baseURL = window.location.hostname;
adminId = document.getElementById("userGuid").value;
var merchantID, stockQuantity, button;

function incrementStock(itemID) {
    settings = {
        url: "https://" + baseURL + "/api/v2/items/" + itemID,
        method: "GET", 
        async: false
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
        stockQuantity = response.StockQuantity;
        merchantID = response.MerchantDetail.ID;
    });

    data = {
        StockQuantity: stockQuantity + 1
    }
    settings = {
        url: "https://" + baseURL + "/api/v2/merchants/" + merchantID + "/items/" + itemID,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        data: JSON.stringify(data),
        async: false
    }
    $.ajax(settings);
}

function submitID() {
    button = document.getElementById("submitID");
    var item = document.getElementById("item");
    incrementStock(item.value);
}