import 'reflect-metadata';
import { Discord, Slash, ButtonComponent, On } from 'discordx';
import {
  CommandInteraction,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ThreadChannel,
} from 'discord.js';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Discord()
export class SupportThreadManage {
  @On({ event: 'threadCreate' })
  async threadCreate([thread]: [ThreadChannel]): Promise<void> {
    try {
      const threadId: string = thread.id;
      const ownerId: string =
        thread.ownerId || thread.guild?.ownerId || 'system';

      await prisma.threadStatus.create({
        data: {
          id: threadId,
          ownerId,
          lastActivity: new Date(),
        },
      });

      console.log(`support thrad be created ${threadId}`);
    } catch (error) {
      console.error('support thread creating error：', error);
    }
  }

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
