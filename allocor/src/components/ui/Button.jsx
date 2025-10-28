import styles from "./Button.module.css";
import { cn } from "../../utils/cn";
import CircularProgress from "@mui/material/CircularProgress";

const Button = ({
  isLoading = false,
  onClick = () => {},
  text = "",
  red = false,
  green = false,
}) => {
  return (
    <div
      className={cn(styles.button, red && styles.red, green && styles.green)}
      onClick={onClick}
    >
      <p className={styles.text}>{text || "Next"}</p>
      {isLoading && (
        <CircularProgress
          sx={{
            color: "#fff",
          }}
          size={14}
        />
      )}
    </div>
  );
};

export default Button;
