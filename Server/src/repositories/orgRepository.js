const Organization = require("../models/organization.model");


const findOrgByName = async (name, session = null) => {
    return Organization.findOne({ name }).session(session);
};



const findOrgById = async (id, session = null) => {
    return Organization.findById(id).session(session);
};

const createOrganization = async (orgData, session = null) => {
    const [org] = await Organization.create([orgData], { session });
    return org;
};


module.exports = {
    findOrgByName,
    createOrganization,
    findOrgById
};
