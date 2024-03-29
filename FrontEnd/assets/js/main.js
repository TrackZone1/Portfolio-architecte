const baseApi = "http://localhost:5678/api";
const routeLogin = "/users/login"; // POST
const routeCategory = "/categories"; // GET
const routeWork = "/works"; // GET & POST & DELETE (/id)

var tableWork = [];
const tableCategory = [];

document.addEventListener("click", function (event) {
    var parentElement = event.target.parentNode;
    if (parentElement) {
        var parentId = parentElement.id;
        if (parentId === "DeleteWork") {
            DeleteWork(parentElement.getAttribute("data-id"));
        }
    }

    if (event.target.id === "AddWork") {
        AddWork();
    }
});

fetch(baseApi + routeCategory)
    .then((response) => response.json())
    .then((data) => {
        data.map((item) => {
            tableCategory.push(data);
            if (document.querySelector(".filters")) {
                var e_0 = document.createElement("button");
                e_0.setAttribute("id", item.id);
                e_0.appendChild(document.createTextNode(item.name));
                document.querySelector(".filters").appendChild(e_0);
            }
            init();
        });
    })
    .catch((error) => {
        console.log(error);
    });

function getWork(filterId) {
    document.querySelector(".gallery").innerHTML = "";

    var dataFilter;

    if (filterId != 0)
        dataFilter = tableWork[0].filter((item) => item.categoryId == filterId);
    else dataFilter = tableWork[0];

    //console.log(dataFilter, tableWork.categoryId);

    dataFilter.map((item) => {
        var e_0 = document.createElement("figure");
        var e_1 = document.createElement("img");
        e_1.setAttribute("src", item.imageUrl);
        e_1.setAttribute("alt", item.title);
        e_0.appendChild(e_1);
        var e_2 = document.createElement("figcaption");
        e_2.appendChild(document.createTextNode(item.title));
        e_0.appendChild(e_2);
        document.querySelector(".gallery").appendChild(e_0);
    });
}

function getWorkModal() {
    document.querySelector("#listWork").innerHTML = "";
    tableWork[0].map((item, i) => {
        var e_0 = document.createElement("figure");
        var e_1 = document.createElement("img");
        e_1.setAttribute("src", item.imageUrl);
        e_1.setAttribute("alt", item.title);
        e_1.setAttribute("width", "80%");
        e_0.appendChild(e_1);
        var e_2 = document.createElement("div");
        e_2.setAttribute("class", "buttonGroup");
        if (i === 0) {
            var e_3 = document.createElement("button");
            var e_4 = document.createElement("i");
            e_4.setAttribute("class", "fa-solid fa-arrows-up-down-left-right");
            e_3.appendChild(e_4);
            e_2.appendChild(e_3);
        }
        var e_5 = document.createElement("button");
        e_5.setAttribute("id", "DeleteWork");
        e_5.setAttribute("data-id", item.id);
        var e_6 = document.createElement("i");
        e_6.setAttribute("class", "fa-solid fa-trash-can");
        e_5.appendChild(e_6);
        e_2.appendChild(e_5);
        e_0.appendChild(e_2);
        var e_7 = document.createElement("figcaption");
        e_7.appendChild(document.createTextNode("éditer"));
        e_0.appendChild(e_7);
        document.querySelector("#listWork").appendChild(e_0);
    });
}

if (document.querySelector('button[data-target="modal-1"]')) {
    document
        .querySelector('button[data-target="modal-1"]')
        .addEventListener("click", function () {
            getWorkModal();
        });
}

var loadFile = function (event) {
    document.querySelector(".uploadImage").classList.add("previewImage");

    document.querySelector("#output").innerHTML =
        "<img src='" +
        URL.createObjectURL(event.target.files[0]) +
        "' alt='image' width='100%'>";

    getCategoryModal();

    document
        .querySelector("div.submitGroup:nth-child(7) > input:nth-child(1)")
        .removeAttribute("disabled");
};

function getCategoryModal() {
    tableCategory[0].map((item) => {
        var e_0 = document.createElement("option");
        e_0.setAttribute("value", item.id);
        e_0.appendChild(document.createTextNode(item.name));
        document.querySelector("#category").appendChild(e_0);
    });
}

async function init() {
    tableWork = [];
    var res = await fetch(baseApi + routeWork);
    var data = await res.json();
    tableWork.push(data);

    getWork(0);
    document.querySelectorAll(".filters button").forEach(async (item) => {
        item.addEventListener("click", function () {
            getWork(item.id);

            document.querySelectorAll(".filters button").forEach((item) => {
                item.classList.remove("active");
            });

            item.classList.add("active");
        });
    });
}

/***
 *
 *  Edition
 *
 ***/

if (document.location.href.includes("edit")) {
    if (!document.cookie.includes("token")) {
        window.location.href = "./login.html";
    }
}

function Logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "./login.html";
}

async function AddWork() {
    var image = document.querySelector("#image").files[0];
    var title = document.querySelector("#title").value;
    var category = document.querySelector("#category").value;

    if (!image) {
        document.getElementById("errorModal").innerText =
            "Veuillez ajouter une image";
        return false;
    }

    if (!title) {
        document.getElementById("errorModal").innerText =
            "Veuillez ajouter un titre";
        return false;
    }

    if (!category) {
        document.getElementById("errorModal").innerText =
            "Veuillez ajouter une catégorie";
        return false;
    }

    var formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    const res = await fetch(baseApi + routeWork, {
        method: "POST",
        body: formData,
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1],
        },
    });

    if (res.status === 201) {
        init();
        hideAllModalWindows();

        document.querySelector("#image").value = "";
        document.querySelector("#output").innerHTML = "";
        document.querySelector("#title").value = "";
        document.querySelector("#category").value = "";

        var e_0 = document.querySelector("#output");
        var e_1 = document.createElement("i");
        e_1.setAttribute("class", "fa-regular fa-image");
        e_0.appendChild(e_1);
        var e_2 = document.createElement("button");
        var e_3 = document.createElement("i");
        e_3.setAttribute("class", "fa-solid fa-plus");
        e_2.appendChild(e_3);
        e_2.appendChild(document.createTextNode(" Ajouter une photo\n"));
        e_0.appendChild(e_2);
        var e_4 = document.createElement("small");
        e_4.appendChild(document.createTextNode("jpg, png : 4mo max"));
        e_0.appendChild(e_4);

        document.querySelector(".uploadImage").classList.remove("previewImage");
        document
            .querySelector("div.submitGroup:nth-child(7) > input:nth-child(1)")
            .addAttribute("disabled");
    }
}

async function DeleteWork(id) {
    const res = await fetch(baseApi + routeWork + "/" + id, {
        method: "DELETE",
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + document.cookie.split("=")[1],
        },
    });

    if (res.status === 204) {
        init();
        hideAllModalWindows();
    }
}
