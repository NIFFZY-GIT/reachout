#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/07202b3540c075fe663ae32778d458aa99b1c0d057ac77fe4bcbf794ff9dc853/contract';
import endContract from '../../snapshots/07202b3540c075fe663ae32778d458aa99b1c0d057ac77fe4bcbf794ff9dc853/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'ConversationStatus',
        members: ['OPEN', 'RESOLVED', 'ARCHIVED'],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'DeletionStatus',
        members: ['NONE', 'PENDING', 'COMPLETED'],
      }),
      this.createNativeEnumType({ schema: 'public', typeName: 'Role', members: ['USER', 'ADMIN'] }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'SafetyFlag',
        members: ['NORMAL', 'NEEDS_ATTENTION', 'URGENT_SAFETY_CONCERN'],
      }),
      this.createTable({
        schema: 'public',
        table: 'AdminMessage',
        columns: [
          col('conversationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isRead', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('messageType', 'text', {
            notNull: true,
            default: lit('TEXT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('readAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('senderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('senderRole', '"Role"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'Role' } },
          }),
          col('text', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AdminNote',
        columns: [
          col('adminId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('conversationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('note', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Conversation',
        columns: [
          col('adminUnreadCount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('deletionScheduledAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('deletionStatus', '"DeletionStatus"', {
            notNull: true,
            default: lit('NONE'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'DeletionStatus' } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lastMessage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('lastMessageAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('lastMessageSender', '"Role"', {
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'Role' } },
          }),
          col('safetyFlag', '"SafetyFlag"', {
            notNull: true,
            default: lit('NORMAL'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'SafetyFlag' } },
          }),
          col('status', '"ConversationStatus"', {
            notNull: true,
            default: lit('OPEN'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'ConversationStatus' } },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userUnreadCount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('displayName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lastSeen', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', '"Role"', {
            notNull: true,
            default: lit('USER'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'Role' } },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'UserMessage',
        columns: [
          col('conversationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isRead', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('messageType', 'text', {
            notNull: true,
            default: lit('TEXT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('readAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('senderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('senderRole', '"Role"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'Role' } },
          }),
          col('text', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'UserSession',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('expiresAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lastActivityAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('revokedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-date@1', typeParams: { precision: 3 } },
          }),
          col('sessionTokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminMessage',
        index: 'AdminMessage_conversationId_createdAt_idx',
        columns: ['conversationId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminNote',
        index: 'AdminNote_conversationId_idx',
        columns: ['conversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Conversation',
        index: 'Conversation_deletionStatus_deletionScheduledAt_idx',
        columns: ['deletionStatus', 'deletionScheduledAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Conversation',
        index: 'Conversation_lastMessageAt_idx',
        columns: ['lastMessageAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Conversation',
        index: 'Conversation_status_idx',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Conversation',
        index: 'Conversation_userId_idx',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_email_key',
        columns: ['email'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_username_key',
        columns: ['username'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserMessage',
        index: 'UserMessage_conversationId_createdAt_idx',
        columns: ['conversationId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserSession',
        index: 'UserSession_expiresAt_idx',
        columns: ['expiresAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserSession',
        index: 'UserSession_sessionTokenHash_key',
        columns: ['sessionTokenHash'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserSession',
        index: 'UserSession_userId_idx',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminMessage',
        foreignKey: {
          name: 'AdminMessage_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'Conversation', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminNote',
        foreignKey: {
          name: 'AdminNote_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'Conversation', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminNote',
        foreignKey: {
          name: 'AdminNote_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Conversation',
        foreignKey: {
          name: 'Conversation_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserMessage',
        foreignKey: {
          name: 'UserMessage_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'Conversation', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserSession',
        foreignKey: {
          name: 'UserSession_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
