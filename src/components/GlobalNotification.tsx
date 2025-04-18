import React from "react";
import { Alert } from "./ui/alert";
import { useNotification } from "./NotificationContext";

const typeToVariant = {
  success: undefined,
  info: undefined,
  error: "destructive",
};

export const GlobalNotification: React.FC = () => {
  const { notification, clearNotification } = useNotification();

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full max-w-md px-2">
      <Alert
        variant={typeToVariant[notification.type]}
        className="shadow-lg cursor-pointer"
        onClick={clearNotification}
      >
        {notification.message}
      </Alert>
    </div>
  );
};
