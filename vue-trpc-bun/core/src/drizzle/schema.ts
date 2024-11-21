import {
  pgTable,
  varchar,
  index,
  foreignKey,
  uuid,
  timestamp,
  text,
  serial,
  integer,
  unique,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const schemaMigrations = pgTable("schema_migrations", {
  version: varchar("version", { length: 128 }).primaryKey().notNull(),
});

export const timeEntry = pgTable(
  "time_entry",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    createdBy: uuid("created_by").notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAtUtc: timestamp("updated_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    userId: uuid("user_id").notNull(),
    timeStart: timestamp("time_start", { mode: "string" }).notNull(),
    timeEnd: timestamp("time_end", { mode: "string" }).notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      idx: index("time_entry_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
      ),
      timeEntryCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [appUser.id],
        name: "time_entry_created_by_fkey",
      }),
      timeEntryUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [appUser.id],
        name: "time_entry_updated_by_fkey",
      }),
      fkUserId: foreignKey({
        columns: [table.userId],
        foreignColumns: [appUser.id],
        name: "fk_user_id",
      }).onDelete("cascade"),
    };
  },
);

export const commit = pgTable(
  "commit",
  {
    id: varchar("id", { length: 200 }).primaryKey().notNull(),
    createdBy: varchar("created_by", { length: 200 }).notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    commitCreatedAt: timestamp("commit_created_at", {
      mode: "string",
    }).notNull(),
    message: text("message").notNull(),
    repo: varchar("repo", { length: 200 }).notNull(),
    branch: varchar("branch", { length: 200 }).notNull(),
    author: varchar("author", { length: 200 }),
    userId: uuid("user_id"),
    timeEntryId: uuid("time_entry_id"),
    url: varchar("url", { length: 200 }).default(sql`NULL`),
  },
  (table) => {
    return {
      appUserIdx: index("commit_app_user_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
      ),
      idx: index("commit_idx").using(
        "btree",
        table.timeEntryId.asc().nullsLast(),
      ),
      commitTimeEntryIdFkey: foreignKey({
        columns: [table.timeEntryId],
        foreignColumns: [timeEntry.id],
        name: "commit_time_entry_id_fkey",
      }).onDelete("set null"),
    };
  },
);

export const player = pgTable("player", {
  name: varchar("name", { length: 255 }).primaryKey().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
});

export const result = pgTable("result", {
  id: serial("id").primaryKey().notNull(),
  gamePlayedAt: timestamp("game_played_at", { mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  player1: varchar("player1", { length: 255 }),
  player2: varchar("player2", { length: 255 }),
  player1Score: integer("player1_score").notNull(),
  player2Score: integer("player2_score").notNull(),
});

export const issue = pgTable("issue", {
  id: varchar("id", { length: 200 }).primaryKey().notNull(),
  parentId: varchar("parent_id", { length: 200 }),
  accountId: varchar("account_id", { length: 200 }),
  createdBy: varchar("created_by", { length: 200 }).notNull(),
  createdAtUtc: timestamp("created_at_utc", { mode: "string" })
    .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
    .notNull(),
  issueCreatedAt: timestamp("issue_created_at", { mode: "string" }).notNull(),
  title: varchar("title", { length: 200 }),
  description: text("description"),
  issueType: varchar("issue_type", { length: 200 }),
  status: varchar("status", { length: 200 }),
  url: varchar("url", { length: 200 }).default(sql`NULL`),
});

export const system = pgTable(
  "system",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    createdBy: uuid("created_by").notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAtUtc: timestamp("updated_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    name: varchar("name", { length: 200 }).notNull(),
  },
  (table) => {
    return {
      systemCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [appUser.id],
        name: "system_created_by_fkey",
      }),
      systemUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [appUser.id],
        name: "system_updated_by_fkey",
      }),
    };
  },
);

export const outgoingEmail = pgTable(
  "outgoing_email",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    createdBy: uuid("created_by").notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAtUtc: timestamp("updated_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    recipient: varchar("recipient", { length: 255 }).notNull(),
    timeEntryId: uuid("time_entry_id"),
    webLink: varchar("web_link", { length: 255 }).notNull(),
    desktopLink: varchar("desktop_link", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      timeEntryIdx: index("outgoing_email_time_entry_idx").using(
        "btree",
        table.timeEntryId.asc().nullsLast(),
      ),
      outgoingEmailCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [appUser.id],
        name: "outgoing_email_created_by_fkey",
      }),
      outgoingEmailUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [appUser.id],
        name: "outgoing_email_updated_by_fkey",
      }),
      outgoingEmailTimeEntryIdFkey: foreignKey({
        columns: [table.timeEntryId],
        foreignColumns: [timeEntry.id],
        name: "outgoing_email_time_entry_id_fkey",
      }).onDelete("set null"),
      uniqueWebLink: unique("unique_web_link").on(table.webLink),
    };
  },
);

export const customer = pgTable(
  "customer",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    createdBy: uuid("created_by").notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAtUtc: timestamp("updated_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    emailDomains: varchar("email_domains").array().notNull(),
    color: varchar("color", { length: 50 }),
  },
  (table) => {
    return {
      customerCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [appUser.id],
        name: "customer_created_by_fkey",
      }),
      customerUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [appUser.id],
        name: "customer_updated_by_fkey",
      }),
    };
  },
);

export const changeLogEntry = pgTable(
  "change_log_entry",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    createdBy: uuid("created_by").notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAtUtc: timestamp("updated_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    categoryId: uuid("category_id").notNull(),
    systemId: uuid("system_id").notNull(),
    description: varchar("description", { length: 200 }).notNull(),
    date: timestamp("date", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      categoryIdx: index("change_log_entry_category_idx").using(
        "btree",
        table.categoryId.asc().nullsLast(),
      ),
      systemIdx: index("change_log_entry_system_idx").using(
        "btree",
        table.systemId.asc().nullsLast(),
      ),
      changeLogEntryCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [appUser.id],
        name: "change_log_entry_created_by_fkey",
      }),
      changeLogEntryUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [appUser.id],
        name: "change_log_entry_updated_by_fkey",
      }),
      fkChangeLogEntriesCategoryId: foreignKey({
        columns: [table.categoryId],
        foreignColumns: [category.id],
        name: "fk_change_log_entries_category_id",
      }),
      fkChangeLogEntriesSystemId: foreignKey({
        columns: [table.systemId],
        foreignColumns: [system.id],
        name: "fk_change_log_entries_system_id",
      }),
    };
  },
);

export const category = pgTable(
  "category",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    createdBy: uuid("created_by").notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAtUtc: timestamp("updated_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    name: varchar("name", { length: 200 }).notNull(),
  },
  (table) => {
    return {
      categoryCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [appUser.id],
        name: "category_created_by_fkey",
      }),
      categoryUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [appUser.id],
        name: "category_updated_by_fkey",
      }),
    };
  },
);

export const appUser = pgTable(
  "app_user",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    providerId: varchar("provider_id", { length: 200 }).notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    associatedEmails: varchar("associated_emails", { length: 200 }).array(),
    microsoftGraphId: text("microsoft_graph_id"),
  },
  (table) => {
    return {
      appUserEmailKey: unique("app_user_email_key").on(table.email),
    };
  },
);

export const meeting = pgTable(
  "meeting",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    timeEntryId: uuid("time_entry_id"),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    createdBy: uuid("created_by").notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAtUtc: timestamp("updated_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
    userId: uuid("user_id").notNull(),
    subject: varchar("subject", { length: 255 }),
    startTime: timestamp("start_time", { mode: "string" }).notNull(),
    endTime: timestamp("end_time", { mode: "string" }).notNull(),
    changeKey: varchar("change_key", { length: 255 }),
    isCancelled: boolean("is_cancelled").default(false),
    organizerEmail: varchar("organizer_email", { length: 255 }),
    attendees: varchar("attendees", { length: 255 }).array(),
  },
  (table) => {
    return {
      idxMeetingChangeKey: index("idx_meeting_change_key").using(
        "btree",
        table.changeKey.asc().nullsLast(),
      ),
      idxMeetingUserTime: index("idx_meeting_user_time").using(
        "btree",
        table.userId.asc().nullsLast(),
        table.startTime.asc().nullsLast(),
        table.endTime.asc().nullsLast(),
      ),
      idx: index("meeting_idx").using("btree", table.userId.asc().nullsLast()),
      meetingTimeEntryIdFkey: foreignKey({
        columns: [table.timeEntryId],
        foreignColumns: [timeEntry.id],
        name: "meeting_time_entry_id_fkey",
      }),
      meetingCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [appUser.id],
        name: "meeting_created_by_fkey",
      }),
      meetingUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [appUser.id],
        name: "meeting_updated_by_fkey",
      }),
      fkUserId: foreignKey({
        columns: [table.userId],
        foreignColumns: [appUser.id],
        name: "fk_user_id",
      }).onDelete("cascade"),
    };
  },
);

export const commitIssue = pgTable(
  "commit_issue",
  {
    commitId: varchar("commit_id", { length: 200 }).notNull(),
    issueId: varchar("issue_id", { length: 200 }).notNull(),
  },
  (table) => {
    return {
      idIdx: index("commit_issue_id_idx").using(
        "btree",
        table.commitId.asc().nullsLast(),
        table.issueId.asc().nullsLast(),
      ),
      fkCommitIssueCommitId: foreignKey({
        columns: [table.commitId],
        foreignColumns: [commit.id],
        name: "fk_commit_issue_commit_id",
      }).onDelete("cascade"),
      fkCommitIssueIssueId: foreignKey({
        columns: [table.issueId],
        foreignColumns: [issue.id],
        name: "fk_commit_issue_issue_id",
      }).onDelete("cascade"),
      commitIssuePkey: primaryKey({
        columns: [table.commitId, table.issueId],
        name: "commit_issue_pkey",
      }),
    };
  },
);

export const timeEntryCustomer = pgTable(
  "time_entry_customer",
  {
    customerId: uuid("customer_id").notNull(),
    timeEntryId: uuid("time_entry_id").notNull(),
  },
  (table) => {
    return {
      customerIdx: index("time_entry_customer_customer_idx").using(
        "btree",
        table.customerId.asc().nullsLast(),
      ),
      timeEntryIdx: index("time_entry_customer_time_entry_idx").using(
        "btree",
        table.timeEntryId.asc().nullsLast(),
      ),
      fkTimeEntryCustomerId: foreignKey({
        columns: [table.customerId],
        foreignColumns: [customer.id],
        name: "fk_time_entry_customer_id",
      }).onDelete("cascade"),
      fkTimeEntryCustomerTimeEntryId: foreignKey({
        columns: [table.timeEntryId],
        foreignColumns: [timeEntry.id],
        name: "fk_time_entry_customer_time_entry_id",
      }).onDelete("cascade"),
      timeEntryCustomerPkey: primaryKey({
        columns: [table.customerId, table.timeEntryId],
        name: "time_entry_customer_pkey",
      }),
    };
  },
);

export const changeLogEntryCustomer = pgTable(
  "change_log_entry_customer",
  {
    changeLogEntriesId: uuid("change_log_entries_id").notNull(),
    customerId: uuid("customer_id").notNull(),
  },
  (table) => {
    return {
      customerIdx: index("change_log_entry_customers_customer_idx").using(
        "btree",
        table.customerId.asc().nullsLast(),
      ),
      entriesIdx: index("change_log_entry_customers_entries_idx").using(
        "btree",
        table.changeLogEntriesId.asc().nullsLast(),
      ),
      fkChangeLogEntriesCustomersChangeLogEntriesId: foreignKey({
        columns: [table.changeLogEntriesId],
        foreignColumns: [changeLogEntry.id],
        name: "fk_change_log_entries_customers_change_log_entries_id",
      }).onDelete("cascade"),
      fkChangeLogEntriesCustomersCustomerId: foreignKey({
        columns: [table.customerId],
        foreignColumns: [customer.id],
        name: "fk_change_log_entries_customers_customer_id",
      }).onDelete("cascade"),
      changeLogEntryCustomerPkey: primaryKey({
        columns: [table.changeLogEntriesId, table.customerId],
        name: "change_log_entry_customer_pkey",
      }),
    };
  },
);

export const customerIssue = pgTable(
  "customer_issue",
  {
    customerId: uuid("customer_id").notNull(),
    issueId: varchar("issue_id", { length: 200 }).notNull(),
  },
  (table) => {
    return {
      customerIdx: index("customer_issue_customer_idx").using(
        "btree",
        table.customerId.asc().nullsLast(),
      ),
      issueIdx: index("customer_issue_issue_idx").using(
        "btree",
        table.issueId.asc().nullsLast(),
      ),
      fkCustomerIssuesCustomerId: foreignKey({
        columns: [table.customerId],
        foreignColumns: [customer.id],
        name: "fk_customer_issues_customer_id",
      }).onDelete("cascade"),
      fkCustomerIssuesIssueId: foreignKey({
        columns: [table.issueId],
        foreignColumns: [issue.id],
        name: "fk_customer_issues_issue_id",
      }).onDelete("cascade"),
      customerIssuePkey: primaryKey({
        columns: [table.customerId, table.issueId],
        name: "customer_issue_pkey",
      }),
    };
  },
);

export const customerSystem = pgTable(
  "customer_system",
  {
    systemId: uuid("system_id").notNull(),
    customerId: uuid("customer_id").notNull(),
    createdAtUtc: timestamp("created_at_utc", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`)
      .notNull(),
  },
  (table) => {
    return {
      customersSystemCustomerIdx: index("customers_system_customer_idx").using(
        "btree",
        table.customerId.asc().nullsLast(),
      ),
      customersSystemSystemIdx: index("customers_system_system_idx").using(
        "btree",
        table.systemId.asc().nullsLast(),
      ),
      fkCustomerSystemsCustomerId: foreignKey({
        columns: [table.customerId],
        foreignColumns: [customer.id],
        name: "fk_customer_systems_customer_id",
      }).onDelete("cascade"),
      fkCustomerSystemsSystemId: foreignKey({
        columns: [table.systemId],
        foreignColumns: [system.id],
        name: "fk_customer_systems_system_id",
      }).onDelete("cascade"),
      customerSystemPkey: primaryKey({
        columns: [table.systemId, table.customerId],
        name: "customer_system_pkey",
      }),
    };
  },
);
