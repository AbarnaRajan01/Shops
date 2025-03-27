import { Request, Response } from 'express';
import { generatePassword, sendPasswordByEmail, verifyOTP, generateOTP, sendOTP } from '../Utils/emailServices';
import User from '../Models/userModel';


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;
    const password = generatePassword();
    const newUser = new User({ name, email, phone, password });
    await newUser.save();
    await sendPasswordByEmail(email, password);
    res.status(201).json({ message: 'User registration successful' });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      res.status(500).json({ message: 'Registration failed' });
    }
  }
};

let usersLoggedCount = 0;
const otpStore: { [key: string]: string } = {}; // Simple in-memory store for OTPs

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, otp } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      res.status(400).json({ message: 'Email or Phone is required' });
      return;
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const contact = email ? email : phone;
    const otp = generateOTP();
    otpStore[contact] = otp;

    await sendOTP(contact, otp);
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
};

export const getLoggedInUsersCount = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ count: usersLoggedCount });
  } catch (error) {
    console.error('Error fetching logged-in users count:', error);
    res.status(500).json({ message: 'Failed to fetch users count' });
  }
};


