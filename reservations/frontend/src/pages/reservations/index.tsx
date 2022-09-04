import { List, ListItem, ListItemText } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Reservation } from "../../model/reservation";

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
  {
    field: "roomType",
    headerName: "Room Type",
    width: 80,
  },
  {
    field: "source",
    headerName: "Source",
    width: 80,
    renderCell: ({ row }: GridRenderCellParams<Reservation>) => (
      <ListItemText
        primary={row.source.origin}
        secondary={row.source.reservationId}
      />
    ),
  },
];

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://localhost:4000/api/find-reservations`);
  const reservations = await res.json();

  // Pass data to the page via props
  return { props: { reservations } };
}

const Reservations = ({ reservations }: { reservations: Reservation[] }) => (
  <div style={{ height: "600px", width: "100%" }}>
    <DataGrid
      rows={reservations}
      columns={columns}
      pageSize={25}
      rowsPerPageOptions={[25, 50]}
    />
  </div>
);

export default Reservations;
