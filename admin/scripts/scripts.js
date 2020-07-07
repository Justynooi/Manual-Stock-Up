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
var merchantID, stockQuantity, button, stockAdd, children, total;

function incrementStock(itemID) {
    var object;
    settings = {
        url: "https://" + baseURL + "/api/v2/items/" + itemID,
        method: "GET",
        async: false
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
        object = response;
        stockQuantity = response.StockQuantity;
        merchantID = response.MerchantDetail.ID;
    });
    console.log(object.HasChildItems);
    if (object.HasChildItems) {
        console.log("has children");
        children = object.ChildItems;
        console.log(children);
        var input = "<br>";
        for (var i = 1; i <= children.length; i++) {
            var variant = "variant" + i
            input = input + "<div>\n" + "<input type=\"radio\" id=\"" + variant + "\" name=\"" + variant + "\">\n"
            input = input + "<label for=\"" + variant + "\">" + children[i-1].Variants[0].Name + "</label>\n" + "</div><br>\n"
        }
        input = input + "<button id=\"submitVariant\" onclick=\"submitVariant()\">Submit</button>"
        var popup = document.getElementById("popup");
        popup.innerHTML = input;
        popup.classList.add("show");
        popup.classList.remove("hide");
    } else {
        console.log("no children");
        data = {
            StockQuantity: Number(stockQuantity) + Number(stockAdd)
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
}

function submitID() {
    button = document.getElementById("submitID");
    var item = document.getElementById("item");
    var itemID = item.value;
    stockAdd = document.getElementById("number").value;
    incrementStock(itemID);
}
//83d9c73f-8b2f-4f36-a7bc-1b4c81f3bb90
//18d7a59b-4344-4cb6-b672-5b6602cf0068