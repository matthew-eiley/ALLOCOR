import styles from "./SuccessToast.module.css";
import { useUI } from "../../store/ui-context";
import Button from "./Button";
import { cn } from "../../utils/cn";

const SuccessToast = () => {
  const { applicationSuccess, applicationSuccessIsFadingOut } = useUI();

  if (!applicationSuccess) return <></>;

  return (
    <div
      className={cn(
        styles.messageWrapper,
        applicationSuccessIsFadingOut && styles.messageFadingOut
      )}
    >
      <Button
        text={
          typeof applicationSuccess === "boolean"
            ? "Something Went Wrong"
            : applicationSuccess
        }
        green={true}
      />
    </div>
  );
};

export default SuccessToast;
