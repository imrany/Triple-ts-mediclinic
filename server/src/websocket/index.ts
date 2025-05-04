import { registerEmail, unregisterEmail, getEmailSocketIds } from "./userRegistry";

export default function socket(io:any){
    io.on("connection", function(socket: any) {
        var clientIp = socket.request.connection.remoteAddress;
        console.log(`a user connected: ${socket.id}, ClientIP : ${clientIp} `);
        
        // Register email when client sends it 
        socket.on('registerEmail', (email:string) => { 
            registerEmail(email, socket.id); 
            console.log(`Registered email: ${email} with socket ID: ${socket.id}`); 
        }); 

        // Handle disconnection 
        socket.on('disconnect', (reason:any) => { 
            unregisterEmail(socket.id); 
            console.log('User disconnected:', socket.id); 
            io.emit(`${reason} has left`)
        }); 

        // Broadcast a message to all clients with the same email 
        socket.on('broadcastToEmail', ({ email, message }:{email:string, message:string}) => { 
            const socketIds = getEmailSocketIds(email); 
            if (socketIds.length > 0) { 
                socketIds.forEach((id:string) => { 
                    io.to(id).emit('emailBroadcast', message); 
                }); 
            } else { 
                console.log(`No clients found for email: ${email}`); 
            }
        })

        socket.on("update", (update:string, err:any) => {
            io.emit("response",update)
            if(err){
                console.log(err)
            }
        });
    });
}
