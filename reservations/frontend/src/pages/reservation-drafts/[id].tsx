import { ReservationDraft } from "../../model/reservation-draft";
import TextField from "@mui/material/TextField";
import { Typography, Grid, Button } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import SaveButton from "../../components/buttons/SaveButton";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

// This gets called on every request
export async function getServerSideProps(context: any) {
  const id = context.params.id;
  // Fetch data from external API
  const res = await fetch(
    `http://localhost:4000/api/get-reservation-draft?id=${id}`
  );
  const reservation = await res.json();

  // Pass data to the page via props
  return { props: { reservation } };
}

async function saveReservation(
  reservation: ReservationDraft
): Promise<Boolean> {
  console.log(`Saving `, reservation);
  const res = await fetch(`http://localhost:4000/api/save-reservation`, {
    method: "POST",
    body: JSON.stringify(reservation),
    headers: {
      contentType: "application/json",
    },
  });

  return res.status === 200;
}

const ReservationDraftsDetail = ({
  reservation,
}: {
  reservation: ReservationDraft | null;
}) => {
  if (!reservation) {
    return <Typography variant="h6">Reservation not found</Typography>;
  }

  const [reservationData, setReservation] = useState(reservation);

  const setCustomerData = (data: any) => {
    setReservation({
      ...reservationData,
      customer: {
        ...(reservationData.customer || {}),
        ...data,
      },
    });
  };

  const setReservationData = (data: any) => {
    setReservation({
      ...reservationData,
      reservation: {
        ...(reservationData.reservation || {}),
        ...data,
      },
    });
  };

  const setSourceData = (data: any) => {
    setReservation({
      ...reservationData,
      source: {
        ...(reservationData.source || {}),
        ...data,
      },
    });
  };

  return (
    <Grid container>
      <Grid item md={6}>
        <Typography variant="h6">Customer</Typography>
        <TextField
          id="customer-email"
          label="Email"
          variant="outlined"
          value={reservationData.customer?.email}
          onChange={(e) => setCustomerData({ email: e.target.value })}
        />
        <TextField
          id="customer-name"
          label="Name"
          variant="outlined"
          value={reservationData.customer?.name}
          onChange={(e) => setCustomerData({ name: e.target.value })}
        />
        <Typography variant="h6">Reservation</Typography>
        <TextField
          id="reservation-checkin"
          label="Checkin"
          variant="outlined"
          value={reservationData.reservation?.checkin}
          onChange={(e) => setReservationData({ checkin: e.target.value })}
        />
        <TextField
          id="reservation-checkout"
          label="Checkout"
          variant="outlined"
          value={reservationData.reservation?.checkout}
          onChange={(e) => setReservationData({ checkout: e.target.value })}
        />

        <TextField
          id="reservation-numadults"
          label="Adults"
          variant="outlined"
          value={reservationData.reservation?.numAdults}
          onChange={(e) => setReservationData({ numAdults: e.target.value })}
        />

        <TextField
          id="reservation-numchildren"
          label="Children"
          variant="outlined"
          value={reservationData.reservation?.numChildren}
          onChange={(e) => setReservationData({ numChildren: e.target.value })}
        />
        <TextField
          id="reservation-roomtype"
          label="Room type"
          variant="outlined"
          value={reservationData.reservation?.roomType}
          onChange={(e) => setReservationData({ roomType: e.target.value })}
        />

        <TextField
          id="reservation-specialrequests"
          label="Special requests"
          variant="outlined"
          value={reservationData.reservation?.specialRequests}
          onChange={(e) =>
            setReservationData({ specialRequests: e.target.value })
          }
        />

        <Typography variant="h6">Source</Typography>
        <TextField
          id="source-origin"
          label="Origin"
          variant="outlined"
          value={reservationData.source?.origin}
          onChange={(e) => setSourceData({ origin: e.target.value })}
        />
        <TextField
          id="source-id"
          label="ID"
          variant="outlined"
          value={reservationData.source?.reservationId}
          onChange={(e) => setSourceData({ reservationId: e.target.value })}
        />
      </Grid>

      <Grid item md={6}>
        <DynamicReactJson src={reservationData} />
      </Grid>
      <Grid item md={12}>
        <SaveButton onClick={() => saveReservation(reservationData)} />
      </Grid>
    </Grid>
  );
};

export default ReservationDraftsDetail;
