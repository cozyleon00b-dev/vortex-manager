const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const WEBHOOK_LOGS = "https://discord.com/api/webhooks/1461189182973018194/0hiq26Z3PnnceYnIgLXct8ZmVXlHSEW9dTbZgz-zZn7TwT9NFZdpMuOoEkcVo9viLWDQ";
const WEBHOOK_NON_WL = "https://discord.com/api/webhooks/1461189186299105538/TN9SPHbuU1h3WfXcSFSR8iaXXx-uDOxzc-cfBpXHsTJv6o3BCYQg0FZxqRQNTC0z32VZ";

let whitelistDB = [];

// Roblox Check Endpoint
app.get('/api/check', async (req, res) => {
    const { id, user, map, maplink } = req.query;

    if (whitelistDB.includes(id)) {
        res.json({ allowed: true });
    } else {
        // Send to Discord
        await axios.post(WEBHOOK_NON_WL, {
            embeds: [{
                title: "🚫 NON-WHITELIST KICKED",
                color: 16711680,
                fields: [
                    { name: "Username", value: `[${user}](https://www.roblox.com/users/${id})` },
                    { name: "Map Info", value: `[${map}](${maplink})` }
                ],
                footer: { text: "Security by VS CEO" }
            }]
        });
        res.json({ allowed: false });
    }
});

module.exports = app;
