const baseApi = "http://localhost:5678/api";
const routeLogin = "/users/login"; // POST
const routeCategory = "/categories"; // GET
const routeWork = "/works"; // GET & POST & DELETE (/id)

const tableWork = [];

fetch( baseApi + routeCategory )
	.then(response => response.json())
	.then(data => {

		data.map((item) => {
			var e_0 = document.createElement("button");
			e_0.setAttribute("id", item.id);
			e_0.appendChild(document.createTextNode(item.name));
			document.querySelector(".filters").appendChild(e_0);
		});
	
}).catch(error => {
		console.log(error);
});

fetch( baseApi + routeWork )
    .then(response => response.json())
    .then(data => {
		tableWork.push(data);
		init();
}).catch(error => {
    console.log(error);
});

function getWork(filterId){

    document.querySelector(".gallery").innerHTML = "";

	var dataFilter;

	if (filterId != 0)
		dataFilter = tableWork[0].filter((item) => item.categoryId == filterId);
	else
		dataFilter = tableWork[0];

	console.log(dataFilter, tableWork.categoryId);

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

function init() {
	getWork(0);
	document.querySelectorAll(".filters button").forEach((item) => {
		item.addEventListener("click", function(){
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

if (document.location.href.includes("edit")){
    if (!document.cookie.includes("token")) {
        window.location.href = "./login.html";
    }
}

function Logout(){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "./login.html";
}