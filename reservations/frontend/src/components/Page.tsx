import { Paper } from "@mui/material";
import styles from "../styles/Page.module.css";

const Page = (props: any) => (
  <Paper elevation={1} square={true} className={styles.container}>
    {props.children}
  </Paper>
);

export default Page;
