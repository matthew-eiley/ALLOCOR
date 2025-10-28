import { useState } from "react";
import styles from "./PasswordResetPage.module.css";
import { sleep } from "../utils/time";
import { useUI } from "../store/ui-context";
import ErrorToast from "../components/ui/ErrorToast";
import SuccessToast from "../components/ui/SuccessToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const {
    setApplicationError,
    applicationError,
    applicationSuccess,
    setApplicationSuccess,
  } = useUI();

  const handlePasswordSubmit = async () => {
    // add validation that the new password is secure...
    if (newPassword.length < 9) {
      setApplicationError("New Password is Too Short");
      return;
    }

    // check if newPassword and confirmPassword are the same
    if (newPassword !== confirmPassword) {
      setApplicationError("New Password And Confirm Don't Match");
      return;
    }

    setPasswordLoading(true);
    // const response = await fetch("/api/user/reset-password", {
    //   method: "PATCH",
    //   body: JSON.stringify({
    //     newPassword: newPassword,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const responseData = await response.json();

    // test begin
    const responseData = { message: "Wrong Password" };
    // const response = { ok: false, status: 403  };
    const response = { ok: true, status: 200 };
    await sleep(1000);
    // test end

    if (response.status === 403 && responseData.message === "Wrong Password") {
      setPasswordLoading(false);
      setApplicationError(responseData.message);
      return;
    } else if (response.status !== 200) {
      // Handle other non-200 responses if needed
      setPasswordLoading(false);
      setApplicationError(true);
      return;
    } else {
      setPasswordLoading(false);
      // Handle the success case
      setNewPassword("");
      setConfirmPassword("");
      setApplicationSuccess("Password Changed");
      setApplicationError("");
    }
  };

  return (
    <div className={styles.container}>
      {applicationError && <ErrorToast />}
      {applicationSuccess && <SuccessToast />}
      <p className={styles.text}>Reset Password</p>
      <div className={styles.resetContainer}>
        <Input
          title="New Password"
          placeholder="Enter Your New Password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          sixteenFont={true}
        />
        <Input
          title="Confirm Password"
          placeholder="Confirm Your New Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePasswordSubmit(e);
            }
          }}
          sixteenFont={true}
        />
        <div className={styles.buttonWrapper}>
          <Button
            onClick={handlePasswordSubmit}
            text={"Change Password"}
            isLoading={passwordLoading}
          />
        </div>
      </div>
    </div>
  );
};

// const PasswordResetPage = () => {
//   return <div className={styles.container}></div>;
// };

export default PasswordResetPage;
