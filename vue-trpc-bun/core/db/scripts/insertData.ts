import {
  db,
  CategoryRepository,
  CategoryService,
  CustomerRepository,
  CustomerService,
  IssueRepository,
  IssueService,
  ChangeLogEntryRepository,
  ChangeLogEntryService,
  SystemRepository,
  SystemService,
  TimeEntryRepository,
  TimeEntryService,
  OutgoingEmailRepository,
  OutgoingEmailService,
  UserRepository,
  UserService,
  CommitRepository,
  CommitService,
} from "@hub/core";

const categoryService = new CategoryService(new CategoryRepository(db));
const customerService = new CustomerService(new CustomerRepository(db));
const issueService = new IssueService(new IssueRepository(db));
const changelogService = new ChangeLogEntryService(
  new ChangeLogEntryRepository(db)
);
const systemService = new SystemService(new SystemRepository(db));
const timeEntryService = new TimeEntryService(new TimeEntryRepository(db));
const commitService = new CommitService(new CommitRepository(db));
const userService = new UserService(new UserRepository(db));

type SystemResponse =
  | {
      id?: string | undefined;
      createdAtUtc?: string | undefined;
      name: string;
    }[]
  | undefined;

const app_users = [
  {
    email: "robin.karlsson@reges.se",
    providerId: "Pl15oSwZWaZBh8F4bq0zWcruej72",
  },
  {
    email: "davud@reges.se",
    providerId: "vKSXZBp0JsSF2LeE7bXO02IKQpH3",
  },
  {
    email: "erik@reges.se",
    providerId: "UOVZN6fY8veB3Vy0rN9hMiwKAT13",
    associatedEmails: ["erik.celander@reges.se"],
  },
  {
    email: "felix.gustafsson@reges.se",
    providerId: "sIlwYXCWHUeiGTxIckGH8vjvYIA3",
  },
  {
    email: "mohanad.oweidat@reges.se",
    providerId: "cEq3FtR22ATIFznRgf5hYHR9g2I2",
  },
  {
    email: "philip@reges.se",
    providerId: "YEYre9MYkOaDvsJiTdXgTYBRciP2",
  },
  {
    email: "rasmus@reges.se",
    providerId: "7Kg5kjvba5RiAdnR2iUAhLBapHy1",
  },
  {
    email: "servicedesk@reges.se",
    providerId: "ARb8XJ4FCuPaOo5MfZr87jEOiCw2",
  },
];

const systems = [
  { name: "traind" },
  { name: "tempo" },
  { name: "dsp" },
  { name: "regga" },
  { name: "avik" },
  { name: "eam" },
  { name: "mpk" },
  { name: "its" },
  { name: "hub" },
  { name: "replacement-traffic" },
  { name: "commando" },
  { name: "tempo" },
  { name: "checklist-mobile" },
  { name: "infrainfo" },
  { name: "iss-nattåg" },
];

db.transaction(async (tx) => {
  let createdUsers;
  try {
    const UR = new UserRepository(db);
    createdUsers = await Promise.all(
      app_users.map((user) => {
        return UR.createUser(
          user.email,
          user.providerId,
          "30b13034-5967-4b9d-940d-4e56e6bfaab9",
          user.associatedEmails ? user.associatedEmails : [user.email]
        );
      })
    );
  } catch (error) {
    console.log(error);
  }

  console.log(createdUsers);

  let createdSystems;
  try {
    const data = systems.map((system) => ({
      ...system,
      createdBy: "30b13034-5967-4b9d-940d-4e56e6bfaab9",
      updatedBy: "30b13034-5967-4b9d-940d-4e56e6bfaab9",
    }));
    createdSystems = await systemService.createSystems(data);
    console.log("created systems: ", createdSystems);
  } catch (error) {
    console.log(error);
  }

  if (createdSystems) {
    const ids: Map<string, string> = new Map(
      createdSystems.map((system) => {
        return [system.name, system.id];
      })
    );

    const customers = [
      {
        name: "Alstom",
        emailDomains: ["alstomgroup.com"],
        systemIds: [ids.get("eam")!],
      },
      {
        name: "Vr",
        emailDomains: [
          "vr.fi",
          "vrsverige.com",
          "vrresa.se",
          "tagibergslagen.se",
          "mtr.se",
        ],
        systemIds: [
          ids.get("traind")!,
          ids.get("dsp")!,
          ids.get("replacement-traffic")!,
          ids.get("commando")!,
          ids.get("tempo")!,
          ids.get("checklist-mobile")!,
          ids.get("infrainfo")!,
        ],
      },
      {
        name: "Reges",
        emailDomains: ["reges.se"],
        systemIds: [ids.get("hub")!],
      },
      { name: "Mtrx", emailDomains: [], systemIds: [ids.get("traind")!] },
      {
        name: "Transdev",
        emailDomains: ["transdev.se"],
        systemIds: [ids.get("traind")!, ids.get("regga")!],
      },
      {
        name: "Skånetrafiken",
        emailDomains: ["skanetrafiken.se"],
        systemIds: [],
      },
      { name: "ISS", emailDomains: ["se.issworld.com"], systemIds: [] },
      {
        name: "Trafikverket",
        emailDomains: ["trafikverket.se"],
        systemIds: [ids.get("iss-nattåg")!],
      },
      {
        name: "SJ",
        emailDomains: ["sj.se"],
        systemIds: [ids.get("traind")!, ids.get("avik")!],
      },
      {
        name: "Snällttåget",
        emailDomains: ["snalltaget.se"],
        systemIds: [ids.get("traind")!],
      },
    ];

    console.log("Customers: ", customers);

    try {
      const customersData = customers.map((customer) => ({
        ...customer,
        createdBy: "30b13034-5967-4b9d-940d-4e56e6bfaab9",
        updatedBy: "30b13034-5967-4b9d-940d-4e56e6bfaab9",
      }));
      const customerResponse =
        await customerService.createCustomers(customersData);
      console.log("created customers: ", customerResponse);
    } catch (error) {
      console.log(error);
    }
  }
});
