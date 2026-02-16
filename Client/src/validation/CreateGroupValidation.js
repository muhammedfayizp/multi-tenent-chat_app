export const CreateGroupValidate = ({ groupName, users = [], showUsers }) => {
    const errors = {};

    // Validate Group Name
    if (!groupName || !groupName.trim()) {
        errors.groupName = "Group name is required";
    } else {
        const trimmed = groupName.trim();

        const onlyNumbers = /^[0-9]+$/.test(trimmed);
        const onlySpecialChars = /^[^A-Za-z0-9]+$/.test(trimmed);

        if (onlyNumbers) {
            errors.groupName = "Group name cannot be only numbers";
        } else if (onlySpecialChars) {
            errors.groupName = "Group name cannot be only special characters";
        }
    }

    // Validate Users only if showUsers is true
    if (showUsers) {
        errors.users = [];

        users.forEach((user, index) => {
            const userErrors = {};

            // Name validation
            if (!user.name || !user.name.trim()) {
                userErrors.name = "Name is required";
            } else if (!/^[A-Za-z\s]+$/.test(user.name)) {
                userErrors.name = "Name can only contain letters and spaces";
            }

            // EmailValida
            if (!user.email || !user.email.trim()) {
                userErrors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
                userErrors.email = "Invalid email";
            }

            // RoleValidation
            if (!user.role || !user.role.trim()) {
                userErrors.role = "Role is required";
            }

            errors.users[index] = userErrors;
        });
    }

    return errors;
};
