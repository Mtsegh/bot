const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");


const getAllUsers = asyncHandler(async (psd) => {
    // if (psd !== process.env.JWT_SECRET) {
    //     return 'Warning!!! Not authorized.'
    // }
    try {
        // Fetch all users sorted by createdAt descending
        const users = await User.find().sort({ createdAt: -1 });
        
        let userInfo = [];
        for (let i = 0; i < users.length; i++) {    
            userInfo.push({
                name: users[i].name,
                balance: users[i].balance,
                telegramId: users[i].telegramId
            });
        }  
        console.log(userInfo);
        return userInfo;
    } catch (error) {
        return { error: error.message };
    }
});

const getUserInfo = asyncHandler(async (psd, TId) => {
    // if (psd !== process.env.JWT_SECRET) {
    //     return 'Warning!!! Not authorized.'
    // }
    try {
        // Fetch user details
        const user = await User.findOne({ telegramId: TId });
        
        if (!user) {
            return { message: "User not found" };
        }

        // Destructure user info
        const { AUT, balance, details, telegramId  } = user;
        const text = { accountStatus: user.accountStatus?'Suspend user' : 'Activate user', admin: user.admin?'Remove admin':'Make admin' }
        return { AUT, balance, details, telegramId, text };
    } catch (error) {
        return { error: error.message };
    }
});

const search = asyncHandler(async (search) => {
    try {
        // Fetch user details
        const users = await User.find(search);  // `findAll` returns an array

        if (users.length === 0) {
            return { message: "User not found" };
        }

        // Map each user to their info
        const userInfos = users.map(user => ({
            name: user.name,
            balance: user.balance,
            details: user.details,
            telegramId: user.telegramId,
        }));

        return userInfos;  // Return an array of user info objects
    } catch (error) {
        return { error: error.message };
    }
});

const changeUserStatus = asyncHandler(async (TId) => {
    try {
        
        const user = await User.findOne({ telegramId: TId });
    
        if (user) {
            const { accountStatus } = user;
            user.accountStatus = !accountStatus;
    
            const newstatus = await user.save();
    
            return { 
                success: `${newstatus.name} account status has been changed to ${newstatus.accountStatus}`,
                text: newstatus.accountStatus?'Suspend user' : 'Activate user'
            };
        } else {
            return { message: "User not found" };
        }
    } catch (error) {
        return { error: error.message }
    }
    
});

const setAdmin = asyncHandler(async (TId) => {
    try {
        
        const user = await User.findOne({ telegramId: TId });
    
        if (user) {
            const { admin } = user;
            user.admin = !admin;
    
            const madeAdmin = await user.save();
    
            return {
                success: `${madeAdmin.name} admin status has been switched to ${madeAdmin.admin}`,
                text: madeAdmin.admin?'Remove admin':'Make admin'
            };
        } else {
            return { message: "User not found" };
        }
    } catch (error) {
        return { error: error.message }
    }
    
});

module.exports = {
    getAllUsers,
    getUserInfo,
    changeUserStatus,
    search,
    setAdmin
}