const mongoose = require('mongoose')
const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internsModel')
//------------------------------------------------------------------------------------------------------------------

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

//------------------------------------------------------------------------------------------------------------------
const createCollege = async function (req, res) {
    try {
        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
        }
        let { name, fullName, logoLink } = req.body

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: `name is required` })
            return
        }

        let Collegedata = await collegeModel.findOne({ name, isDeleted: false })
        if (Collegedata) return res.status(400).send({ status: false, msg: `${name} already exist` })

        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: `fullName is required` })
            return
        }
        let Collegefullname = await collegeModel.findOne({ fullName, isDeleted: false })
        if (Collegefullname) return res.status(400).send({ status: false, msg: `${fullName} already exist` })

        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: `logoLink is required` })
            return
        }
        let CollegeLogo = await collegeModel.findOne({ logoLink, isDeleted: false })
        if (CollegeLogo) return res.status(400).send({ status: false, msg: `${logoLink} already exist` })

        if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink))) {
            res.status(400).send({ status: false, message: `logoLink is not a valid URL` })
            return
        }

        let createdCollege = await collegeModel.create(req.body)
        res.status(201).send({ status: true, msg: "Collage created Successfully", data: createdCollege })
    }
    catch (err) {
        res.status(500).send({ status: false, data: err });
    }
}

const createInterns = async function (req, res) {

    try {
        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide collage details' })
        }
        let { name, mobile, email , CollegeName} = req.body

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: `name is required` })
            return
        }

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }

        const isEmailAlreadyUsed = await internModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }
        if (!isValid(mobile)) {
            res.status(400).send({ status: false, message: `Mobile is required` })
            return
        }
        if (!(String(mobile).length === 10)) {
            res.status(400).send({ status: false, message: `given mobile:${mobile} is not of valid 10 Digit number` })
            return
        }
        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
            return res.status(400).send({
                status: false, message: `${mobile} is not a valid mobile number, Please provide a valid mobile number to continue`,
            });
        }

        const isMobileAlreadyUsed = await internModel.findOne({ mobile });
        if (isMobileAlreadyUsed) {
            res.status(400).send({ status: false, message: `${mobile} this Mobile is already registered` })
            return
        }

         if (!isValid(CollegeName)) {
             res.status(400).send({ status: false, message: `CollegeName is required` })
             return
         }

        let collegeDetail = await collegeModel.findOne({ name: CollegeName, isDeleted: false });
        if (!collegeDetail) return res.status(400).send({ status: false, msg: "No such college found" })
        let { _id } = collegeDetail;

        if (!isValid(_id)) {
            res.status(400).send({ status: false, message: 'College id is required' })
            return
        }

        if (!isValidObjectId(_id)) {
            res.status(400).send({ status: false, message: `${_id} is not a valid College Id` })
            return
        }

        req.body["collegeId"] = _id
        let savedIntern = await internModel.create(req.body)
        res.status(201).send({ status: true, data: savedIntern })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err })
    }
}

const getAllInterns = async function (req, res) {
    try {
        if (!isValid(req.query.CollegeName)) {
            res.status(400).send({ status: false, message: 'collegeName is not proper' })
            return
        }
        let collegeDetail = await collegeModel.findOne({ name: req.query.CollegeName, isDeleted: false })
        if (!collegeDetail) {
            res.status(400).send({ status: false, msg: "No college found " })
            return
        }

        let { _id, name, fullName, logoLink } = collegeDetail
        let allInterns = await internModel.find({ collegeId: _id, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })
        if (allInterns.length === 0) return res.status(400).send({ status: false, msg: "no intern applied for this college" })

        let College = { name, fullName, logoLink, intrest: allInterns }
        let ans = { data: College };

        if (ans) {
            res.status(200).send(ans)
        } else {
            res.status(400).send({ status: false, msg: "no one has applied for this college" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}
module.exports = {createCollege,
    createInterns,
    getAllInterns}
