import { Button, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

type SaveButtonProps = {
  onClick: () => Promise<Boolean>;
};

export default function SaveButton(props: SaveButtonProps) {
  const [processing, setProcessing] = useState(false);

  return (
    <Button
      disabled={processing}
      onClick={async () => {
        setProcessing(true);
        const success = await props.onClick();
        setProcessing(false);
        return success;
      }}
      variant="contained"
      endIcon={processing ? <CircularProgress size={16} /> : <SaveIcon />}
    >
      Save
    </Button>
  );
}
