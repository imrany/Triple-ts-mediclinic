
let emailToSocketMap:any = {};

export const registerEmail = (email:string, socketId:string) => {
    if (!emailToSocketMap[email]) {
        emailToSocketMap[email] = [];
    }
    emailToSocketMap[email].push(socketId);
};

export const unregisterEmail = (socketId:string) => {
    for (const email in emailToSocketMap) {
        emailToSocketMap[email] = emailToSocketMap[email].filter((id:string) => id !== socketId);
        if (emailToSocketMap[email].length === 0) {
            delete emailToSocketMap[email];
        }
    }
};

export const getEmailSocketIds = (email:string) => {
    return emailToSocketMap[email] || [];
};
