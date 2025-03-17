import { useEffect, useState } from "react";
import styles from "./FeedbackSection.module.scss";
import { MButton } from "../../regular/button/Button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { resetFeedback } from "../../redux/slice/feedback.slice";
import { submitFeedback } from "../../redux/thunx";
type ContactType = "email" | "telegram" | "other";
interface FeedbackState {
  contactType: ContactType;
  contactValue: string;
  message: string;
}

const FeedbackSection = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.feedback);
  const [feedback, setFeedback] = useState<FeedbackState>({
    contactType: "email",
    contactValue: "",
    message: "",
  });

  useEffect(() => {
    if (status === "succeeded") {
      // Reset form on success
      setFeedback({
        contactType: "email",
        contactValue: "",
        message: "",
      });
      // Reset success state after 3 seconds
      const timer = setTimeout(() => dispatch(resetFeedback()), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, dispatch]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate Telegram handle pattern
    if (
      feedback.contactType === "telegram" &&
      !feedback.contactValue.startsWith("t.me/")
    ) {
      dispatch(resetFeedback());
      return;
    }

    dispatch(
      submitFeedback({
        contactType: feedback.contactType,
        contactValue: feedback.contactValue,
        message: feedback.message,
      })
    );
  };
  return (
    <form className={styles.form} onSubmit={handleSubmitFeedback}>
      <div className={styles.contactGroup}>
        <div className={styles.formGroup}>
          <label htmlFor="contactType">Contact Method</label>
          <select
            id="contactType"
            value={feedback.contactType}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                contactType: e.target.value as ContactType,
                contactValue: "",
              })
            }
            className={styles.select}
          >
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
            <option value="other">Other Platform</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contactValue">
            {feedback.contactType === "email" && "Email Address"}
            {feedback.contactType === "telegram" &&
              "Telegram Username (t.me/yborisovp)"}
            {feedback.contactType === "other" && "Social Media Handle"}
          </label>
          <input
            id="contactValue"
            type={feedback.contactType === "email" ? "email" : "text"}
            value={feedback.contactValue}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                contactValue: e.target.value,
              })
            }
            pattern={feedback.contactType === "telegram" ? "t.me/" : undefined}
            placeholder={
              feedback.contactType === "telegram"
                ? "t.me/yborisovp"
                : feedback.contactType === "other"
                ? "Your social media link"
                : "example@email.com"
            }
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={feedback.message}
          onChange={(e) =>
            setFeedback({
              ...feedback,
              message: e.target.value,
            })
          }
          rows={5}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {status === "succeeded" && (
        <div className={styles.success}>
          Thank you! Your feedback has been submitted.
        </div>
      )}

      <MButton
        type="submit"
        isDangerous={status === "loading"}
        isSuggest={true}
        className={styles.submitButton}
      >
        Send Feedback
      </MButton>
    </form>
  );
};

export default FeedbackSection;
