"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggedInUsersCount = exports.resendOTP = exports.login = exports.register = void 0;
const emailServices_1 = require("../Utils/emailServices");
const userModel_1 = __importDefault(require("../Models/userModel"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone } = req.body;
        const password = (0, emailServices_1.generatePassword)();
        const newUser = new userModel_1.default({ name, email, phone, password });
        yield newUser.save();
        yield (0, emailServices_1.sendPasswordByEmail)(email, password);
        res.status(201).json({ message: 'User registration successful' });
    }
    catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({ message: 'Validation error', errors });
        }
        else {
            res.status(500).json({ message: 'Registration failed' });
        }
    }
});
exports.register = register;
let usersLoggedCount = 0;
const otpStore = {}; // Simple in-memory store for OTPs
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, otp } = req.body;
        const user = yield userModel_1.default.findOne({ $or: [{ email }, { phone }] });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const contact = email ? email : phone;
        const storedOTP = otpStore[contact];
        if (!storedOTP || otp !== storedOTP) {
            res.status(401).json({ message: 'Invalid OTP' });
            return;
        }
        delete otpStore[contact]; // OTP is valid, remove it from store
        usersLoggedCount++;
        res.status(200).json({ message: 'Login successful', user });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});
exports.login = login;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone } = req.body;
        if (!email && !phone) {
            res.status(400).json({ message: 'Email or Phone is required' });
            return;
        }
        const user = yield userModel_1.default.findOne({ $or: [{ email }, { phone }] });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const contact = email ? email : phone;
        const otp = (0, emailServices_1.generateOTP)();
        otpStore[contact] = otp;
        yield (0, emailServices_1.sendOTP)(contact, otp);
        res.status(200).json({ message: 'OTP resent successfully' });
    }
    catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
});
exports.resendOTP = resendOTP;
const getLoggedInUsersCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ count: usersLoggedCount });
    }
    catch (error) {
        console.error('Error fetching logged-in users count:', error);
        res.status(500).json({ message: 'Failed to fetch users count' });
    }
});
exports.getLoggedInUsersCount = getLoggedInUsersCount;
