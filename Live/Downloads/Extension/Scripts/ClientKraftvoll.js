class ClientKraftvoll {
    static backEnd = {
        createChannel: async (participants) => {
            const server = new ServerCommunicator();
            const response = await server.template.post("Kraftvoll_CreateChannel", {"participants": participants});

            if(response && response.ok) {
                return response.data;
            }

            console.log(response);
            return response;
        },

        sendMessage: async (channelId, message) => {
            const server = new ServerCommunicator();
            const response = await server.template.post("Kraftvoll_Send", {"channel": channelId, "textContent": message});

            if(response && response.ok) {
                return true;
            }

            console.log(response);
            try {
                window.alert(response.message);
            } catch (error) {

            }
            return false;
        },

        loadMessages: async (channelId, index) => {
            const server = new ServerCommunicator();
            const response = await server.template.post("Kraftvoll_Load", {"channel": channelId, "index": index});

            if(response && response.ok) {
                return response;
            }

            console.log(response);
            return response;
        },

        viewChannels: async () => {
            const server = new ServerCommunicator();
            const response = await server.template.post("Kraftvoll_ViewChannel");

            if(response && response.ok) {
                return response.data;
            }

            console.log(response);
            return false;
        },
    };
}