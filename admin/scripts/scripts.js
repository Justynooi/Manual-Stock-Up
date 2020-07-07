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
var merchantID, stockQuantity, button, stockAdd, children, total, variant, variantItem, variantItemID, submit;

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
        var input = "<br>\n";
        for (var i = 1; i <= children.length; i++) {
            variant = "variant" + i
            input = input + "<div>\n" + "<input type=\"radio\" id=\"" + variant + "\" name=\"variant\" value=\"" + children[i-1].ID + "\">\n"
            input = input + "<label for=\"" + variant + "\">";
            for (var j = 1; j <= children[i-1].Variants.length; j++) {
                if (j == children[i-1].Variants.length) {
                    input = input + children[i-1].Variants[j-1].Name;
                } else {
                    input = input + children[i-1].Variants[j-1].Name + " - ";
                }
            }
            input = input + "</label>\n" + "</div><br>\n";
        }
        input = input + "<button id=\"variantID\" onclick=\"submitVariantID()\">Submit</button>"
        var popup = document.getElementById("popup");
        popup.innerHTML = input;
        popup.classList.add("show");
        popup.classList.remove("hide");
        submit = document.getElementById("submitID");
        submit.classList.add("hide");
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

function submitVariantID() {
    for (var i = 1; i <= children.length; i++) {
        variant = "variant" + i
        if(document.getElementById(variant).checked) {
            variantItem = document.getElementById(variant);
            variantItemID = variantItem.value;
            console.log(variantItemID);
            for (var i = 0; i < children.length; i++) {
                if (variantItemID == children[i].ID) {
                    stockQuantity = children[i].StockQuantity;
                }
            }
            data = {
                StockQuantity: Number(stockQuantity) + Number(stockAdd)
            }
            settings = {
                url: "https://" + baseURL + "/api/v2/merchants/" + merchantID + "/items/" + variantItemID,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                data: JSON.stringify(data),
                async: false
            }
            $.ajax(settings).done(function(response) {
                toastr.success("Stock Incremented!","Success");
            });
            break;
        }
    }
    submit.classList.remove("hide");
    popup.classList.add("hide");
    popup.classList.remove("show");
}
//83d9c73f-8b2f-4f36-a7bc-1b4c81f3bb90
//18d7a59b-4344-4cb6-b672-5b6602cf0068