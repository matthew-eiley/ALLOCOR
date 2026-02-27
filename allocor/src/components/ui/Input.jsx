import styles from "./Input.module.css";

const Input = ({
  value,
  onChange,
  placeholder = false,
  type = false,
  onKeyDown = null,
}) => {
  return (
    <div className={styles.container}>
      <input
        type={type || "text"}
        className={styles.input}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder || ""}
        onKeyDown={onKeyDown}
      ></input>
    </div>
  );
};

export default Input;
