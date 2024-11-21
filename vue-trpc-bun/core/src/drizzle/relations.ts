import { relations } from "drizzle-orm/relations";
import { appUser, timeEntry, commit, system, outgoingEmail, customer, changeLogEntry, category, meeting, commitIssue, issue, timeEntryCustomer, changeLogEntryCustomer, customerIssue, customerSystem } from "./schema";

export const timeEntryRelations = relations(timeEntry, ({one, many}) => ({
	appUser_createdBy: one(appUser, {
		fields: [timeEntry.createdBy],
		references: [appUser.id],
		relationName: "timeEntry_createdBy_appUser_id"
	}),
	appUser_updatedBy: one(appUser, {
		fields: [timeEntry.updatedBy],
		references: [appUser.id],
		relationName: "timeEntry_updatedBy_appUser_id"
	}),
	appUser_userId: one(appUser, {
		fields: [timeEntry.userId],
		references: [appUser.id],
		relationName: "timeEntry_userId_appUser_id"
	}),
	commits: many(commit),
	outgoingEmails: many(outgoingEmail),
	meetings: many(meeting),
	timeEntryCustomers: many(timeEntryCustomer),
}));

export const appUserRelations = relations(appUser, ({many}) => ({
	timeEntries_createdBy: many(timeEntry, {
		relationName: "timeEntry_createdBy_appUser_id"
	}),
	timeEntries_updatedBy: many(timeEntry, {
		relationName: "timeEntry_updatedBy_appUser_id"
	}),
	timeEntries_userId: many(timeEntry, {
		relationName: "timeEntry_userId_appUser_id"
	}),
	systems_createdBy: many(system, {
		relationName: "system_createdBy_appUser_id"
	}),
	systems_updatedBy: many(system, {
		relationName: "system_updatedBy_appUser_id"
	}),
	outgoingEmails_createdBy: many(outgoingEmail, {
		relationName: "outgoingEmail_createdBy_appUser_id"
	}),
	outgoingEmails_updatedBy: many(outgoingEmail, {
		relationName: "outgoingEmail_updatedBy_appUser_id"
	}),
	customers_createdBy: many(customer, {
		relationName: "customer_createdBy_appUser_id"
	}),
	customers_updatedBy: many(customer, {
		relationName: "customer_updatedBy_appUser_id"
	}),
	changeLogEntries_createdBy: many(changeLogEntry, {
		relationName: "changeLogEntry_createdBy_appUser_id"
	}),
	changeLogEntries_updatedBy: many(changeLogEntry, {
		relationName: "changeLogEntry_updatedBy_appUser_id"
	}),
	categories_createdBy: many(category, {
		relationName: "category_createdBy_appUser_id"
	}),
	categories_updatedBy: many(category, {
		relationName: "category_updatedBy_appUser_id"
	}),
	meetings_createdBy: many(meeting, {
		relationName: "meeting_createdBy_appUser_id"
	}),
	meetings_updatedBy: many(meeting, {
		relationName: "meeting_updatedBy_appUser_id"
	}),
	meetings_userId: many(meeting, {
		relationName: "meeting_userId_appUser_id"
	}),
}));

export const commitRelations = relations(commit, ({one, many}) => ({
	timeEntry: one(timeEntry, {
		fields: [commit.timeEntryId],
		references: [timeEntry.id]
	}),
	commitIssues: many(commitIssue),
}));

export const systemRelations = relations(system, ({one, many}) => ({
	appUser_createdBy: one(appUser, {
		fields: [system.createdBy],
		references: [appUser.id],
		relationName: "system_createdBy_appUser_id"
	}),
	appUser_updatedBy: one(appUser, {
		fields: [system.updatedBy],
		references: [appUser.id],
		relationName: "system_updatedBy_appUser_id"
	}),
	changeLogEntries: many(changeLogEntry),
	customerSystems: many(customerSystem),
}));

export const outgoingEmailRelations = relations(outgoingEmail, ({one}) => ({
	appUser_createdBy: one(appUser, {
		fields: [outgoingEmail.createdBy],
		references: [appUser.id],
		relationName: "outgoingEmail_createdBy_appUser_id"
	}),
	appUser_updatedBy: one(appUser, {
		fields: [outgoingEmail.updatedBy],
		references: [appUser.id],
		relationName: "outgoingEmail_updatedBy_appUser_id"
	}),
	timeEntry: one(timeEntry, {
		fields: [outgoingEmail.timeEntryId],
		references: [timeEntry.id]
	}),
}));

export const customerRelations = relations(customer, ({one, many}) => ({
	appUser_createdBy: one(appUser, {
		fields: [customer.createdBy],
		references: [appUser.id],
		relationName: "customer_createdBy_appUser_id"
	}),
	appUser_updatedBy: one(appUser, {
		fields: [customer.updatedBy],
		references: [appUser.id],
		relationName: "customer_updatedBy_appUser_id"
	}),
	timeEntryCustomers: many(timeEntryCustomer),
	changeLogEntryCustomers: many(changeLogEntryCustomer),
	customerIssues: many(customerIssue),
	customerSystems: many(customerSystem),
}));

export const changeLogEntryRelations = relations(changeLogEntry, ({one, many}) => ({
	appUser_createdBy: one(appUser, {
		fields: [changeLogEntry.createdBy],
		references: [appUser.id],
		relationName: "changeLogEntry_createdBy_appUser_id"
	}),
	appUser_updatedBy: one(appUser, {
		fields: [changeLogEntry.updatedBy],
		references: [appUser.id],
		relationName: "changeLogEntry_updatedBy_appUser_id"
	}),
	category: one(category, {
		fields: [changeLogEntry.categoryId],
		references: [category.id]
	}),
	system: one(system, {
		fields: [changeLogEntry.systemId],
		references: [system.id]
	}),
	changeLogEntryCustomers: many(changeLogEntryCustomer),
}));

export const categoryRelations = relations(category, ({one, many}) => ({
	changeLogEntries: many(changeLogEntry),
	appUser_createdBy: one(appUser, {
		fields: [category.createdBy],
		references: [appUser.id],
		relationName: "category_createdBy_appUser_id"
	}),
	appUser_updatedBy: one(appUser, {
		fields: [category.updatedBy],
		references: [appUser.id],
		relationName: "category_updatedBy_appUser_id"
	}),
}));

export const meetingRelations = relations(meeting, ({one}) => ({
	timeEntry: one(timeEntry, {
		fields: [meeting.timeEntryId],
		references: [timeEntry.id]
	}),
	appUser_createdBy: one(appUser, {
		fields: [meeting.createdBy],
		references: [appUser.id],
		relationName: "meeting_createdBy_appUser_id"
	}),
	appUser_updatedBy: one(appUser, {
		fields: [meeting.updatedBy],
		references: [appUser.id],
		relationName: "meeting_updatedBy_appUser_id"
	}),
	appUser_userId: one(appUser, {
		fields: [meeting.userId],
		references: [appUser.id],
		relationName: "meeting_userId_appUser_id"
	}),
}));

export const commitIssueRelations = relations(commitIssue, ({one}) => ({
	commit: one(commit, {
		fields: [commitIssue.commitId],
		references: [commit.id]
	}),
	issue: one(issue, {
		fields: [commitIssue.issueId],
		references: [issue.id]
	}),
}));

export const issueRelations = relations(issue, ({many}) => ({
	commitIssues: many(commitIssue),
	customerIssues: many(customerIssue),
}));

export const timeEntryCustomerRelations = relations(timeEntryCustomer, ({one}) => ({
	customer: one(customer, {
		fields: [timeEntryCustomer.customerId],
		references: [customer.id]
	}),
	timeEntry: one(timeEntry, {
		fields: [timeEntryCustomer.timeEntryId],
		references: [timeEntry.id]
	}),
}));

export const changeLogEntryCustomerRelations = relations(changeLogEntryCustomer, ({one}) => ({
	changeLogEntry: one(changeLogEntry, {
		fields: [changeLogEntryCustomer.changeLogEntriesId],
		references: [changeLogEntry.id]
	}),
	customer: one(customer, {
		fields: [changeLogEntryCustomer.customerId],
		references: [customer.id]
	}),
}));

export const customerIssueRelations = relations(customerIssue, ({one}) => ({
	customer: one(customer, {
		fields: [customerIssue.customerId],
		references: [customer.id]
	}),
	issue: one(issue, {
		fields: [customerIssue.issueId],
		references: [issue.id]
	}),
}));

export const customerSystemRelations = relations(customerSystem, ({one}) => ({
	customer: one(customer, {
		fields: [customerSystem.customerId],
		references: [customer.id]
	}),
	system: one(system, {
		fields: [customerSystem.systemId],
		references: [system.id]
	}),
}));