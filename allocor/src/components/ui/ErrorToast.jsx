import styles from "./ErrorToast.module.css";
import { useUI } from "../../store/ui-context";
import Button from "./Button";
import { cn } from "../../utils/cn";

const ErrorToast = () => {
  const { applicationError, applicationErrorIsFadingOut } = useUI();

  if (!applicationError) return <></>;

  return (
    <div
      className={cn(
        styles.errorMessageWrapper,
        applicationErrorIsFadingOut && styles.errorMessageFadingOut
      )}
    >
      <Button
        text={
          typeof applicationError === "boolean"
            ? "Something Went Wrong"
            : applicationError
        }
        red={true}
      />
    </div>
  );
};

export default ErrorToast;
