import { List, ListItem, ListItemText } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type Reservation = {
  id?: string;
  customerName?: string;
  customerEmail?: string;
  checkin?: string;
  checkout?: string;
  numAdults?: number;
  numChildren?: number;
  roomType?: string;
  specialRequests?: string;
  source?: {
    origin: string;
    reservationId: string;
  };
  // Properties not in schema that will be calculated in the backend
  nights: number;
};

const listOf = (elements: (string | null)[]) => (
  <List dense={true} style={{ margin: 0, padding: 0 }}>
    {elements
      .filter((e) => !!e)
      .map((e) => (
        <ListItem style={{ margin: 0, padding: 0 }}>
          <ListItemText primary={e} style={{ margin: 0, padding: 0 }} />
        </ListItem>
      ))}
  </List>
);

const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 70 },
  { field: "customerName", headerName: "Customer name", width: 230 },
  { field: "customerEmail", headerName: "Customer email", width: 230 },
  { field: "checkin", headerName: "Checkin", width: 130, type: "date" },
  {
    field: "nights",
    headerName: "Nights",
    type: "number",
    width: 80,
  },
  {
    field: "guests",
    headerName: "Guests",
    width: 130,
    renderCell: ({ row }: GridRenderCellParams<Reservation>) =>
      listOf([
        row.numAdults ? `adults: ${row.numAdults}` : null,
        row.numChildren ? `children: ${row.numChildren}` : null,
      ]),
  },
];

const FakeReservationsData: Reservation[] = [
  {
    id: "87b26d3d-8338-49bc-9f46-f12dc57cd3ce",
    customerEmail: "jane.doe@example.com",
    customerName: "Jane Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 1,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "c43382f3-f50e-4597-acfa-9d2c3d96ca37",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "d7a4ad66-c095-4e83-b701-489965c64ad3",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "2fcd59ae-da12-4c68-b6fe-2659e91fdaaf",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 3,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "bb362a17-b3c3-4df7-810b-ada45dca4f2c",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "f6e31b51-ae4c-4cae-a746-9f3b37a59bc9",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "f27307c3-9d01-4134-b5c9-d4bca42d616c",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
];

const Reservations = () => (
  <div style={{ height: "600px", width: "100%" }}>
    <DataGrid
      rows={FakeReservationsData}
      columns={columns}
      pageSize={25}
      rowsPerPageOptions={[25, 50]}
    />
  </div>
);

export default Reservations;
