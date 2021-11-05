import { MessageBar, MessageBarButton, MessageBarType } from "@fluentui/react";
import React from "react";
import { toast } from "react-toastify";

export const successToast = (message: string): void => {
  toast(
    <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
      {message}
    </MessageBar>
  );
};

export const errorToastWithActionButton = (message: string): void => {
  toast(
    ({ closeToast }) => (
      <MessageBar
        actions={
          <div>
            <MessageBarButton onClick={closeToast}>Yes</MessageBarButton>
          </div>
        }
        messageBarType={MessageBarType.blocked}
        isMultiline
      >
        {message}
      </MessageBar>
    ),
    {
      style: {
        height: "100vh",
      },
      autoClose: false,
      closeOnClick: false,
    }
  );
};
