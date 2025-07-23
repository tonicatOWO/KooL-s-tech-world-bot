import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Command {
  @Slash({ description: "ping" })
  async ping(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("pong!");
  }
}
