$(document).ready(() => {
	checkIsLoggedIn();

	$("#navRegister").click((e) => {
		e.preventDefault();
		$("#navRegister").hide();
		$("#navLogin").show();
		$("#login").hide();
		$("#register").show();
		$("#foodList").hide();
		$("#firstNameRegister").val("");
		$("#lastNameRegister").val("");
		$("#emailRegister").val("");
		$("#passwordRegister").val("");
	});

	$("#navLogin").click((e) => {
		e.preventDefault();
		$("#navRegister").show();
		$("#navLogin").hide();
		$("#login").show();
		$("#register").hide();
		$("#todoList").hide();
		$("#emailLogin").val("");
		$("#passwordLogin").val("");
	});

	$("#navLogout").click((e) => {
		e.preventDefault();
		logout();
	});

	$("#form-login").on("submit", (e) => {
		e.preventDefault();
		login();
	});

	$("#form-register").on("submit", (e) => {
		e.preventDefault();
		register();
	});
});

const checkIsLoggedIn = () => {
	if (localStorage.getItem("access_token")) {
		$("#navLogin").hide();
		$("#navLogout").show();
		$("#navRegister").hide();

		$("#login").hide();
		$("#register").hide();
		$("#foodList").show();

		getFoods();
	} else {
		$("#navLogin").hide();
		$("#navLogout").hide();
		$("#navRegister").show();

		$("#login").show();
		$("#register").hide();
		$("#foodList").hide();
		$("#firstNameRegister").val("");
		$("#lastNameRegister").val("");
		$("#emailRegister").val("");
		$("#passwordRegister").val("");
		$("#emailLogin").val("");
		$("#passwordLogin").val("");

		clearFoods();
	}
};

const register = () => {
	let firstName = $("#firstNameRegister").val();
	let lastName = $("#lastNameRegister").val();
	let email = $("#emailRegister").val();
	let password = $("#passwordRegister").val();
	console.log(firstName, lastName, email, password);

	$.ajax({
		method: "POST",
		url: "http://localhost:3000/register",
		data: {
			firstName,
			lastName,
			email,
			password,
		},
	})
		.done(() => {
			$("#firstNameRegister").val("");
			$("#lastNameRegister").val("");
			$("#emailRegister").val("");
			$("#passwordRegister").val("");
			checkIsLoggedIn();
		})
		.fail((err) => {
			const errors = err.responseJSON.errorMessages;
			console.log(errors.join(", "));
		});
};

const login = () => {
	let email = $("#emailLogin").val();
	let password = $("#passwordLogin").val();

	$.ajax({
		method: "POST",
		url: "http://localhost:3000/signin",
		data: {
			email,
			password,
		},
	})
		.done((data) => {
			const { access_token } = data;
			localStorage.setItem("access_token", access_token);
			$("#emailLogin").val("");
			$("#passwordLogin").val("");
		})
		.fail((err) => {
			const errors = err.responseJSON.errorMessages;
			console.log(errors.join(", "));
		})
		.always(() => {
			checkIsLoggedIn();
		});
};

const logout = () => {
	localStorage.removeItem("access_token");
	checkIsLoggedIn();
};

const getFoods = () => {};

const clearFoods = () => {
	$("#foodList").empty();
};

const addFood = (e) => {
	e.preventDefault();

	const title = $("#title-field");
	const food_url = $("#foodUrl-field");

	$.ajax({
		type: "POST",
		url: "http://localhost:3000/foods",
		headers: {
			access_token: localStorage.getItem("access_token"),
		},
		data: {
			title: title.val(),
			food_url: food_url.attr("href"),
		},
	})
		.done((data) => {
			console.log(data);
		})
		.fail((err) => console.log(err))
		.always((_) => {
			displayFood();
		});
};

const displayFoods = () => {
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/foods",
		headers: {
			access_token: localStorage.getItem("access_token"),
		},
	})
		.done((data) => {
			const foodContainer = $("#foodList");
			foodContainer.empty();
			data.forEach((food) => {
				foodContainer.append(`

        `);
			});
			foodContainer.append();
		})
		.fail((err) => console.log(err))
		.always((_) => {
			$(".food-del-btn").on("click", deleteFood);
		});
};

const deleteFood = (e) => {
	e.preventDefault();
	const foodId = e.target.getAttribute("data-id");

	$.ajax({
		type: "DELETE",
		url: `http://localhost:3000/foods/${foodId}`,
		headers: {
			access_token: localStorage.getItem("access_token"),
		},
	})
		.done((data) => {
			console.log(data);
		})
		.fail((err) => console.log(err))
		.always((_) => {
			displayFood();
		});
};

const generateFood = (e) => {
	e.preventDefault();
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/foods/random",
		headers: {
			access_token: localStorage.getItem("access_token"),
		},
	})
		.done((data) => {
			const foodContainer = $("#food-cotainer");
			foodContainer.empty();
			foodContainer.append(`
      
      `);
		})
		.fail((err) => console.log(err));
};
