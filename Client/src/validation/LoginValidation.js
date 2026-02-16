export const LoginFormValidate = (val) => {
  const errors = {};

// NameValid
  if (!val.name || !val.name.trim()) {
    errors.name = "Name is required";
  } else if (!/^[A-Za-z\s]+$/.test(val.name)) {
    errors.name = "Name can only contain letters and spaces";
  }


  // OrgValid 

  if (val.role === "admin") {
    if (!val.orgName || !val.orgName.trim()) {
      errors.orgName = "Organization name is required";
    }
  }

  // EmailValid
  if (!val.email) {
    errors.email = "Email is required"
  } else if (!/^\S+@\S+\.\S+$/.test(val.email)) {
    errors.email = "Invalid email address"
  }


// PasswordValid
  if (!val.password) {
    errors.password = "Password is required"
  } else if (val.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
//RoleVAlid
  if (!val.role) {
    errors.role = 'Role is required'
  }

  return errors;
};
