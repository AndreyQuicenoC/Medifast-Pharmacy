import toast from "react-hot-toast";

export const notify = {
  success: (message) => toast.success(message, { duration: 4000 }),
  error: (message) => toast.error(message, { duration: 5000 }),
  info: (message) => toast(message, { duration: 4000 }),
};
