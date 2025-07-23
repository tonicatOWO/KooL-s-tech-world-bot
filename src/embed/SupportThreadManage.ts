import 'reflect-metadata';
import { Discord, Slash, ButtonComponent, On } from 'discordx';
import {
  CommandInteraction,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

@Discord()
export class Example {
  @On()
  threadCreate([thread]: [any]): void {
    console.log(
      'Thread created:',
      thread.name,
      'in channel:',
      thread.parent?.name,
      'by',
      thread.ownerId
    );
  };
  @ButtonComponent({ id: 'hello' })
  async handler(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply(':wave:');
  }

  @Slash({ description: 'test' })
  async test(interaction: CommandInteraction): Promise<void> {
    const btn = new ButtonBuilder()
      .setLabel('Hello')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('hello');

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);

    await interaction.reply({
      components: [buttonRow],
    });
  }
}
