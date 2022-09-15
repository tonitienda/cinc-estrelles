import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dynamic from "next/dynamic";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

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
  {
    field: "id",
    headerName: "edit",
    width: 70,
    renderCell: ({ row }: GridRenderCellParams<any>) => (
      <Link href={`reservation-drafts/${row.id}`}>
        <a>
          <EditIcon />
        </a>
      </Link>
    ),
  },

  {
    field: "customer",
    headerName: "Customer",
    width: 230,
    renderCell: ({ row }: GridRenderCellParams<any>) => (
      <ListItemText
        primary={row.customer?.name}
        secondary={row.customer?.email}
      />
    ),
  },
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
    renderCell: ({ row }: GridRenderCellParams<any>) =>
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
    width: 120,
    renderCell: ({ row }: GridRenderCellParams<any>) => (
      <ListItemText
        primary={row.source?.origin}
        secondary={row.source?.reservationId}
      />
    ),
  },
  {
    field: "raw",
    headerName: "Request",
    width: 500,
    renderCell: ({ row }: GridRenderCellParams<any>) => {
      return (
        <>
          <IconButton aria-label="expand row" size="small">
            <KeyboardArrowDownIcon />
          </IconButton>
          <Collapse
            in={true}
            timeout="auto"
            unmountOnExit
            style={{ height: "fit-content" }}
          >
            <Box sx={{ margin: 1 }}>
              <DynamicReactJson src={row} />
            </Box>
          </Collapse>
        </>
      );
    },
  },
];

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://localhost:4000/api/find-reservation-drafts`);
  const reservations = await res.json();

  // Pass data to the page via props
  return { props: { reservations } };
}

const Reservations = ({ reservations }: { reservations: any[] }) => (
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
