"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const lavacord_1 = require("lavacord");
__exportStar(require("lavacord"), exports);
class Manager extends lavacord_1.Manager {
    constructor(client, nodes, options) {
        super(nodes, options || {});
        this.client = client;
        this.send = packet => {
            if (this.client.guilds.cache) {
                const guild = this.client.guilds.cache.get(packet.d.guild_id);
                if (guild)
                    return guild.shard.send(packet);
            }
            else {
                const guild = this.client.guilds.cache.get(packet.d.guild_id);
                if (guild)
                    return guild.shard.send(packet);
            }
        };
        if (!options) {
            this.user = client.user?.id;
            this.shards = client.options.shardCount || 1;
        }
        if (client.guilds.cache) {
            client.ws
                .on("VOICE_SERVER_UPDATE", this.voiceServerUpdate.bind(this))
                .on("VOICE_STATE_UPDATE", this.voiceStateUpdate.bind(this))
                .on("GUILD_CREATE", async (data) => {
                for (const state of data.voice_states) {
                    await this.voiceStateUpdate({ ...state, guild_id: data.id });
                }
            });
        }
        else {
            client.on("raw", async (packet) => {
                switch (packet.t) {
                    case "VOICE_SERVER_UPDATE":
                        await this.voiceServerUpdate(packet.d);
                        break;
                    case "VOICE_STATE_UPDATE":
                        await this.voiceStateUpdate(packet.d);
                        break;
                    case "GUILD_CREATE":
                        for (const state of packet.d.voice_states) {
                            await this.voiceStateUpdate({ ...state, guild_id: packet.d.id });
                        }
                        break;
                }
            });
        }
    }
}
exports.Manager = Manager;
//# sourceMappingURL=index.js.map