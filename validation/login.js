const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateLoginInput(data) {
	let errors = {};
// Convert empty fields to an empty string so we can use validator functions
	data.phone = !isEmpty(data.phone) ? data.phone : "";
	data.password = !isEmpty(data.password) ? data.password : "";
// Phone checks
	if (Validator.isEmpty(data.phone)) {
		errors.Phone = "Phone field is required";
	} else if (!Validator.isMobilePhone(data.phone)) {
		errors.Phone = "Phone is invalid";
	}
// Password checks
	if (Validator.isEmpty(data.password)) {
		errors.password = "Password field is required";
	}
return {
		errors,
		isValid: isEmpty(errors)
	};
};