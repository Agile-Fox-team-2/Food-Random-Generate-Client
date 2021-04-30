$(document).ready(() => {
	checkIsLoggedIn();

	$("#navRegister").click((e) => {
		e.preventDefault();
		$("#navRegister").hide();
		$("#navLogin").show();
		$("#login").hide();
		$("#register").show();
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
		$("#emailLogin").val("");
		$("#passwordLogin").val("");
	});

	$("#navLogout").click((e) => {
		e.preventDefault();
		logout();
	});

	$("#navFavorit").click((e) => {
		e.preventDefault();
		$('#foodList')
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
		$("#navFavorite").show();
		$("#navRandom").show();

		$("#login").hide();
		$("#register").hide();
		$("#foodList").show();
		$("#foodContainer").show();

		getFoods();
		generateFood();
	} else {
		$("#navLogin").hide();
		$("#navLogout").hide();
		$("#navRegister").show();
		$("#navFavorite").hide();
		$("#navRandom").hide();

		$("#login").show();
		$("#register").hide();
		$("#foodList").hide();
		$("#foodContainer").hide();
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
			// console.log(errors.join(", "));
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
			// console.log(errors.join(", "));
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
	if (e) e.preventDefault();
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/foods/random",
		headers: {
			access_token: localStorage.getItem("access_token"),
		},
	})
		.done((data) => {
			const {
				analyzedInstructions,
				image,
				servings,
				sourceUrl,
				title,
				diets,
			} = data;
			console.log(analyzedInstructions);
			console.log(analyzedInstructions[0].steps[0].ingredients[0].name)
			let instructionHtml = "";
			analyzedInstructions[0].steps.forEach((instruction) => {
				instructionHtml += `
				<li>
					${instruction.step}
				</li>
				`;
			});
			let ingredients = [];
			analyzedInstructions[0].steps.forEach((e) => {
				ingredients.push(`${e.ingredients[0].name}`);
			})
			console.log(instructionHtml);
			const foodContainer = $("#foodContainer");
			foodContainer.empty();
			foodContainer.append(`
				<div class="row-content">
					<div class="d-flex justify-content-center">
						<div class="card">
							<div class="d-flex justify-content-center align-items-center" style="margin: 10px; padding: 10px;">
								<button onclick="generateFood()" class="btn btn-class">Random Food</button>
							</div>
							<img
								src="${image}"
								alt="Fennel and Orange Salad With Toasted Hazelnuts and Cranberries"
								class="card-img-top"
							/>
						<div class="card-body">
							<h5
								class="card-title"
								style="text-align: center; padding-top: 10px; font-weight: 600;"
							>
								${title} <br>
								<a href="${sourceUrl}" style="text-decoration: none; font-weight: 100 !important; font-size: small;">${sourceUrl}</a>
							</h5>
							<div class="card-after-title">
								<div>
									<label for="servings">
										Servings:
										<!-- ambil value serving aja -->
										<h6 class="card-servings">${servings} servings</h6>
									</label>
								</div>
								<div>
									<label for="diets">
										Diets:
										<!-- ambil values dari Diets, diolah agar tanpa tanda petik dan spasi setelah koma -->
										<h6 class="card-diets">
											${diets}
										</h6>
									</label>
								</div>
								<div>
									<!-- ambil value ingredients, equipment, dan instruction dari analyzedInstruction -->
									<label for="ingredients">
										Ingredients:
										<!-- ambil name ingredients dari tiap steps nya, di join -->
										<h6>
											${ingredients.join(', ')}
										</h6>
									</label>
								</div>
								<div>
									<label for="instruction">
										Instruction:
										<h6>
											<ol>
												<!-- ambil value step dari steps -->
												${instructionHtml}
											</ol>
										</h6>
									</label>
								</div>
							</div>
							<button onclick="sendFood()" class="btn btn-class" style="float: right">
								Send to email
							</button>
						</div>
					</div>
				</div>
			</div>
      `);
		})
		.fail((err) => console.log(err));
};

const sendFood = () => {
	$.ajax({
		method: 'POST',
		url: 'http://localhost:3000/sendfood',
		headers: {
			access_token: localStorage.getItem("access_token")
		}
	})
	.done(() => {
		console.log('berhasil');
	})
	.fail(err => {
		console.log(err);
	})
}

function onSignUp(googleUser) {
	const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/googleregister',
    data: {
      google_token: id_token
    }
  })
    .done((data) => {
      const { access_token } = data;
			localStorage.setItem('access_token', access_token);
			$('#firstNameRegister').val("")
			$('#lastNameRegister').val("")
      $('#emailRegister').val("")
      $('#passwordRegister').val("");
      checkIsLoggedIn();
      // Toastify({
      //   text: "Successfully Sign up with Google",
      //   duration: 2000,
      //   backgroundColor: "#07bc0c",
      // }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      // swal("Registration Failed", errors.join(', '), "error");
    })
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/googlesignin',
    data: {
      google_token: id_token
    }
  })
    .done((data) => {
      const { access_token } = data;
      localStorage.setItem('access_token', access_token);
      $('#emailLogin').val("")
      $('#passwordLogin').val("");
      // Toastify({
      //   text: "Successfully Sign in with Google",
      //   duration: 2000,
      //   backgroundColor: "#07bc0c",
      // }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      // swal("Google login failed", errors.join(', '), "error");
    })
    .always(() => {
      checkIsLoggedIn();
    });
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
